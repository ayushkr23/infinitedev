import React, { useState } from 'react';
import { Sparkles, MessageSquare, AlertCircle, Terminal, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RightPanel = ({ output, code, language }) => {
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
    <motion.aside 
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-[380px] flex flex-col bg-[#0d0d0d] border-l border-white/5 overflow-hidden"
    >
      {/* Result Section */}
      <div className="flex-1 flex flex-col min-h-0 border-b border-white/5">
        <div className="h-8 px-4 flex items-center justify-between border-b border-white/5 bg-white/2">
          <div className="flex items-center gap-2 text-[10px] font-bold text-white/50 uppercase tracking-widest">
            <Terminal className="w-3.5 h-3.5" />
            <span>Output / Terminal</span>
          </div>
          {output.metrics?.type && (
            <div className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
              output.success ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
            }`}>
              {output.metrics.type}
            </div>
          )}
        </div>
        
        <div className="flex-1 p-4 font-mono text-[13px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {output.text && <div className="text-white/80 whitespace-pre-wrap">{output.text}</div>}
          {output.error && (
            <div className="text-red-400 mt-2 p-3 bg-red-400/5 rounded border border-red-400/10 flex gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{output.error}</span>
            </div>
          )}
          {!output.text && !output.error && (
            <div className="flex flex-col items-center justify-center h-full opacity-10">
              <Terminal className="w-12 h-12 mb-2" />
              <div className="text-center text-xs">Run code to see execution output</div>
            </div>
          )}
        </div>
      </div>

      {/* Errors and Evaluation Section */}
      <div className="h-1/3 flex flex-col bg-white/1">
        <div className="h-8 px-4 flex items-center justify-between border-b border-white/5 bg-white/2">
          <div className="flex items-center gap-2 text-[10px] font-bold text-white/50 uppercase tracking-widest">
            <Info className="w-3.5 h-3.5" />
            <span>AI Assistant & Diagnostics</span>
          </div>
        </div>

        <div className="flex-1 p-4 flex flex-col overflow-hidden">
          <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: 'explain-code', label: 'Explain Code', icon: MessageSquare, color: 'orange' },
              { id: 'explain-error', label: 'Explain Error', icon: AlertCircle, color: 'red', disabled: !output.error },
              { id: 'suggest-fix', label: 'Suggest Fix', icon: Sparkles, color: 'green', disabled: !output.error },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => !btn.disabled && askAI(btn.id)}
                disabled={btn.disabled}
                className={`flex items-center gap-2 whitespace-nowrap px-3 py-1.5 rounded text-[11px] font-bold border transition-all ${
                  btn.disabled 
                    ? 'opacity-20 cursor-not-allowed border-white/5' 
                    : 'bg-white/5 hover:bg-white/10 text-white/70 border-white/10 active:scale-95'
                }`}
              >
                <btn.icon className={`w-3.5 h-3.5 ${!btn.disabled ? (btn.id === 'suggest-fix' ? 'text-green-400' : btn.id === 'explain-error' ? 'text-red-400' : 'text-blue-400') : ''}`} />
                {btn.label}
              </button>
            ))}
          </div>

          <div className="flex-1 bg-[#1a1a1a] border border-white/5 rounded p-3 text-xs text-white/60 overflow-y-auto leading-relaxed scrollbar-thin scrollbar-thumb-white/5">
            {isAiLoading ? (
              <div className="flex items-center justify-center h-full gap-2 animate-pulse text-orange-400/50">
                <Sparkles className="w-4 h-4 animate-spin-slow" /> Consulting AI...
              </div>
            ) : (
              aiResponse || <span className="opacity-30 italic">Select an action above to analyze your code or troubleshoot errors.</span>
            )}
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default RightPanel;
