import React, { useEffect, useMemo, useRef, useState } from "react";
import { WindowFrame } from "../WindowFrame";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

interface AudioWindowProps {
  initialPosition?: { x: number; y: number };
  dragConstraints?: React.RefObject<Element>;
  isActive: boolean;
  onInteract: () => void;
  className?: string;
  drag?: boolean;
}

export const AudioWindow = (props: AudioWindowProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [typedLines, setTypedLines] = useState<string[]>([]);

  // parâmetros do “pixel look”
  const CANVAS_W = 128;
  const CANVAS_H = 80;
  const PIX = 2;
  const W = CANVAS_W / PIX;
  const H = CANVAS_H / PIX;

  const bars = 14; // Menos barras para caber no espaço menor

  // WebAudio
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const freqRef = useRef<Uint8Array | null>(null);

  // visual “conceitual”
  const seededNoise = useMemo(() => Math.random() * 9999, []);

  // Efeito de digitação
  useEffect(() => {
    const linesToType = ["> needle down", "> carrier locked", "> decoding.."];

    let currentLineIndex = 0;
    let currentCharIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const typeChar = () => {
      if (currentLineIndex >= linesToType.length) return;

      const currentLine = linesToType[currentLineIndex];

      setTypedLines((prev) => {
        const newLines = [...prev];
        if (!newLines[currentLineIndex]) newLines[currentLineIndex] = "";
        newLines[currentLineIndex] = currentLine.substring(
          0,
          currentCharIndex + 1,
        );
        return newLines;
      });

      currentCharIndex++;

      if (currentCharIndex >= currentLine.length) {
        currentLineIndex++;
        currentCharIndex = 0;
        timeoutId = setTimeout(typeChar, 500); // Pausa entre linhas
      } else {
        timeoutId = setTimeout(typeChar, 50); // Velocidade de digitação
      }
    };

    timeoutId = setTimeout(typeChar, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let tick = 0;

    const p = (x: number, y: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(x * PIX, y * PIX, PIX, PIX);
    };

    const clear = () => {
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      // fundo transparente ou combinando com o container
      ctx.fillStyle = "#18181b"; // zinc-900
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    };

    const drawFrame = () => {
      // scanlines leves apenas
      for (let y = 0; y < H; y += 2) {
        for (let x = 0; x < W; x++) {
          if (((x + y + tick) & 7) === 0) p(x, y, "rgba(255,255,255,0.02)");
        }
      }
    };

    const getBarHeights = (): number[] => {
      const heights: number[] = new Array(bars).fill(0);

      const analyser = analyserRef.current;
      const freq = freqRef.current;

      if (isPlaying && analyser && freq) {
        analyser.getByteFrequencyData(freq as any);
        for (let i = 0; i < bars; i++) {
          const idx = Math.floor((i / bars) * freq.length);
          const v = freq[idx] / 255;
          heights[i] = Math.floor(v * (H - 5));
        }
        return heights;
      }

      // Idle visual
      for (let i = 0; i < bars; i++) {
        const wave = Math.sin(tick * 0.08 + i * 0.6);
        const jitter = Math.sin(seededNoise + tick * 0.23 + i * 1.7);
        const v = (wave * 0.5 + 0.5) * 0.3 + (jitter * 0.5 + 0.5) * 0.2; // Menor amplitude no idle
        heights[i] = Math.floor(v * (H - 5));
      }
      return heights;
    };

    const drawBars = (heights: number[]) => {
      const baseY = H - 2;
      const startX = 2;
      const gap = 2;
      const barW = 2;

      for (let i = 0; i < bars; i++) {
        const h = heights[i];
        const x0 = startX + i * (barW + gap);

        for (let y = 0; y < h; y++) {
          const yy = baseY - y;
          const d = ((x0 + yy + (tick >> 2)) & 1) === 0;
          const col = isPlaying
            ? d
              ? "#e5d9c5"
              : "#cbbfae"
            : d
              ? "#52525b"
              : "#3f3f46"; // Mais escuro no idle

          p(x0, yy, col);
          p(x0 + 1, yy, col);
        }
      }
    };

    const loop = () => {
      tick++;
      clear();
      drawFrame();
      drawBars(getBarHeights());
      raf = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(raf);
  }, [isPlaying, seededNoise]);

  const ensureAudioGraph = () => {
    if (!audioRef.current) return;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    if (!analyserRef.current) {
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.75;
      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      analyserRef.current = analyser;
      freqRef.current = new Uint8Array(analyser.frequencyBinCount);
    }
  };

  const togglePlay = async () => {
    if (!audioRef.current) return;
    ensureAudioGraph();

    if (audioCtxRef.current?.state === "suspended") {
      await audioCtxRef.current.resume();
    }

    if (audioRef.current.paused) {
      await audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <WindowFrame
      title="AUDIO"
      {...props}
      className={cn("w-[22rem] h-auto", props.className)}
      // Passando onClose como undefined explicitamente para garantir que não renderize o botão
      onClose={undefined}
    >
      <div className="flex flex-col w-full bg-[#111] border-2 border-[#2a2a2a] p-1 gap-1">
        {/* Top Section: Vinyl + Visualizer */}
        <div className="flex h-32 gap-1">
          {/* Vinyl Section */}
          <div className="w-1/2 bg-[#18181b] relative border border-[#333] overflow-hidden flex items-center justify-center">
            {/* Click area for vinyl */}
            <div
              className="relative w-24 h-24 cursor-pointer"
              onClick={togglePlay}
            >
              {/* Record */}
              <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-full h-full rounded-full bg-black border border-zinc-800 shadow-xl relative"
                style={{
                  background:
                    "radial-gradient(circle, #111 20%, #000 21%, #1a1a1a 22%, #000 24%, #1a1a1a 26%, #000 28%, #1a1a1a 30%, #000 32%, #1a1a1a 34%, #000 36%, #1a1a1a 38%, #000 40%, #1a1a1a 42%, #000 44%, #1a1a1a 46%, #000 48%, #1a1a1a 50%, #000 52%, #1a1a1a 54%, #000 56%, #1a1a1a 58%, #000 60%, #1a1a1a 62%, #000 64%, #1a1a1a 66%, #000 68%, #1a1a1a 70%, #000 72%)",
                }}
              >
                {/* Center Label */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#c7bfa5] rounded-full border border-zinc-600 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-black rounded-full" />
                </div>
              </motion.div>
            </div>

            {/* Tonearm */}
            <motion.div
              className="absolute top-2 right-2 w-1 h-16 origin-top bg-zinc-400 border border-zinc-600 shadow-lg pointer-events-none"
              animate={{ rotate: isPlaying ? 25 : 0 }}
              initial={{ rotate: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              style={{ width: 4, height: 60, borderRadius: 2 }}
            >
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-zinc-500 rounded-full" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-4 bg-zinc-300" />
            </motion.div>
          </div>

          {/* Visualizer Section */}
          <div className="w-1/2 bg-[#18181b] border border-[#333] relative flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              className="image-pixelated w-full h-full opacity-90"
            />
            {/* Dashed line overlay */}
            <div className="absolute top-1/2 left-2 right-2 h-[1px] border-t border-dashed border-white/10 pointer-events-none" />
          </div>
        </div>

        {/* Bottom Section: Terminal */}
        <div className="h-20 bg-[#0d0d0d] border border-[#333] p-2 font-mono text-xs text-[#c7bfa5] flex flex-col justify-end shadow-inner">
          {typedLines.map((line, i) => (
            <div key={i} className="opacity-80">
              {line}
              {i === typedLines.length - 1 && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  _
                </motion.span>
              )}
            </div>
          ))}
        </div>

        <audio
          ref={audioRef}
          src={`${import.meta.env.BASE_URL}audio/ambience.ogg`}
          loop
          preload="auto"
        />
      </div>
    </WindowFrame>
  );
};
