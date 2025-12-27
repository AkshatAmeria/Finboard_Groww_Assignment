import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WidgetConfig, WidgetData } from './types';

interface WidgetStore {
  widgets: WidgetData[];
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  editingWidget: WidgetData | null;
  
  addWidget: (config: WidgetConfig) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, config: WidgetConfig) => void;
  refreshWidget: (id: string, data: any) => void;
  reorderWidgets: (widgets: WidgetData[]) => void;
  setAddModalOpen: (isOpen: boolean) => void;
  setEditModalOpen: (isOpen: boolean, widget?: WidgetData) => void;
}

export const useWidgetStore = create<WidgetStore>()(
  persist(
    (set) => ({
      widgets: [],
      isAddModalOpen: false,
      isEditModalOpen: false,
      editingWidget: null,

      addWidget: (config) =>
        set((state) => ({
          widgets: [
            ...state.widgets,
            {
              id: config.id,
              config,
              lastData: null,
              lastUpdated: '',
              isLoading: false,
            },
          ],
          isAddModalOpen: false,
        })),

      removeWidget: (id) =>
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== id),
        })),

      updateWidget: (id, config) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, config } : w
          ),
          isEditModalOpen: false,
          editingWidget: null,
        })),

      refreshWidget: (id, data) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id
              ? {
                  ...w,
                  lastData: data,
                  lastUpdated: new Date().toLocaleTimeString(),
                  isLoading: false,
                }
              : w
          ),
        })),

      reorderWidgets: (widgets) =>
        set({ widgets }),

      setAddModalOpen: (isOpen) =>
        set({ isAddModalOpen: isOpen }),

      setEditModalOpen: (isOpen, widget) =>
        set({ 
          isEditModalOpen: isOpen, 
          editingWidget: widget || null 
        }),
    }),
    {
      name: 'finboard-storage',
      partialize: (state) => ({ 
        widgets: state.widgets.map(w => ({
          id: w.id,
          config: w.config,
          lastData: null,
          lastUpdated: '',
          isLoading: false
        }))
      }),
    }
  )
);
