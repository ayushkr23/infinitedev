import React from 'react';
import { Terminal, Database, Play, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomPanel = ({ stdin, setStdin, result, executionMetrics }) => {
  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-48 border-t border-white/5 bg-[#0d0d0d] flex flex-col"
    >
      <div className="h-8 px-4 flex items-center gap-6 border-b border-white/5 bg-white/2">
        <div className="flex items-center gap-2 text-[11px] font-bold text-orange-400 border-b border-orange-400 h-full px-1">
          <Terminal className="w-3.5 h-3.5" />
          <span>EXECUTE MODE (STDIN)</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-white/30 hover:text-white/50 cursor-pointer">
          <Database className="w-3.5 h-3.5" />
          <span>ARGUMENTS</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-white/30 hover:text-white/50 cursor-pointer">
          <Play className="w-3.5 h-3.5" />
          <span>OUTPUT</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Input area */}
        <div className="flex-1 p-3 border-r border-white/5 flex flex-col">
          <div className="text-[10px] text-white/30 mb-2 font-mono uppercase tracking-widest">Interactive Input</div>
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            placeholder="Type your program input here..."
            className="flex-1 bg-transparent border-none outline-none text-xs text-white/80 font-mono resize-none placeholder:text-white/5"
          />
        </div>

        {/* Real-time metrics/status area */}
        <div className="w-64 p-3 bg-white/1 overflow-y-auto">
          <div className="text-[10px] text-white/30 mb-2 font-mono uppercase tracking-widest">Execute Info</div>
          {executionMetrics ? (
            <div className="space-y-2">
              <div className="p-2 rounded bg-white/5 border border-white/5 flex flex-col">
                <span className="text-[9px] text-white/40 uppercase">CPU Time</span>
                <span className="text-xs text-orange-400 font-bold">{executionMetrics.time}ms</span>
              </div>
              <div className="p-2 rounded bg-white/5 border border-white/5 flex flex-col">
                <span className="text-[9px] text-white/40 uppercase">Peak Memory</span>
                <span className="text-xs text-white/80 font-bold">{executionMetrics.memory} MB</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full opacity-20 scale-90">
              <AlertCircle className="w-8 h-8 mb-2" />
              <div className="text-[10px] text-center">No execution<br/>stats yet</div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BottomPanel;
