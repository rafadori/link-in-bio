import { motion } from 'framer-motion';
import { devStats } from '../data';

export default function DevStats() {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mx-auto mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {devStats.map((stat, index) => (
        <div 
          key={index}
          className="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-3 text-sm text-center backdrop-blur-sm hover:bg-zinc-900/50 transition-colors"
        >
          <div className="font-semibold text-zinc-300 mb-1">{stat.title}</div>
          <div className="text-zinc-500 text-xs">{stat.content}</div>
        </div>
      ))}
    </motion.div>
  );
}
