import { useEffect, useRef } from 'react';
import { WindowFrame } from '../WindowFrame';

interface TimeWindowProps {
  initialPosition?: { x: number; y: number };
  dragConstraints?: React.RefObject<Element>;
  isActive: boolean;
  onInteract: () => void;
}

export const TimeWindow = (props: TimeWindowProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let sandLevel = 0;
    const maxSand = 100;
    
    // Pixel art helper
    const drawPixel = (x: number, y: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(Math.floor(x), Math.floor(y), 2, 2); // 2x2 pixels for visibility
    };

    const drawHourglass = () => {
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 2;
      ctx.beginPath();
      // Top Triangle
      ctx.moveTo(40, 40);
      ctx.lineTo(160, 40);
      ctx.lineTo(100, 100);
      ctx.lineTo(40, 40);
      // Bottom Triangle
      ctx.moveTo(40, 160);
      ctx.lineTo(160, 160);
      ctx.lineTo(100, 100);
      ctx.stroke();
    };

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw static hourglass frame
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawHourglass();

      if (mediaQuery.matches) {
          // Static full sand at bottom if reduced motion
          ctx.fillStyle = '#a1a1aa';
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(40, 160);
          ctx.lineTo(160, 160);
          ctx.lineTo(100, 100);
          ctx.clip();
          ctx.fillRect(40, 100, 120, 60);
          ctx.restore();
          return;
      }

      // Sand Logic
      sandLevel += 0.05;
      if (sandLevel > maxSand) sandLevel = 0; // Loop

      const topSandHeight = 60 * (1 - sandLevel / maxSand);
      const bottomSandHeight = 60 * (sandLevel / maxSand);

      ctx.fillStyle = '#a1a1aa'; // Zinc-400

      // Top Sand (Inverted Triangle clipped)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(40, 40);
      ctx.lineTo(160, 40);
      ctx.lineTo(100, 100);
      ctx.clip();
      ctx.fillRect(40, 100 - topSandHeight, 120, topSandHeight);
      ctx.restore();

      // Falling Stream
      if (sandLevel < maxSand) {
        ctx.fillRect(99, 100, 2, 60 - bottomSandHeight);
      }

      // Bottom Sand (Triangle growing)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(40, 160);
      ctx.lineTo(160, 160);
      ctx.lineTo(100, 100);
      ctx.clip();
      ctx.fillRect(40, 160 - bottomSandHeight, 120, bottomSandHeight);
      ctx.restore();
      
      // Random grain noise
      for(let i=0; i<20; i++) {
          if(Math.random() > 0.5) {
             drawPixel(40 + Math.random() * 120, 40 + Math.random() * 120, 'rgba(255,255,255,0.1)');
          }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <WindowFrame title="TIME?" className="w-64 h-64" {...props}>
      <div className="flex items-center justify-center h-full bg-zinc-950">
        <canvas ref={canvasRef} width={200} height={200} className="image-pixelated" />
      </div>
    </WindowFrame>
  );
};
