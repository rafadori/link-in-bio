import { useState, useEffect } from "react";
import { WindowFrame } from "../WindowFrame";
import { cn } from "@/lib/utils";

interface ClockWindowProps {
  initialPosition?: { x: number; y: number };
  dragConstraints?: React.RefObject<Element>;
  isActive: boolean;
  onInteract: () => void;
  className?: string;
  drag?: boolean;
}

export const ClockWindow = (props: ClockWindowProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
    });
  };

  // Break time into parts for the layout style
  const timeStr = formatTime(time);
  const [hours, minutes, seconds] = timeStr.split(":");

  return (
    <WindowFrame
      title="CALENDAR"
      {...props}
      className={cn("w-80 h-48", props.className)}
    >
      <div className="flex h-full bg-zinc-950 p-4 gap-4">
        {/* Left Column: Stacked Seconds/Minutes style from reference */}
        <div className="flex flex-col justify-center gap-1">
          <span className="text-4xl leading-none text-zinc-400 font-mono">
            {hours}
          </span>
          <span className="text-4xl leading-none text-zinc-300 font-mono">
            {minutes}
          </span>
          <span className="text-4xl leading-none text-zinc-500 font-mono">
            {seconds}
          </span>
        </div>

        {/* Right Column: Date and Grid */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="text-right">
            <div className="text-5xl font-mono text-zinc-200">
              {time.getDate()}
            </div>
            <div className="text-xl text-zinc-400 uppercase tracking-widest">
              {time.toLocaleString("default", { month: "long" })}
            </div>
          </div>

          {/* Decorative mini calendar grid */}
          <div className="grid grid-cols-7 gap-1 text-xs text-zinc-600 font-mono mt-2">
            {Array.from({ length: 31 }, (_, i) => (
              <div
                key={i}
                className={
                  i + 1 === time.getDate()
                    ? "text-white font-bold bg-zinc-800 text-center"
                    : "text-center"
                }
              >
                {(i + 1).toString().padStart(2, "0")}
              </div>
            ))}
          </div>
        </div>
      </div>
    </WindowFrame>
  );
};
