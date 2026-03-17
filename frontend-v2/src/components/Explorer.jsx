import React from 'react';
import { ChevronDown, ChevronRight, FileCode, Folder, Plus, Search } from 'lucide-react';

const Explorer = ({ tabs, activeTabId, onSelectTab, onAddTab }) => {
  return (
    <div className="w-64 h-full bg-[#0d0d0d] flex flex-col border-r border-white/5 animate-in slide-in-from-left duration-300">
      <div className="h-10 px-4 flex items-center justify-between text-[11px] uppercase tracking-wider text-white/40 font-bold border-b border-white/5">
        <span>Files</span>
        <div className="flex items-center gap-1">
          <button onClick={onAddTab} className="p-1 hover:bg-white/5 rounded transition-colors" title="New File">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-2 mb-2">
          <div className="bg-white/5 rounded flex items-center px-2 py-1 gap-2">
            <Search className="w-3.5 h-3.5 text-white/20" />
            <input 
              type="text" 
              placeholder="Filter..." 
              className="bg-transparent border-none outline-none text-xs text-white/80 w-full placeholder:text-white/10"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 px-4 py-1 text-xs text-white/70 hover:bg-white/5 cursor-pointer font-medium group">
          <ChevronDown className="w-4 h-4 text-white/30" />
          <Folder className="w-4 h-4 text-orange-400 fill-orange-400/20" />
          <span>PROJECT_BLUEBIRD</span>
        </div>

        <div className="ml-4 border-l border-white/5">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs transition-all cursor-pointer border-l-2 ${
                activeTabId === tab.id 
                  ? 'bg-orange-500/10 text-orange-400 border-orange-500' 
                  : 'text-white/50 border-transparent hover:bg-white/5 hover:text-white/70'
              }`}
            >
              <FileCode className="w-4 h-4 opacity-70" />
              <span className="truncate">{tab.name}</span>
            </div>
          ))}
          
          <div className="flex items-center gap-2 px-4 py-1.5 text-xs text-white/20 hover:text-white/40 italic">
            <span>+ add more...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explorer;
