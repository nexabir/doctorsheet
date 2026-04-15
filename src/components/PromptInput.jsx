import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Eraser } from 'lucide-react';

export default function PromptInput({ value, onChange }) {
  return (
    <div className="glass-card p-6 relative group transition-all duration-300 hover:shadow-lg hover:shadow-emerald-100/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 rounded-lg">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 font-display">Requirement</h2>
        </div>
        {value && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange('')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all font-bold tracking-tight uppercase"
          >
            <Eraser className="w-3.5 h-3.5" />
            Clear
          </motion.button>
        )}
      </div>
      <p className="text-sm text-slate-500 mb-4 font-medium leading-relaxed">
        Describe your spreadsheet goal in plain language...
      </p>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-36 p-5 bg-white/40 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none resize-none transition-all duration-300 text-slate-700 font-medium placeholder:text-slate-300 shadow-inner"
          placeholder="e.g., Calculate growth rate since last year..."
        />
        <div className="absolute bottom-4 right-4 text-[10px] text-slate-300 font-mono">
          {value.length} chars
        </div>
      </div>
    </div>
  );
}
