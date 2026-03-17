import React, { useState } from 'react';
import { Terminal, Cpu, Clock, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ output, stdin, setStdin, code, language }) => {
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const askAI = async (action) => {
    setIsAiLoading(true);
    setAiResponse('');
    try {
      const response = await fetch('/ai-help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, code, error: output.error, language })
      });
      const data = await response.json();
      setAiResponse(data.response);
    } catch (err) {
      setAiResponse('Failed to reach AI helper.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <aside className="w-[400px] flex flex-col bg-black/40 backdrop-blur-3xl overflow-y-auto border-l border-white/5 scrollbar-hide">
      {/* Input Section */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-2 mb-3 text-[11px] font-bold text-white/40 uppercase tracking-widest">
          <Terminal className="w-4 h-4" /> Standard Input
        </div>
        <textarea 
          value={stdin}
          onChange={(e) => setStdin(e.target.value)}
          placeholder="Enter stdin here..."
          className="w-100% h-24 bg-black/30 border border-white/5 rounded-xl p-3 text-sm font-mono outline-none focus:border-blue-500/50 transition-all resize-none w-full"
        />
      </div>

      {/* Metrics Section */}
      <div className="p-4 border-b border-white/5 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
        <div className="flex items-center gap-2 mb-4 text-[11px] font-bold text-white/40 uppercase tracking-widest">
          <Cpu className="w-4 h-4" /> Execution Metrics
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="text-white/40 text-[10px] uppercase mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Time
            </div>
            <div className="text-lg font-mono font-bold text-blue-400">{output.metrics?.time || '0ms'}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="text-white/40 text-[10px] uppercase mb-1 flex items-center gap-1">
              <Cpu className="w-3 h-3" /> Memory
            </div>
            <div className="text-lg font-mono font-bold text-purple-400">{output.metrics?.memory || '0 MB'}</div>
          </div>
        </div>
        {output.metrics?.type && (
          <div className={`mt-3 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
            output.success ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
          }`}>
            <AlertCircle className="w-4 h-4" /> {output.metrics.type}
          </div>
        )}
      </div>

      {/* Output Section */}
      <div className="p-4 flex-1 flex flex-col min-h-[300px]">
        <div className="flex items-center gap-2 mb-3 text-[11px] font-bold text-white/40 uppercase tracking-widest">
          <MessageSquare className="w-4 h-4" /> Result
        </div>
        <div className="flex-1 bg-black/50 border border-white/5 rounded-xl p-4 font-mono text-sm overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto scrollbar-hide whitespace-pre-wrap">
            {output.text && <div className="text-white/90">{output.text}</div>}
            {output.error && <div className="text-red-400 mt-2 p-2 bg-red-400/5 rounded border border-red-400/10">{output.error}</div>}
            {!output.text && !output.error && <span className="text-white/20 italic">Run code to see output...</span>}
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <div className="p-4 mt-auto border-t border-white/10 bg-black/40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-[11px] font-bold text-blue-400 uppercase tracking-widest">
            <Sparkles className="w-4 h-4" /> Infinite AI Assistant
          </div>
        </div>
        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => askAI('explain-code')}
            className="whitespace-nowrap px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-xs border border-blue-500/20 transition-all"
          >
            Explain Code
          </button>
          <button 
            onClick={() => askAI('explain-error')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs border transition-all ${
              output.error 
                ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20' 
                : 'bg-white/5 text-white/20 border-white/5 cursor-not-allowed'
            }`}
          >
            Explain Error
          </button>
          <button 
            onClick={() => askAI('suggest-fix')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs border transition-all ${
              output.error 
                ? 'bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/20' 
                : 'bg-white/5 text-white/20 border-white/5 cursor-not-allowed'
            }`}
          >
            Suggest Fix
          </button>
        </div>
        <div className="min-h-[100px] bg-white/5 rounded-xl p-4 text-sm text-white/70 leading-relaxed italic relative">
          {isAiLoading ? (
            <div className="flex items-center gap-2 animate-pulse text-blue-400/50">
              <Sparkles className="w-4 h-4 rotate-infinite" /> Analysing code...
            </div>
          ) : (
            aiResponse || "Select an action to consult the AI..."
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
