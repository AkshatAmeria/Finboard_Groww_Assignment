import React, { useState } from 'react';
import { Search, Plus, Check } from 'lucide-react';
import { flattenObject } from '../utils/helpers';
import { SelectedField } from '../types';

interface JsonExplorerProps {
  data: any;
  onSelectField: (field: SelectedField) => void;
  selectedFields: SelectedField[];
}

const JsonExplorer: React.FC<JsonExplorerProps> = ({ data, onSelectField, selectedFields }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const flattened = flattenObject(data);
  const filtered = flattened.filter(f => 
    f.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSelected = (path: string) => selectedFields.some(sf => sf.path === path);

  return (
    <div className="mt-6 space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Explore API Response Fields</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search for fields (e.g. data.rates.USD)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
          {filtered.length > 0 ? (
            filtered.map((field) => (
              <button
                key={field.path}
                type="button"
                onClick={() => onSelectField({ 
                  path: field.path, 
                  label: field.path.split('.').pop() || field.path, 
                  type: field.type 
                })}
                className="w-full flex items-center justify-between p-3 hover:bg-slate-800 rounded-lg text-left transition-colors group"
              >
                <div className="flex flex-col gap-1 overflow-hidden">
                  <span className="text-sm font-mono text-emerald-400 truncate">{field.path}</span>
                  <span className="text-xs text-slate-500 truncate">
                    {field.type}: {JSON.stringify(field.value).slice(0, 50)}
                    {JSON.stringify(field.value).length > 50 && '...'}
                  </span>
                </div>
                <div className={`p-1.5 rounded-full transition-all ${
                  isSelected(field.path) 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                }`}>
                  {isSelected(field.path) ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </div>
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 text-sm">
              No fields found. Test your API first.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JsonExplorer;
