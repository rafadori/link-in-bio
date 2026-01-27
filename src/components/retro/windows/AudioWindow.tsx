import { useState, useEffect } from 'react';
import { WindowFrame } from '../WindowFrame';

interface AudioWindowProps {
  initialPosition?: { x: number; y: number };
  dragConstraints?: React.RefObject<Element>;
  isActive: boolean;
  onInteract: () => void;
}

export const AudioWindow = (props: AudioWindowProps) => {
  // We'll use CSS animations for performance instead of React state for every frame
  const bars = 32;

  return (
    <WindowFrame title="AUDIO" className="w-80 h-40" {...props}>
      <div className="flex flex-col h-full bg-zinc-950 p-4">
        <div className="mb-4">
          <h2 className="text-lg font-pixel text-zinc-100 mb-1">GLOCK TECHNOLOGY</h2>
          <div className="flex justify-between items-end">
            <span className="text-zinc-400 text-xs">Syredu</span>
            <span className="text-zinc-500 text-[10px] animate-pulse">Playing</span>
          </div>
        </div>
        
        <div className="flex-1 flex items-end gap-[2px] overflow-hidden">
          {Array.from({ length: bars }).map((_, i) => (
            <div 
              key={i} 
              className="bg-zinc-500 w-full animate-pulse"
              style={{
                height: `${Math.random() * 100}%`,
                animationDuration: `${0.5 + Math.random()}s`,
                opacity: 0.6 + Math.random() * 0.4
              }}
            />
          ))}
        </div>
      </div>
    </WindowFrame>
  );
};
