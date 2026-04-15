import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PromptInput from '../components/PromptInput';
import ContextMapper from '../components/ContextMapper';
import FormulaOutput from '../components/FormulaOutput';
import HistoryList from '../components/HistoryList';
import { generateFormula } from '../lib/llm';
import { supabase } from '../lib/supabase';
import { Wand2, Lightbulb, Sparkles } from 'lucide-react';

const EXAMPLES = [
  "Sum the total revenue where month is January",
  "Calculate the average rating for North region",
  "Find the maximum price in the Electronics category",
  "Lookup the status of order ID in column A from sheet2"
];

export default function Dashboard() {
  const [problem, setProblem] = useState('');
  const [contexts, setContexts] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleGenerate = async () => {
    if (!problem.trim()) {
      setError('Please describe a problem first.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const headersMap = contexts
        .filter(c => c.column && c.meaning)
        .map(c => `${c.column} = ${c.meaning}`)
        .join(', ');

      const response = await generateFormula(problem, headersMap);
      setResult(response);

      const { error: dbError } = await supabase.from('formulas').insert([
        {
          problem: problem,
          context_mapping: contexts,
          formula: response.formula,
          explanation: response.explanation
        }
      ]);

      if (!dbError) {
        setRefreshHistory(prev => prev + 1);
      }

    } catch (err) {
      setError(err.message || 'Something went wrong while generating the formula.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="bg-blob bg-emerald-100 top-[-10%] left-[-10%]" />
      <div className="bg-blob bg-blue-100 bottom-[-10%] right-[-10%]" style={{ animationDelay: '-5s' }} />
      <div className="bg-blob bg-purple-100 middle right-1/4 top-1/2" style={{ animationDelay: '-10s' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 text-emerald-600 rounded-2xl mb-4 shadow-sm border border-emerald-200">
            <Wand2 className="w-8 h-8" />
          </div>
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-2 font-display">
            Dector <span className="text-emerald-600">Sheet</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            AI-Powered Google Sheets Formula Architect
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <PromptInput value={problem} onChange={setProblem} />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 transition-all border-emerald-100/30"
            >
              <div className="flex items-center gap-2 mb-4 text-emerald-700">
                <Lightbulb className="w-5 h-5" />
                <h3 className="font-semibold">Quick Start Examples</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => setProblem(ex)}
                    className="text-xs px-4 py-2 bg-white/50 text-slate-600 hover:bg-emerald-600 hover:text-white rounded-full border border-slate-200 hover:border-emerald-600 transition-all duration-300 font-medium"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ContextMapper contexts={contexts} setContexts={setContexts} />
            </motion.div>
            
            <motion.div 
              className="flex justify-end"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="group px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none text-lg"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    Architect Formula
                  </>
                )}
              </button>
            </motion.div>

            <AnimatePresence mode="wait">
              {(result || loading || error) && (
                <motion.div
                  key={loading ? 'loading' : result ? 'result' : 'error'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="pt-6"
                >
                  <FormulaOutput result={result} error={error} isLoading={loading} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1 space-y-6"
          >
            <HistoryList refreshTrigger={refreshHistory} />
            
            <div className="bg-emerald-600 rounded-3xl p-8 text-white shadow-2xl shadow-emerald-200 relative overflow-hidden group">
              <Sparkles className="absolute -right-4 -top-4 w-24 h-24 text-white/10 group-hover:rotate-12 transition-transform duration-700" />
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2 relative z-10">
                <Lightbulb className="w-6 h-6 text-emerald-200" />
                Pro Tips
              </h3>
              <ul className="space-y-4 text-emerald-50 relative z-10">
                {[
                  "Map columns like **A = Sales** for precise cell targeting.",
                  "Specify sheet names (e.g. 'from Sheet2') for multi-sheet tasks.",
                  "Request specific formats like **ARRAYFORMULA** if needed."
                ].map((tip, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">{i+1}</span>
                    <span dangerouslySetInnerHTML={{ __html: tip.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
