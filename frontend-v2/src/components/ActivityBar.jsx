import React from 'react';
import { Files, Search, MessageSquare, Settings, User } from 'lucide-react';
import { motion } from 'framer-motion';

const ActivityBar = ({ activeView, setActiveView }) => {
  const items = [
    { id: 'explorer', icon: Files, label: 'Explorer' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'ai', icon: MessageSquare, label: 'AI Helper' },
  ];

  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-12 h-full bg-[#111111] border-r border-white/5 flex flex-col items-center py-4 gap-4 z-50"
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveView(item.id)}
          className={`p-2 rounded-lg transition-all relative group ${
            activeView === item.id ? 'text-[#ff6b00]' : 'text-white/40 hover:text-white/70'
          }`}
        >
          <item.icon className="w-6 h-6" />
          {activeView === item.id && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#ff6b00]" />
          )}
          <div className="absolute left-14 px-2 py-1 bg-[#1e1e1e] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100] border border-white/10 shadow-xl">
            {item.label}
          </div>
        </button>
      ))}
      
      <div className="mt-auto flex flex-col items-center gap-4">
        <button className="text-white/40 hover:text-white/70 p-2">
          <User className="w-6 h-6" />
        </button>
        <button className="text-white/40 hover:text-white/70 p-2">
          <Settings className="w-6 h-6" />
        </button>
      </div>
    </motion.div>
  );
};

export default ActivityBar;
