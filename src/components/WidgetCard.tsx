import React, { useEffect, useState, useCallback, useRef } from 'react';
import { RefreshCw, Trash2, Settings, GripVertical, Clock, ArrowUpRight } from 'lucide-react';
import { DisplayMode, WidgetData } from '../types';
import { fetchFinanceData } from '../services/api';
import { formatCurrency, formatTime, getValueByPath } from '../utils/helpers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDrag, useDrop } from 'react-dnd';

interface WidgetCardProps {
  widget: WidgetData;
  index: number;
  onRemove: (id: string) => void;
  onRefresh: (id: string, data: any) => void;
  onEdit: (widget: WidgetData) => void;
  moveWidget: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const WidgetCard: React.FC<WidgetCardProps> = ({ 
  widget, 
  index, 
  onRemove, 
  onRefresh, 
  onEdit,
  moveWidget 
}) => {
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const intervalRef = useRef<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);


  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: string | symbol | null }>({
    accept: 'widget',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveWidget(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'widget',
    item: () => {
      return { id: widget.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const performFetch = useCallback(async () => {
    setLocalLoading(true);
    setError(null);
    try {
      const data = await fetchFinanceData(widget.config.apiUrl);
      onRefresh(widget.id, data);
      
      if (widget.config.selectedFields.length > 0) {
        const primaryValue = parseFloat(getValueByPath(data, widget.config.selectedFields[0].path));
        if (!isNaN(primaryValue)) {
          setHistory(prev => [...prev.slice(-19), { time: formatTime(new Date()), value: primaryValue }]);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLocalLoading(false);
    }
  }, [widget.config.apiUrl, widget.config.selectedFields, widget.id, onRefresh]);

  useEffect(() => {
    performFetch();
    intervalRef.current = window.setInterval(performFetch, widget.config.refreshInterval * 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [performFetch, widget.config.refreshInterval]);

  const renderContent = () => {
    if (error) return (
      <div className="p-8 flex flex-col items-center justify-center text-center space-y-2">
        <div className="p-3 bg-red-500/10 rounded-full">
          <RefreshCw className="w-6 h-6 text-red-400" />
        </div>
        <p className="text-sm text-red-400 font-medium">Failed to update</p>
        <p className="text-xs text-slate-500 max-w-[200px]">{error}</p>
      </div>
    );

    if (!widget.lastData) return (
      <div className="p-12 flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500">Initializing connection...</p>
      </div>
    );

    switch (widget.config.displayMode) {
      case DisplayMode.TABLE:
        const tableField = widget.config.selectedFields.find(f => 
          Array.isArray(getValueByPath(widget.lastData, f.path))
        );
        const tableData = tableField ? getValueByPath(widget.lastData, tableField.path) : null;

        if (tableData && Array.isArray(tableData)) {
          const keys = Object.keys(tableData[0] || {}).slice(0, 4);
          return (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/50 text-slate-400 border-y border-slate-800">
                  <tr>
                    {keys.map(k => (
                      <th key={k} className="px-4 py-2 font-medium capitalize">
                        {k.replace('_', ' ')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {tableData.slice(0, 10).map((row, i) => (
                    <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                      {keys.map(k => (
                        <td key={k} className="px-4 py-3 text-slate-300 font-mono">
                          {String(row[k])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        
        return (
          <div className="p-4 space-y-2">
            {widget.config.selectedFields.map(f => (
              <div key={f.path} className="flex justify-between items-center py-2 border-b border-slate-800/50 last:border-0">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{f.label}</span>
                <span className="text-sm font-mono text-white">
                  {String(getValueByPath(widget.lastData, f.path))}
                </span>
              </div>
            ))}
          </div>
        );

      case DisplayMode.CHART:
        return (
          <div className="h-48 w-full p-2">
            {history.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={['auto', 'auto']} hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      border: '1px solid #334155', 
                      borderRadius: '8px' 
                    }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                    dot={false} 
                    animationDuration={300}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                Collecting data points...
              </div>
            )}
            <div className="px-2 pb-2">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                {widget.config.selectedFields[0]?.label || 'Value'}
              </p>
              <h4 className="text-2xl font-bold text-white font-mono">
                {formatCurrency(getValueByPath(widget.lastData, widget.config.selectedFields[0]?.path))}
              </h4>
            </div>
          </div>
        );

      case DisplayMode.CARD:
      default:
        return (
          <div className="p-5 grid grid-cols-1 gap-4">
            {widget.config.selectedFields.map((f, i) => {
              const val = getValueByPath(widget.lastData, f.path);
              const isNumeric = !isNaN(parseFloat(val));
              return (
                <div key={f.path} className={i === 0 ? "pb-4 border-b border-slate-800" : ""}>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">
                    {f.label}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className={`${i === 0 ? 'text-3xl' : 'text-xl'} font-mono font-bold text-white`}>
                      {isNumeric ? formatCurrency(val) : String(val)}
                    </span>
                    {i === 0 && (
                      <span className="flex items-center text-xs font-medium text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                        <ArrowUpRight className="w-3 h-3 mr-1" /> Live
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
    }
  };

  const opacity = isDragging ? 0.5 : 1;

  return (
    <div 
      ref={ref}
      data-handler-id={handlerId}
      style={{ opacity }}
      className={`group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all hover:border-slate-700 hover:shadow-2xl ${
        widget.config.displayMode === DisplayMode.TABLE ? 'col-span-full' : ''
      }`}
    >
      <div className="flex items-center justify-between p-4 bg-slate-900/40 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <button className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-800 rounded transition-colors">
            <GripVertical className="w-4 h-4 text-slate-500" />
          </button>
          <div className="p-1.5 bg-slate-800 rounded-lg">
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white truncate max-w-[150px]">
              {widget.config.name}
            </h3>
            <p className="text-[10px] text-slate-500">{widget.config.refreshInterval}s refresh</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={performFetch}
            className={`p-1.5 hover:bg-slate-800 rounded-md transition-all text-slate-400 hover:text-white ${
              localLoading ? 'animate-spin' : ''
            }`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onEdit(widget)}
            className="p-1.5 hover:bg-slate-800 rounded-md transition-all text-slate-400 hover:text-white"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onRemove(widget.id)}
            className="p-1.5 hover:bg-red-500/10 rounded-md transition-all text-slate-400 hover:text-red-400"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative">
        {localLoading && (
          <div className="absolute top-0 right-0 p-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
        )}
        {renderContent()}
      </div>
    </div>
  );
};

export default WidgetCard;
