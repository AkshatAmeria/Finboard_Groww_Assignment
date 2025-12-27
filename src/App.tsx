import React, { useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Navbar from './components/Navbar';
import WidgetCard from './components/WidgetCard';
import AddWidgetModal from './components/AddWidgetModal';
import { WidgetConfig, WidgetData } from './types';
import { useWidgetStore } from './store';
import { Layout, Plus, BarChart, LineChart, Table } from 'lucide-react';

const App: React.FC = () => {
  const {
    widgets,
    isAddModalOpen,
    isEditModalOpen,
    editingWidget,
    addWidget,
    removeWidget,
    updateWidget,
    refreshWidget,
    reorderWidgets,
    setAddModalOpen,
    setEditModalOpen,
  } = useWidgetStore();

  const handleAddWidget = (config: WidgetConfig) => {
    addWidget(config);
  };

  const handleUpdateWidget = (config: WidgetConfig) => {
    updateWidget(config.id, config);
  };

  const handleRemoveWidget = (id: string) => {
    removeWidget(id);
  };

  const handleWidgetRefresh = useCallback((id: string, data: any) => {
    refreshWidget(id, data);
  }, [refreshWidget]);

  const handleEditWidget = (widget: WidgetData) => {
    setEditModalOpen(true, widget);
  };

  const moveWidget = useCallback((dragIndex: number, hoverIndex: number) => {
    const newWidgets = [...widgets];
    const dragWidget = newWidgets[dragIndex];
    newWidgets.splice(dragIndex, 1);
    newWidgets.splice(hoverIndex, 0, dragWidget);
    reorderWidgets(newWidgets);
  }, [widgets, reorderWidgets]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
        <Navbar onAddWidget={() => setAddModalOpen(true)} widgetCount={widgets.length} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {widgets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="relative">
                <div className="absolute -inset-1 bg-emerald-500 blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl">
                  <BarChart className="w-16 h-16 text-emerald-500 mx-auto" />
                </div>
              </div>
              <div className="max-w-md space-y-4">
                <h2 className="text-3xl font-bold tracking-tight text-white">
                  Build Your Finance Dashboard
                </h2>
                <p className="text-slate-400 text-lg">
                  Connect to any financial API and create custom widgets to monitor stocks, crypto, 
                  and market trends in real-time.
                </p>
              </div>
              <button
                onClick={() => setAddModalOpen(true)}
                className="group flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-emerald-900/30 hover:-translate-y-1"
              >
                <Plus className="w-6 h-6 transition-transform group-hover:rotate-90" />
                Get Started
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 w-full max-w-4xl opacity-50">
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg">
                    <LineChart className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">Real-time Charts</span>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg">
                    <Table className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">Custom Field Mapping</span>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg">
                    <Layout className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">Drag & Drop Layout</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
              {widgets.map((widget, index) => (
                <WidgetCard 
                  key={widget.id} 
                  widget={widget}
                  index={index}
                  onRemove={handleRemoveWidget}
                  onRefresh={handleWidgetRefresh}
                  onEdit={handleEditWidget}
                  moveWidget={moveWidget}
                />
              ))}
              
              {/* Quick Add Placeholder */}
              <button
                onClick={() => setAddModalOpen(true)}
                className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-800 rounded-3xl hover:border-emerald-500/50 hover:bg-emerald-500/[0.02] transition-all group min-h-[280px]"
              >
                <div className="p-4 bg-slate-900 rounded-full group-hover:bg-emerald-500/10 transition-all mb-4">
                  <Plus className="w-8 h-8 text-slate-500 group-hover:text-emerald-500" />
                </div>
                <span className="text-slate-400 font-semibold group-hover:text-emerald-500">
                  Add New Widget
                </span>
                <span className="text-slate-600 text-xs mt-1">Connect a custom API source</span>
              </button>
            </div>
          )}
        </main>

        {isAddModalOpen && (
          <AddWidgetModal 
            onClose={() => setAddModalOpen(false)} 
            onSave={handleAddWidget} 
          />
        )}

        {isEditModalOpen && editingWidget && (
          <AddWidgetModal 
            onClose={() => setEditModalOpen(false)}
            onSave={handleUpdateWidget}
            editingWidget={editingWidget}
          />
        )}

        <div className="fixed bottom-8 right-8 md:hidden">
          <button 
            onClick={() => setAddModalOpen(true)}
            className="p-4 bg-emerald-600 rounded-full shadow-2xl shadow-emerald-900/40 text-white"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
        
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full"></div>
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
