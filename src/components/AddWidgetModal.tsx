import React, { useState, useEffect } from 'react';
import { X, Globe, RefreshCw, BarChart3, LayoutGrid, Table as TableIcon } from 'lucide-react';
import { DisplayMode, SelectedField, WidgetConfig, WidgetData } from '../types';
import { fetchFinanceData } from '../services/api';
import JsonExplorer from './JsonExplorer';

interface AddWidgetModalProps {
  onClose: () => void;
  onSave: (config: WidgetConfig) => void;
  editingWidget?: WidgetData | null;
}

const AddWidgetModal: React.FC<AddWidgetModalProps> = ({ onClose, onSave, editingWidget }) => {
  const [name, setName] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [refreshInterval, setRefreshInterval] = useState(60);
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.CARD);
  const [selectedFields, setSelectedFields] = useState<SelectedField[]>([]);
  const [testData, setTestData] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);

  useEffect(() => {
    if (editingWidget) {
      setName(editingWidget.config.name);
      setApiUrl(editingWidget.config.apiUrl);
      setRefreshInterval(editingWidget.config.refreshInterval);
      setDisplayMode(editingWidget.config.displayMode);
      setSelectedFields(editingWidget.config.selectedFields);
      
      if (editingWidget.lastData) {
        setTestData(editingWidget.lastData);
      }
    }
  }, [editingWidget]);

  const handleTestApi = async () => {
    if (!apiUrl) return;
    setIsTesting(true);
    setTestError(null);
    try {
      const data = await fetchFinanceData(apiUrl);
      setTestData(data);
    } catch (err: any) {
      setTestError(err.message || "Failed to fetch data");
    } finally {
      setIsTesting(false);
    }
  };

  const toggleField = (field: SelectedField) => {
    setSelectedFields(prev => {
      const exists = prev.find(f => f.path === field.path);
      if (exists) return prev.filter(f => f.path !== field.path);
      return [...prev, field];
    });
  };

  const handleSave = () => {
    if (!name || !apiUrl || selectedFields.length === 0) return;
    onSave({
      id: editingWidget?.id || crypto.randomUUID(),
      name,
      apiUrl,
      refreshInterval,
      displayMode,
      selectedFields
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">
            {editingWidget ? 'Edit Widget' : 'Add New Widget'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Widget Name</label>
              <input
                type="text"
                placeholder="e.g. Bitcoin Tracker"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Refresh Interval (seconds)</label>
              <input
                type="number"
                min="5"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">API URL</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                placeholder="PASTE YOUR FINANCE API URL HERE WITHOUT AUTHENTICATION PARAMS & HEADERS"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
              <button
                type="button"
                onClick={handleTestApi}
                disabled={isTesting || !apiUrl}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-sm font-medium rounded-lg transition-all border border-slate-700"
              >
                <RefreshCw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
                Test
              </button>
            </div>
            {testError && <p className="text-xs text-red-400 mt-1">{testError}</p>}
            {testData && <p className="text-xs text-emerald-400 mt-1">API connection successful!</p>}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">Display Mode</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { mode: DisplayMode.CARD, icon: LayoutGrid },
                { mode: DisplayMode.TABLE, icon: TableIcon },
                { mode: DisplayMode.CHART, icon: BarChart3 },
              ].map(({ mode, icon: Icon }) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setDisplayMode(mode)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all text-sm font-medium ${
                    displayMode === mode
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-sm'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {testData && (
            <JsonExplorer 
              data={testData} 
              onSelectField={toggleField} 
              selectedFields={selectedFields} 
            />
          )}

          {selectedFields.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Selected Fields</label>
              <div className="flex flex-wrap gap-2">
                {selectedFields.map(f => (
                  <div key={f.path} className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-full text-xs">
                    <span className="text-slate-300">{f.label}</span>
                    <button onClick={() => toggleField(f)} className="text-slate-500 hover:text-red-400">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-800 flex items-center justify-end gap-3 bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name || !apiUrl || selectedFields.length === 0}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-emerald-900/20"
          >
            {editingWidget ? 'Update Widget' : 'Add Widget'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddWidgetModal;
