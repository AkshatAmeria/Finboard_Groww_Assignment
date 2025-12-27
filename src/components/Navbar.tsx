import React from 'react';
import { LayoutDashboard, Plus } from 'lucide-react';

interface NavbarProps {
  onAddWidget: () => void;
  widgetCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ onAddWidget, widgetCount }) => {
  return (
    <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
            <LayoutDashboard className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">FinBoard</h1>
            <p className="text-xs text-slate-400 border border-slate-700 px-2 py-0.5 rounded-md inline-block mt-0.5">
              {widgetCount} {widgetCount === 1 ? 'active widget' : 'active widgets'} | Real-time data
            </p>
          </div>
        </div>
        
        <button
          onClick={onAddWidget}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-emerald-900/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Widget</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
