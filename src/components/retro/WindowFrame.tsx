import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WindowFrameProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  initialPosition?: { x: number; y: number };
  isActive?: boolean;
  onInteract?: () => void;
  onClose?: () => void;
  dragConstraints?: React.RefObject<Element>;
}

export const WindowFrame = ({
  title,
  children,
  className,
  initialPosition = { x: 0, y: 0 },
  isActive = false,
  onInteract,
  onClose,
  dragConstraints,
}: WindowFrameProps) => {
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={dragConstraints}
      initial={initialPosition}
      onMouseDown={onInteract}
      onTouchStart={onInteract}
      className={cn(
        "absolute flex flex-col border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] transition-shadow",
        isActive ? "z-50 border-zinc-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)]" : "z-10 border-zinc-700 opacity-90",
        "bg-black text-zinc-100",
        className
      )}
    >
      {/* Title Bar */}
      <div className="flex items-center justify-between px-2 py-1 bg-zinc-800 border-b-2 border-zinc-700 cursor-grab active:cursor-grabbing select-none">
        <span className="font-pixel text-xs uppercase tracking-wider text-zinc-300">
          {title}
        </span>
        {onClose && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="hover:bg-red-500 hover:text-white p-0.5 transition-colors"
          >
            <X size={12} strokeWidth={3} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden font-mono relative">
        {children}
        
        {/* CRT/Scanline overlay effect (subtle) */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-[60] bg-[length:100%_2px,3px_100%] opacity-20" />
      </div>
    </motion.div>
  );
};
