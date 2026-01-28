import { useState, useRef, useEffect } from "react";
import { ProfileWindow } from "./windows/ProfileWindow";
import { ClockWindow } from "./windows/ClockWindow";
import { LogWindow } from "./windows/LogWindow";
import { TimeWindow } from "./windows/TimeWindow";
import { AudioWindow } from "./windows/AudioWindow";

export const Desktop = () => {
  const constraintsRef = useRef(null);
  const [activeWindow, setActiveWindow] = useState("profile");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const bringToFront = (id: string) => {
    setActiveWindow(id);
  };

  const getOpacity = (id: string) => {
    if (isMobile) return "";
    // Profile is always fully visible
    if (id === "profile") return "";
    // Others are semi-transparent unless active
    return activeWindow === id ? "opacity-90" : "opacity-40 hover:opacity-80";
  };

  return (
    <div
      ref={constraintsRef}
      className="min-h-screen bg-[#050505] font-mono text-zinc-300 select-none overflow-y-auto overflow-x-hidden md:fixed md:inset-0 md:overflow-hidden flex flex-col md:block gap-6 p-4 md:gap-0 md:p-0"
    >
      {/* Grid Background Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(30,30,30,1)_1px,transparent_1px),linear-gradient(90deg,rgba(30,30,30,1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20 z-0" />

      {/* Background Windows - using responsive classes for positioning */}

      {/* Top Left - Audio */}
      <AudioWindow
        className={`order-3 relative md:absolute w-full md:w-auto left-0 top-0 md:left-10 md:top-10 ${getOpacity("audio")}`}
        dragConstraints={constraintsRef}
        isActive={activeWindow === "audio"}
        onInteract={() => bringToFront("audio")}
        drag={!isMobile}
      />

      {/* Top Right - Clock */}
      <ClockWindow
        className={`order-2 relative md:absolute w-full md:w-auto right-0 top-0 md:right-10 md:top-10 ${getOpacity("clock")}`}
        dragConstraints={constraintsRef}
        isActive={activeWindow === "clock"}
        onInteract={() => bringToFront("clock")}
        drag={!isMobile}
      />

      {/* Center Left - Hourglass */}
      <TimeWindow
        className={`order-4 relative md:absolute w-full md:w-auto left-0 top-0 md:left-20 md:top-1/2 ${getOpacity("time")}`}
        dragConstraints={constraintsRef}
        isActive={activeWindow === "time"}
        onInteract={() => bringToFront("time")}
        drag={!isMobile}
      />

      {/* Bottom Right - Log */}
      <LogWindow
        className={`order-5 relative md:absolute w-full md:w-auto right-0 top-0 md:right-20 md:bottom-20 ${getOpacity("log")}`}
        dragConstraints={constraintsRef}
        isActive={activeWindow === "log"}
        onInteract={() => bringToFront("log")}
        drag={!isMobile}
      />

      {/* Main Profile Window - Centered */}
      <ProfileWindow
        className="order-1 relative md:absolute w-full md:w-auto top-0 left-0 translate-x-0 translate-y-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 shadow-2xl h-auto max-h-none md:h-[80vh] md:max-h-[600px]"
        dragConstraints={constraintsRef}
        isActive={activeWindow === "profile"}
        onInteract={() => bringToFront("profile")}
        drag={!isMobile}
      />
    </div>
  );
};
