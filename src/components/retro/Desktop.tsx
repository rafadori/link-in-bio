import { useState, useRef, useEffect } from "react";
import { ProfileWindow } from "./windows/ProfileWindow";
import { ClockWindow } from "./windows/ClockWindow";
import { LogWindow } from "./windows/LogWindow";
import { TimeWindow } from "./windows/TimeWindow";
import { AudioWindow } from "./windows/AudioWindow";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Desktop = () => {
  const constraintsRef = useRef(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeWindow, setActiveWindow] = useState("profile");
  const [isMobile, setIsMobile] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Consider mobile/tablet up to lg breakpoint (1024px) for simpler stacking
      // or keep 768px (md) if we want grid on tablets.
      // Given the user issues, let's switch to Grid at lg (1024px)
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setShowScrollIndicator(true);
      } else {
        setShowScrollIndicator(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;

    if (scrollTop > 50 || scrollHeight <= clientHeight) {
      setShowScrollIndicator(false);
    } else {
      setShowScrollIndicator(true);
    }
  };

  const bringToFront = (id: string) => {
    setActiveWindow(id);
  };

  const getOpacity = (id: string) => {
    if (isMobile) return "";
    if (id === "profile") return "";
    return activeWindow === id ? "opacity-90" : "opacity-40 hover:opacity-80";
  };

  return (
    <div
      ref={constraintsRef}
      className="h-screen bg-[#050505] font-mono text-zinc-300 select-none overflow-hidden flex flex-col"
    >
      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-auto overflow-x-hidden p-4 flex flex-col gap-6 items-center lg:grid lg:grid-cols-[1fr_auto_1fr] lg:grid-rows-[auto_auto] lg:gap-8 lg:p-12 lg:items-center lg:justify-items-center lg:overflow-hidden"
      >
        {/* Grid Background Pattern */}
        <div className="fixed inset-0 bg-[linear-gradient(rgba(30,30,30,1)_1px,transparent_1px),linear-gradient(90deg,rgba(30,30,30,1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20 z-0" />

        {/* Top Left - Audio */}
        <AudioWindow
          className={`order-3 relative z-10 ${getOpacity("audio")} lg:col-start-1 lg:row-start-1 lg:justify-self-end w-full max-w-[22rem] lg:w-auto`}
          dragConstraints={constraintsRef}
          isActive={activeWindow === "audio"}
          onInteract={() => bringToFront("audio")}
          drag={!isMobile}
        />

        {/* Top Right - Clock */}
        <ClockWindow
          className={`order-2 relative z-10 ${getOpacity("clock")} lg:col-start-3 lg:row-start-1 lg:justify-self-start w-full max-w-80 lg:w-auto`}
          dragConstraints={constraintsRef}
          isActive={activeWindow === "clock"}
          onInteract={() => bringToFront("clock")}
          drag={!isMobile}
        />

        {/* Center Left - Hourglass */}
        <TimeWindow
          className={`order-4 relative z-10 ${getOpacity("time")} lg:col-start-1 lg:row-start-2 lg:justify-self-end w-full max-w-64 lg:w-auto`}
          dragConstraints={constraintsRef}
          isActive={activeWindow === "time"}
          onInteract={() => bringToFront("time")}
          drag={!isMobile}
        />

        {/* Bottom Right - Log */}
        <LogWindow
          className={`order-5 relative z-10 ${getOpacity("log")} lg:col-start-3 lg:row-start-2 lg:justify-self-start w-full max-w-96 lg:w-auto`}
          dragConstraints={constraintsRef}
          isActive={activeWindow === "log"}
          onInteract={() => bringToFront("log")}
          drag={!isMobile}
        />

        {/* Main Profile Window - Centered */}
        <ProfileWindow
          className="order-1 relative z-20 lg:col-start-2 lg:row-start-1 lg:row-span-2 shadow-2xl h-auto max-h-none lg:h-[80vh] lg:max-h-[600px] w-full max-w-[400px] lg:w-auto"
          dragConstraints={constraintsRef}
          isActive={activeWindow === "profile"}
          onInteract={() => bringToFront("profile")}
          drag={!isMobile}
        />
      </div>

      {/* Scroll Indicator (Mobile Only) */}
      <AnimatePresence>
        {isMobile && showScrollIndicator && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="bg-zinc-900/80 backdrop-blur-sm p-2 rounded-full border border-zinc-700 shadow-lg text-zinc-400"
            >
              <ChevronDown size={24} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
