import React, { useState } from 'react';
import { ChevronDown, Code, Hash, Coffee, Terminal, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const languages = [
  { id: 'python', label: 'Python 3', icon: Hash, color: 'text-yellow-400' },
  { id: 'javascript', label: 'Node.js', icon: Code, color: 'text-yellow-300' },
  { id: 'c', label: 'C (GCC 11)', icon: Terminal, color: 'text-blue-400' },
  { id: 'cpp', label: 'C++ (G++ 11)', icon: Layers, color: 'text-blue-500' },
  { id: 'java', label: 'JDK 1.8.0', icon: Coffee, color: 'text-orange-400' },
];

const CustomSelect = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = languages.find(l => l.id === value) || languages[0];

  return (
    <div className="relative z-[100]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/5 border border-white/10 rounded px-3 py-1.5 min-w-[140px] flex items-center justify-between gap-3 hover:bg-white/10 transition-all active:scale-95 group"
      >
        <div className="flex items-center gap-2">
          <selected.icon className={`w-3.5 h-3.5 ${selected.color}`} />
          <span className="text-[11px] font-bold text-white/80">{selected.label}</span>
        </div>
        <ChevronDown className={`w-3 h-3 text-white/30 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full mt-2 left-0 w-full bg-[#1e1e1e] border border-white/10 rounded-lg shadow-2xl overflow-hidden z-20 backdrop-blur-xl"
            >
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    onChange(lang.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/5 transition-colors group ${
                    value === lang.id ? 'bg-orange-500/10' : ''
                  }`}
                >
                  <lang.icon className={`w-4 h-4 ${lang.color} group-hover:scale-110 transition-transform`} />
                  <span className={`text-xs font-medium ${value === lang.id ? 'text-orange-400' : 'text-white/60'}`}>
                    {lang.label}
                  </span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;
