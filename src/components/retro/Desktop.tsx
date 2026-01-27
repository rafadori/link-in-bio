import { useState, useRef } from 'react';
import { ProfileWindow } from './windows/ProfileWindow';
import { ClockWindow } from './windows/ClockWindow';
import { LogWindow } from './windows/LogWindow';
import { TimeWindow } from './windows/TimeWindow';
import { AudioWindow } from './windows/AudioWindow';

export const Desktop = () => {
  const constraintsRef = useRef(null);
  const [activeWindow, setActiveWindow] = useState('profile');

  const bringToFront = (id: string) => {
    setActiveWindow(id);
  };

  const getOpacity = (id: string) => {
    // Profile is always fully visible
    if (id === 'profile') return "";
    // Others are semi-transparent unless active
    return activeWindow === id ? "opacity-90" : "opacity-40 hover:opacity-80";
  };

  return (
    <div 
      ref={constraintsRef} 
      className="fixed inset-0 bg-[#050505] overflow-hidden font-mono text-zinc-300 select-none"
    >
      {/* Grid Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(30,30,30,1)_1px,transparent_1px),linear-gradient(90deg,rgba(30,30,30,1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20" />

      {/* Background Windows - using responsive classes for positioning */}
      
      {/* Top Left - Audio */}
      <AudioWindow 
        className={`left-4 top-4 md:left-10 md:top-10 ${getOpacity('audio')}`}
        dragConstraints={constraintsRef}
        isActive={activeWindow === 'audio'}
        onInteract={() => bringToFront('audio')}
      />

      {/* Top Right - Clock */}
      <ClockWindow 
        className={`right-4 top-16 md:right-10 md:top-10 ${getOpacity('clock')}`}
        dragConstraints={constraintsRef}
        isActive={activeWindow === 'clock'}
        onInteract={() => bringToFront('clock')}
      />

      {/* Center Left - Hourglass */}
      <TimeWindow 
        className={`left-4 bottom-20 md:left-20 md:top-1/2 ${getOpacity('time')}`}
        dragConstraints={constraintsRef}
        isActive={activeWindow === 'time'}
        onInteract={() => bringToFront('time')}
      />

      {/* Bottom Right - Log */}
      <LogWindow 
        className={`right-4 bottom-4 md:right-20 md:bottom-20 ${getOpacity('log')}`}
        dragConstraints={constraintsRef}
        isActive={activeWindow === 'log'}
        onInteract={() => bringToFront('log')}
      />

      {/* Main Profile Window - Centered */}
      <ProfileWindow 
        className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-2xl"
        dragConstraints={constraintsRef}
        isActive={activeWindow === 'profile'}
        onInteract={() => bringToFront('profile')}
      />
    </div>
  );
};
