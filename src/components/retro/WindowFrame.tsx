import React from "react";
import { motion } from "framer-motion";
import { X, Minus, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface WindowFrameProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  initialPosition?: { x: number; y: number };
  isActive?: boolean;
  onInteract?: () => void;
  onClose?: () => void;
  dragConstraints?: React.RefObject<Element>;
  drag?: boolean;
}

// Noise texture for that worn metal look
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")`;

// Colors extracted/approximated from the reference
const COLORS = {
  beige: "#c7bfa5",
  darkBg: "#1a1a1a",
  metalLight: "#525252",
  metalDark: "#262626",
  accent: "#78716c", // Stone-500 approx
};

export const WindowFrame = ({
  title,
  children,
  className,
  initialPosition = { x: 0, y: 0 },
  isActive = false,
  onInteract,
  onClose,
  dragConstraints,
  drag = true,
}: WindowFrameProps) => {
  return (
    <motion.div
      drag={drag}
      dragMomentum={false}
      dragConstraints={dragConstraints}
      initial={initialPosition}
      onMouseDown={onInteract}
      onTouchStart={onInteract}
      className={cn(
        "flex flex-col transition-all",
        isActive ? "z-50" : "z-10 opacity-90",
        className,
      )}
      style={{
        filter: isActive
          ? "drop-shadow(0px 10px 20px rgba(0,0,0,0.6))"
          : "drop-shadow(0px 5px 10px rgba(0,0,0,0.5))",
      }}
    >
      {/* 
        COMPLEX FRAME STRUCTURE
        The frame is built with multiple nested borders to simulate the 3D bevelled metallic look.
      */}

      {/* 1. Outer Rim (Dark Metal) */}
      <div className="bg-[#111] p-1 shadow-2xl relative">
        {/* Decorative Screw/Rivets on Outer Rim */}
        <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-[#444] shadow-[inset_1px_1px_0_rgba(255,255,255,0.2)]" />
        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#444] shadow-[inset_1px_1px_0_rgba(255,255,255,0.2)]" />
        <div className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-[#444] shadow-[inset_1px_1px_0_rgba(255,255,255,0.2)]" />
        <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-[#444] shadow-[inset_1px_1px_0_rgba(255,255,255,0.2)]" />

        {/* 2. Main Metallic Bevel (The thick frame) */}
        <div className="bg-[#2a2a2a] p-[3px] border-t border-l border-[#555] border-b border-r border-[#111] relative">
          {/* Noise Overlay for Metal Texture */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: NOISE_SVG }}
          />

          {/* 3. Inner Groove (Recessed line) */}
          <div className="border border-[#111] bg-[#1a1a1a] p-[2px]">
            {/* 4. Content Container Border (Raised again) */}
            <div className="border-t border-l border-[#444] border-b border-r border-[#000] bg-[#0d0d0d] flex flex-col">
              {/* --- TITLE BAR --- */}
              <div className="flex items-center justify-between px-3 py-2 bg-[#1c1c1c] border-b border-[#333] relative cursor-grab active:cursor-grabbing select-none">
                {/* Title Bar Texture */}
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{ backgroundImage: NOISE_SVG }}
                />

                {/* Left: Title with Ornaments */}
                <div className="flex items-center gap-2 z-10">
                  <span className="text-[#555] text-[10px]">♦</span>
                  <div className="flex items-center gap-2">
                    <span className="font-pixel text-sm uppercase tracking-[0.2em] text-[#c7bfa5] drop-shadow-md">
                      {title}
                    </span>
                  </div>
                  <div className="flex items-center text-[#444] text-[8px] gap-1">
                    <span>◆</span>
                    <span className="w-8 h-[1px] bg-[#333] inline-block"></span>
                    <span>◆</span>
                  </div>
                </div>

                {/* Right: Controls (Boxed Buttons) */}
                <div className="flex items-center gap-1 z-10">
                  {onClose && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                      }}
                      className="group relative w-6 h-6 flex items-center justify-center bg-[#222] border-t border-l border-[#444] border-b border-r border-[#000] hover:bg-[#333] active:border-t-[#000] active:border-l-[#000] active:border-b-[#444] active:border-r-[#444] transition-colors"
                    >
                      <X
                        size={10}
                        className="text-[#c7bfa5] group-hover:text-white"
                      />
                    </button>
                  )}
                </div>
              </div>

              {/* --- MAIN CONTENT AREA --- */}
              <div className="relative p-1 bg-black">
                {/* Inner Bevel for the Screen */}
                <div className="relative border-t border-l border-[#000] border-b border-r border-[#333] bg-[#050505] overflow-hidden">
                  {/* CRT Overlay Effects */}
                  <div className="absolute inset-0 pointer-events-none z-[60] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] opacity-20" />
                  <div className="absolute inset-0 pointer-events-none z-[61] opacity-20 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.8)_100%)]" />

                  {/* The actual content */}
                  <div className="relative z-10 min-h-[100px]">{children}</div>
                </div>
              </div>

              {/* --- BOTTOM DECORATION STRIP (Optional, based on image bottom frame) --- */}
              <div className="h-2 bg-[#1c1c1c] border-t border-[#333] flex items-center justify-center gap-1">
                <div className="w-full h-[1px] bg-[#333] mx-2"></div>
              </div>
            </div>
          </div>

          {/* Corner Plates (The "brackets" look) */}
          <CornerBracket position="top-left" />
          <CornerBracket position="top-right" />
          <CornerBracket position="bottom-left" />
          <CornerBracket position="bottom-right" />
        </div>
      </div>
    </motion.div>
  );
};

const CornerBracket = ({
  position,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) => {
  const rotation = {
    "top-left": "rotate(0deg)",
    "top-right": "rotate(90deg)",
    "bottom-right": "rotate(180deg)",
    "bottom-left": "rotate(270deg)",
  };

  const style = {
    top: position.includes("top") ? -1 : "auto",
    bottom: position.includes("bottom") ? -1 : "auto",
    left: position.includes("left") ? -1 : "auto",
    right: position.includes("right") ? -1 : "auto",
    transform: rotation[position],
  };

  return (
    <div className="absolute w-4 h-4 pointer-events-none z-20" style={style}>
      {/* The L-shape bracket */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 15V1H15"
          stroke="#555"
          strokeWidth="2"
          strokeLinecap="square"
        />
        <path
          d="M1 15V1H15"
          stroke="#111"
          strokeWidth="2"
          strokeLinecap="square"
          transform="translate(1,1)"
          opacity="0.5"
        />
        {/* Screw head */}
        <circle
          cx="3.5"
          cy="3.5"
          r="1.5"
          fill="#333"
          stroke="#111"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
};
