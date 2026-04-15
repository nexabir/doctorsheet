import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListTree, Plus, X } from 'lucide-react';

export default function ContextMapper({ contexts, setContexts }) {
  const handleAdd = () => {
    setContexts([...contexts, { column: '', meaning: '' }]);
  };

  const handleRemove = (index) => {
    setContexts(contexts.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const newContexts = [...contexts];
    newContexts[index][field] = value;
    setContexts(newContexts);
  };

  return (
    <div className="glass-card p-6 space-y-4 hover:shadow-lg hover:shadow-emerald-100/30 transition-shadow duration-300 border-emerald-50/50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 rounded-lg">
            <ListTree className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 font-display">Context Map</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className="text-sm flex items-center gap-2 text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl transition-all font-bold shadow-lg shadow-emerald-100"
        >
          <Plus className="w-4 h-4" /> Add Column
        </motion.button>
      </div>
      <p className="text-sm text-slate-500 mb-6 font-medium">
        Defined columns help the AI target specific data ranges.
      </p>

      <AnimatePresence mode="popLayout">
        {contexts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm font-medium"
          >
            No active context. AI will infer columns from your description.
          </motion.div>
        ) : (
          <div className="space-y-3">
            {contexts.map((ctx, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -20 }}
                className="flex items-center gap-3 p-3 bg-white/40 rounded-2xl border border-slate-100 shadow-sm"
              >
                <input
                  type="text"
                  placeholder="A"
                  value={ctx.column}
                  onChange={(e) => handleChange(index, 'column', e.target.value.toUpperCase())}
                  className="w-16 px-3 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-center font-bold text-emerald-700 placeholder:text-slate-300 shadow-sm"
                  maxLength={2}
                />
                <span className="text-slate-300 font-bold text-xl">→</span>
                <input
                  type="text"
                  placeholder="e.g., Net Revenue"
                  value={ctx.meaning}
                  onChange={(e) => handleChange(index, 'meaning', e.target.value)}
                  className="flex-1 px-5 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-medium placeholder:text-slate-300 shadow-sm"
                />
                <button
                  onClick={() => handleRemove(index)}
                  className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
