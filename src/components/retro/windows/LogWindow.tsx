import { useState, useEffect, useRef } from 'react';
import { WindowFrame } from '../WindowFrame';

interface LogWindowProps {
  initialPosition?: { x: number; y: number };
  dragConstraints?: React.RefObject<Element>;
  isActive: boolean;
  onInteract: () => void;
}

const TASKS = [
  "System Interrupts",
  "Service Host: Network List Service",
  "Service Host: Local Service",
  "Service Host: Event Log",
  "Make My Day",
  "Application Frame Host",
  "Runtime Broker",
  "Service Host: DNS Client",
  "Service Host: DHCP Client",
  "System Idle Process",
  "Registry",
  "Memory Compression"
];

export const LogWindow = (props: LogWindowProps) => {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial logs
    const initialLogs = Array.from({ length: 8 }, () => generateLog());
    setLogs(initialLogs);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const interval = setInterval(() => {
      setLogs(prev => {
        const newLogs = [...prev, generateLog()];
        if (newLogs.length > 50) newLogs.shift(); // Keep limit
        return newLogs;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const generateLog = () => {
    const now = new Date();
    const time = now.toLocaleTimeString('en-GB', { hour12: false });
    const id = Math.floor(Math.random() * 900000) + 100000;
    const task = TASKS[Math.floor(Math.random() * TASKS.length)];
    return `${time}   ${id}    ${task}`;
  };

  return (
    <WindowFrame title="LOG" className="w-96 h-64" {...props}>
      <div className="flex flex-col h-full bg-zinc-950 p-2 text-xs font-mono">
        <div className="flex border-b border-zinc-800 pb-1 mb-1 text-zinc-500 uppercase">
          <span className="w-20">TIME</span>
          <span className="w-20">ID</span>
          <span>TASK</span>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-hidden relative">
          {logs.map((log, i) => (
            <div key={i} className="whitespace-pre font-mono text-zinc-300 leading-tight">
              {log}
            </div>
          ))}
          {/* Scanline overlay for this specific window if needed, but main frame has it */}
        </div>
      </div>
    </WindowFrame>
  );
};
