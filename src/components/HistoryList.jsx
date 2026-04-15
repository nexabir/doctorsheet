import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Clock, FileSpreadsheet, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function HistoryList({ refreshTrigger }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('formulas')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && history.length === 0) {
    return (
      <div className="glass-card p-8 flex flex-col items-center justify-center space-y-4 min-h-[400px]">
        <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm font-medium">Syncing archives...</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-emerald-100/30">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-slate-800 font-display">Recent Logic</h3>
          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold ml-1">
            {history.length}
          </span>
        </div>
        <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
      </div>

      <div className="divide-y divide-slate-100/50 max-h-[600px] overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {history.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 text-center"
            >
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-slate-400 text-sm font-medium">No history found</p>
            </motion.div>
          ) : (
            history.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 1, x: 0 }} // Simplified for first render
                className="p-5 hover:bg-emerald-50/30 transition-all duration-300 group/row"
              >
                <div className="flex items-start justify-between mb-3">
                  <p className="text-sm font-bold text-slate-700 leading-tight pr-4 line-clamp-2">{item.problem}</p>
                  <div className="flex items-center text-[10px] font-bold text-slate-300 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md shrink-0">
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="mt-3 group/item relative">
                  <div className="p-3 bg-white border border-slate-200 rounded-xl font-mono text-[11px] text-emerald-700 overflow-x-auto whitespace-nowrap shadow-sm flex items-center gap-2 transition-all group-hover/row:border-emerald-200 group-hover/row:bg-emerald-50/50">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    {item.formula}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      navigator.clipboard.writeText(item.formula);
                      const btn = document.getElementById(`copy-hist-${item.id}`);
                      if (btn) btn.innerText = 'Copied!';
                      setTimeout(() => { if (btn) btn.innerText = 'Copy'; }, 2000);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-lg shadow-emerald-200 transition-all"
                    id={`copy-hist-${item.id}`}
                  >
                    Copy
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
