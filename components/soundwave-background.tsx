"use client";

import { useEffect, useRef } from "react";
import { useAccent, ACCENT_META } from "@/contexts/accent-context";

// Static SVG feTurbulence noise — rendered by the GPU, zero JS cost.
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23n)'/%3E%3C/svg%3E")`;

const NUM_LINES = 52;
const TARGET_FPS = 22;
const INTERVAL = 1000 / TARGET_FPS;

// "hsl(189,90%,50%)" → "hsla(189,90%,50%,0.05)"
const toHsla = (hsl: string, alpha: number) =>
  hsl.replace("hsl(", "hsla(").replace(")", `,${alpha})`);

export default function SoundwaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { accent } = useAccent();
  const accentColor = ACCENT_META[accent].color;

  // Ref keeps the animation loop in sync with accent changes without restarting it
  const colorRef = useRef(accentColor);
  useEffect(() => {
    colorRef.current = ACCENT_META[accent].color;
  }, [accent]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let lastTime = 0;
    let t = 0;

    const resize = () => {
      // Stay at CSS pixel size (skip DPR — it's a background, slight blur is fine)
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Pre-compute per-line constants so the draw loop is cheap
    const lines = Array.from({ length: NUM_LINES }, (_, i) => {
      const prog = i / (NUM_LINES - 1);
      const fromCenter = Math.abs(prog - 0.5) * 2; // 0 at centre, 1 at edges
      return {
        prog,
        maxAmpRatio: Math.max(0.08, 1 - fromCenter * 0.72),
        alpha: 0.05 + (1 - fromCenter) * 0.13,
        phi: i * 0.44,
        f1: 1.6 + (i % 7) * 0.28,
        f2: 3.2 + (i % 5) * 0.38,
        s1: 0.55 + (i % 4) * 0.17,
        s2: 1.15 - (i % 3) * 0.11,
      };
    });

    const animate = (now: number) => {
      raf = requestAnimationFrame(animate);
      if (now - lastTime < INTERVAL) return;
      lastTime = now;
      t += 0.044;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      for (const l of lines) {
        const y0 = l.prog * h;
        const amp = h * 0.013 * l.maxAmpRatio;

        ctx.beginPath();
        ctx.strokeStyle = toHsla(colorRef.current, l.alpha);
        ctx.lineWidth = 0.75;

        let first = true;
        for (let x = 0; x <= w; x += 4) {
          const nx = x / w;
          const y =
            y0 +
            Math.sin(nx * Math.PI * l.f1 + t * l.s1 + l.phi) * amp * 0.62 +
            Math.sin(nx * Math.PI * l.f2 - t * l.s2 + l.phi * 1.4) * amp * 0.38;
          if (first) {
            ctx.moveTo(x, y);
            first = false;
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
    };

    raf = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      {/* Animated waveform lines */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Centre glow in accent colour — CSS only, transitions smoothly on change */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse 75% 55% at 50% 50%, ${toHsla(accentColor, 0.07)} 0%, transparent 70%)`,
        }}
      />

      {/* Film-grain noise overlay — static SVG feTurbulence, GPU only */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: NOISE_SVG,
          backgroundRepeat: "repeat",
          opacity: 0.045,
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}
