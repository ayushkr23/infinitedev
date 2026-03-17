import React from 'react';
import { Play, Settings, ExternalLink, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import CustomSelect from './CustomSelect';

const Navbar = ({ onRun, isRunning, language, setLanguage }) => {
  return (
    <nav className="h-10 border-b border-white/5 bg-[#0d0d0d] flex items-center justify-between px-4 z-[100] relative">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:rotate-12 transition-transform">
            <Cpu className="text-black w-3.5 h-3.5 fill-black" />
          </div>
          <div className="glitch-wrapper">
            <h1 className="glitch text-[14px] font-black tracking-[0.2em] text-white" data-text="INFINITEDEV">
              INFINITEDEV
            </h1>
          </div>
        </div>
        
        <div className="h-4 w-[1px] bg-white/10" />
        
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-white/30 font-bold uppercase tracking-[0.15em]">System v3.0</span>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse ml-1" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <CustomSelect value={language} onChange={setLanguage} />

        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(234, 88, 12, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onRun}
          disabled={isRunning}
          className={`flex items-center gap-2 px-6 py-1 rounded-md text-[11px] font-black uppercase tracking-widest transition-all ${
            isRunning 
              ? 'bg-white/10 text-white/30 cursor-not-allowed' 
              : 'bg-orange-600 hover:bg-orange-500 text-white shadow-xl shadow-orange-600/10'
          }`}
        >
          <Play className={`w-3 h-3 ${isRunning ? 'animate-pulse' : 'fill-white'}`} />
          {isRunning ? 'EXECUTING' : 'Execute'}
        </motion.button>
        
        <div className="flex items-center gap-3 ml-2 border-l border-white/10 pl-4">
          <button className="text-white/20 hover:text-white/80 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
          <button className="text-white/20 hover:text-white/80 transition-colors">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
