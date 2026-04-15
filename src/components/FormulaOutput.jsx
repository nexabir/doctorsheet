import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, CheckCircle2, Sparkles, AlertCircle, Terminal } from 'lucide-react';

export default function FormulaOutput({ result, error, isLoading }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (result?.formula) {
      navigator.clipboard.writeText(result.formula);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="glass-card p-10 flex flex-col items-center justify-center space-y-6 min-h-[300px] border-emerald-100/50 shadow-emerald-100/20 shadow-2xl">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-emerald-600 animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-xl font-bold text-slate-800 font-display">Architecting your formula</p>
          <p className="text-sm text-slate-400 font-medium">Consulting Gemini's logic engine...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-red-50 p-8 rounded-3xl border border-red-100 flex flex-col items-center justify-center space-y-4 min-h-[300px]"
      >
        <div className="p-4 bg-red-100 rounded-2xl">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-red-900 mb-1">Architectural Error</h3>
          <p className="text-red-700 font-medium max-w-sm">{error}</p>
        </div>
      </motion.div>
    );
  }

  if (!result) return null;

  return (
    <div className="glass-dark p-8 md:p-10 shadow-2xl relative overflow-hidden group border-slate-700/50">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400"></div>
      
      {/* Background Glow */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full group-hover:bg-emerald-500/20 transition-colors duration-700" />

      <div className="flex justify-between items-center mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <Terminal className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg font-display tracking-wide">Resulting Archetype</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Optimized for Google Sheets</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl transition-all duration-300 backdrop-blur-sm"
        >
          {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span className="text-sm font-bold tracking-tight">{copied ? 'Copied to Clipboard' : 'Copy Formula'}</span>
        </motion.button>
      </div>

      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-white/5 mb-8 font-mono text-2xl md:text-3xl text-emerald-400 overflow-x-auto break-all shadow-inner relative group/code"
      >
        <div className="absolute top-2 left-2 text-[10px] text-slate-700 font-bold uppercase tracking-tighter opacity-0 group-hover/code:opacity-100 transition-opacity">Formula String</div>
        {result.formula}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10"
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <h4 className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Explanation & Logic</h4>
        </div>
        <p className="text-slate-200 text-lg leading-relaxed font-medium">
          {result.explanation}
        </p>
      </motion.div>
    </div>
  );
}
