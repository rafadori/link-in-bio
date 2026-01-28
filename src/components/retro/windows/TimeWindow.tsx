import React, { useEffect, useRef } from "react";
import { WindowFrame } from "../WindowFrame";

interface TimeWindowProps {
  initialPosition?: { x: number; y: number };
  dragConstraints?: React.RefObject<Element>;
  isActive: boolean;
  onInteract: () => void;
  className?: string;
}

type Assets = {
  frame: HTMLImageElement;
  mask: HTMLImageElement;
  overlay?: HTMLImageElement;
};

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load: ${src}`));
    img.src = src;
  });
}

export const TimeWindow = (props: TimeWindowProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let raf = 0;
    let disposed = false;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // ====== Tuning ======
    const CANVAS_W = canvas.width;
    const CANVAS_H = canvas.height;

    // PIX = tamanho do “pixel lógico” da simulação
    // 256/2 = 128x128 grid (ótimo equilíbrio e fica bem pixelado)
    const PIX = 2;
    const SIM_W = Math.floor(CANVAS_W / PIX);
    const SIM_H = Math.floor(CANVAS_H / PIX);

    // Sand: 0 empty, 1 sand
    let sand = new Uint8Array(SIM_W * SIM_H);
    // Mask: 0 blocked, 1 allowed
    let mask = new Uint8Array(SIM_W * SIM_H);

    const idx = (x: number, y: number) => y * SIM_W + x;

    const clear = () => ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    const drawSandPixel = (x: number, y: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(x * PIX, y * PIX, PIX, PIX);
    };

    // Lê mask.png e converte para grid binário no tamanho SIM_W x SIM_H
    const buildMaskFromImage = (maskImg: HTMLImageElement) => {
      const off = document.createElement("canvas");
      off.width = SIM_W;
      off.height = SIM_H;

      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;

      octx.clearRect(0, 0, SIM_W, SIM_H);
      octx.imageSmoothingEnabled = false;
      octx.drawImage(maskImg, 0, 0, SIM_W, SIM_H);

      const data = octx.getImageData(0, 0, SIM_W, SIM_H).data;
      for (let y = 0; y < SIM_H; y++) {
        for (let x = 0; x < SIM_W; x++) {
          const k = (y * SIM_W + x) * 4;
          const r = data[k];
          const g = data[k + 1];
          const b = data[k + 2];
          const lum = (r + g + b) / 3;
          // Branco = permitido
          mask[idx(x, y)] = lum > 200 ? 1 : 0;
        }
      }
    };

    const seedTop = () => {
      sand.fill(0);

      const topLimit = Math.floor(SIM_H * 0.46); // topo da ampulheta
      for (let y = 0; y < topLimit; y++) {
        for (let x = 0; x < SIM_W; x++) {
          const i = idx(x, y);
          if (!mask[i]) continue;

          // densidade: mais cheio em cima e menos perto do gargalo
          const r = y / Math.max(1, topLimit);
          const prob = 0.68 * (1 - r) + 0.08 * r;

          if (Math.random() < prob) sand[i] = 1;
        }
      }
    };

    const countAll = () => {
      let n = 0;
      for (let i = 0; i < sand.length; i++) if (sand[i]) n++;
      return n;
    };

    const countTop = () => {
      let n = 0;
      const topLimit = Math.floor(SIM_H * 0.5);
      for (let y = 0; y < topLimit; y++) {
        for (let x = 0; x < SIM_W; x++) {
          if (sand[idx(x, y)]) n++;
        }
      }
      return n;
    };

    const countBottom = () => {
      let n = 0;
      const startY = Math.floor(SIM_H * 0.5); // Começa logo após o topLimit
      for (let y = startY; y < SIM_H; y++) {
        for (let x = 0; x < SIM_W; x++) {
          if (sand[idx(x, y)]) n++;
        }
      }
      return n;
    };

    const placeOneGrainInTop = () => {
      const topLimit = Math.floor(SIM_H * 0.46);
      for (let tries = 0; tries < 500; tries++) {
        const x = (Math.random() * SIM_W) | 0;
        const y = (Math.random() * topLimit) | 0;
        const i = idx(x, y);
        if (mask[i] && !sand[i]) {
          sand[i] = 1;
          return true;
        }
      }
      return false;
    };

    const takeOneGrainFromBottom = () => {
      const startY = Math.floor(SIM_H * 0.5);

      // varre de baixo pra cima, do centro pra fora (mais chance de pegar do monte)
      const cx = (SIM_W / 2) | 0;

      for (let y = SIM_H - 1; y >= startY; y--) {
        // do centro para as laterais
        for (let dx = 0; dx < SIM_W; dx++) {
          const x = (cx + (dx % 2 === 0 ? dx / 2 : -(dx + 1) / 2)) | 0;
          if (x < 0 || x >= SIM_W) continue;

          const i = idx(x, y);
          if (sand[i]) {
            sand[i] = 0;
            return true;
          }
        }
      }

      return false;
    };

    // Cellular sand step (bottom-up)
    const stepSand = (tick: number) => {
      for (let y = SIM_H - 2; y >= 0; y--) {
        const ltr = (tick & 1) === 0;
        const startX = ltr ? 1 : SIM_W - 2;
        const endX = ltr ? SIM_W - 1 : 0;
        const stepX = ltr ? 1 : -1;

        for (let x = startX; x !== endX; x += stepX) {
          const i = idx(x, y);
          if (!sand[i]) continue;

          const b = idx(x, y + 1);
          const bl = idx(x - 1, y + 1);
          const br = idx(x + 1, y + 1);

          if (mask[b] && !sand[b]) {
            sand[i] = 0;
            sand[b] = 1;
            continue;
          }

          // alterna preferência para evitar viés
          const preferLeft = ((x * 73856093) ^ (y * 19349663) ^ tick) & 1;

          if (preferLeft) {
            if (mask[bl] && !sand[bl]) {
              sand[i] = 0;
              sand[bl] = 1;
              continue;
            }
            if (mask[br] && !sand[br]) {
              sand[i] = 0;
              sand[br] = 1;
              continue;
            }
          } else {
            if (mask[br] && !sand[br]) {
              sand[i] = 0;
              sand[br] = 1;
              continue;
            }
            if (mask[bl] && !sand[bl]) {
              sand[i] = 0;
              sand[bl] = 1;
              continue;
            }
          }
        }
      }
    };

    const drawSand = (tick: number) => {
      const S1 = "#e5d9c5"; // areia clara (bege frio)
      const S2 = "#cbbfae"; // sombra da areia

      for (let y = 0; y < SIM_H; y++) {
        for (let x = 0; x < SIM_W; x++) {
          const i = idx(x, y);
          if (!sand[i]) continue;

          const dither = ((x + y + (tick >> 2)) & 1) === 0;
          drawSandPixel(x, y, dither ? S1 : S2);
        }
      }
    };

    const renderStatic = (assets: Assets) => {
      clear();
      ctx.imageSmoothingEnabled = false;

      // frame
      ctx.drawImage(assets.frame, 0, 0, CANVAS_W, CANVAS_H);

      // sand “cheia” embaixo
      sand.fill(0);
      const startY = Math.floor(SIM_H * 0.55);
      for (let y = startY; y < SIM_H; y++) {
        for (let x = 0; x < SIM_W; x++) {
          const i = idx(x, y);
          if (mask[i] && Math.random() < 0.62) sand[i] = 1;
        }
      }
      drawSand(0);

      // overlay
      if (assets.overlay) {
        ctx.globalAlpha = 0.8; // ajuste fino aqui
        ctx.drawImage(assets.overlay, 0, 0, CANVAS_W, CANVAS_H);
        ctx.globalAlpha = 1;
      }
    };

    const start = async () => {
      const baseUrl = import.meta.env.BASE_URL;
      const [frame, maskImg] = await Promise.all([
        loadImage(`${baseUrl}hourglass/frame.png`),
        loadImage(`${baseUrl}hourglass/mask.png`),
      ]);

      let overlay: HTMLImageElement | undefined;
      try {
        overlay = await loadImage(`${baseUrl}hourglass/overlay.png`);
      } catch {
        overlay = undefined;
      }

      if (disposed) return;

      const assets: Assets = { frame, mask: maskImg, overlay };

      buildMaskFromImage(maskImg);

      // Seed initial sand
      seedTop();
      const TARGET_TOP = countTop(); // quanto tinha no início (meta de refill)

      if (mediaQuery.matches) {
        renderStatic(assets);
        return;
      }

      let tick = 0;

      // controla velocidade sem depender do FPS
      let physicsAcc = 0;

      // 0.30 = bem mais lento (ajuste fino aqui)
      const PHYSICS_SPEED = 0.1;

      // Refill: quando acabar, começa a voltar areia pro topo aos poucos
      let isRefilling = false;

      // quantos grãos por frame no refill
      const REFILL_GRAINS_PER_FRAME = 26;

      const loop = () => {
        try {
          tick++;

          // Log de diagnóstico a cada ~1 segundo (60 frames)
          if (tick % 60 === 0) {
            const tc = countTop();
            const bc = countBottom();
            const tot = countAll();
            console.log(
              `[TimeWindow] tick=${tick} isRefilling=${isRefilling} top=${tc} bot=${bc} total=${tot}`,
            );
          }

          clear();
          ctx.imageSmoothingEnabled = false;

          // 1) frame
          ctx.drawImage(assets.frame, 0, 0, CANVAS_W, CANVAS_H);

          // 2) decide se precisa entrar em refill
          const topCount = countTop();
          const bottomCount = countBottom();
          const totalCount = countAll();

          // entra em refill quando: topo quase vazio
          // AJUSTE CRÍTICO: Log mostrou travamento com top=68. Aumentando limite para 100 ou 25% do total.
          if (
            !isRefilling &&
            (topCount < 100 || topCount < totalCount * 0.25)
          ) {
            console.log("[TimeWindow] Starting refill (Triggered)!", {
              topCount,
              bottomCount,
              totalCount,
            });
            isRefilling = true;
            physicsAcc = 0;

            // limpa uma faixinha no gargalo (opcional)
            const y = (SIM_H * 0.5) | 0;
            for (let x = 0; x < SIM_W; x++) {
              if (!mask[idx(x, y)]) continue;
              sand[idx(x, y)] = 0;
            }
          }

          // sai do refill quando o topo estiver bem cheio
          if (isRefilling && topCount >= TARGET_TOP * 0.95) {
            isRefilling = false;
          }

          // fallback: se ficou tudo muito vazio por algum motivo, reinicia
          if (!isRefilling && totalCount < 50) {
            seedTop();
          }

          // 3) física
          if (!isRefilling) {
            physicsAcc += PHYSICS_SPEED;
            while (physicsAcc >= 1) {
              stepSand(tick);
              physicsAcc -= 1;
            }
          } else {
            // refill: somente recarrega (teleporta) — sem física nesse modo
            for (let k = 0; k < REFILL_GRAINS_PER_FRAME; k++) {
              const took = takeOneGrainFromBottom();
              if (!took) break;

              const placed = placeOneGrainInTop();
              if (!placed) break;
            }
          }

          // 4) areia
          drawSand(tick);

          // 5) overlay
          if (assets.overlay) {
            ctx.globalAlpha = 0.8;
            ctx.drawImage(assets.overlay, 0, 0, CANVAS_W, CANVAS_H);
            ctx.globalAlpha = 1;
          }
        } catch (err) {
          console.error("[TimeWindow] Error in loop:", err);
        }

        raf = requestAnimationFrame(loop);
      };

      loop();
    };

    start().catch((e) => console.error("[TimeWindow] assets error:", e));

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <WindowFrame title="TIME?" className="w-64 h-64" {...props}>
      <div className="flex items-center justify-center h-full bg-zinc-950">
        <canvas
          ref={canvasRef}
          width={256}
          height={256}
          className="image-pixelated"
        />
      </div>
    </WindowFrame>
  );
};
