import { motion } from 'framer-motion';
import { ArrowUpRight, LucideIcon } from 'lucide-react';

interface LinkCardProps {
  platform: string;
  url: string;
  label: string;
  icon: LucideIcon;
  subtext?: string;
  stack?: string;
}

export default function LinkCard({ url, label, icon: Icon, subtext, stack }: LinkCardProps) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center p-4 bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-800 hover:border-primary/50 rounded-xl transition-all duration-300 backdrop-blur-sm overflow-hidden"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />

      {/* Icon */}
      <div className="flex-shrink-0 mr-4 text-zinc-400 group-hover:text-primary transition-colors">
        <Icon size={24} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-zinc-100 group-hover:text-primary transition-colors truncate">
            {label}
          </h3>
          <ArrowUpRight 
            size={16} 
            className="text-zinc-500 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:rotate-45" 
          />
        </div>
        
        {/* Subtext - Visible on Hover/Desktop or always visible depending on design? 
            Instruction says "Hover reveals subtext". 
            But for mobile friendly, maybe always visible or easy to see.
            I'll make it appear/expand on hover or just exist with subtle color.
        */}
        {(subtext || stack) && (
          <div className="mt-1 space-y-0.5 overflow-hidden transition-all duration-300 max-h-0 group-hover:max-h-20 opacity-0 group-hover:opacity-100">
            {subtext && <p className="text-xs text-zinc-400">↳ {subtext}</p>}
            {stack && <p className="text-xs text-zinc-500">↳ {stack}</p>}
          </div>
        )}
      </div>
    </motion.a>
  );
}
