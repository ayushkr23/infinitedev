import React from 'react';
import { X, Plus, FileCode } from 'lucide-react';
import { motion } from 'framer-motion';

const TabBar = ({ tabs, activeTabId, onSwitch, onClose, onAdd }) => {
  return (
    <div className="flex items-center gap-[1px] px-1 bg-[#111111] border-b border-white/5 overflow-x-auto scrollbar-hide h-8">
      {tabs.map((tab) => (
        <motion.div
          key={tab.id}
          layout
          className={`group flex items-center gap-2 px-3 h-full text-[11px] font-medium transition-all cursor-pointer border-r border-white/5 ${
            activeTabId === tab.id 
              ? 'bg-[#1e1e1e] text-orange-400' 
              : 'bg-transparent text-white/30 hover:bg-white/5 hover:text-white/60'
          }`}
          onClick={() => onSwitch(tab.id)}
        >
          <FileCode className={`w-3 h-3 ${activeTabId === tab.id ? 'text-orange-400' : 'text-white/20'}`} />
          <span className="max-w-[120px] truncate">{tab.name}</span>
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(tab.id); }}
            className={`opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-white/10 transition-all ${tabs.length === 1 ? 'hidden' : ''}`}
          >
            <X className="w-2.5 h-2.5" />
          </button>
        </motion.div>
      ))}
      <button 
        onClick={() => onAdd()}
        className="p-1.5 ml-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-all"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};

export default TabBar;
