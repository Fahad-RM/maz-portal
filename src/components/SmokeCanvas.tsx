"use client";

import { useEffect, useRef } from "react";

/** 
 * Organic smoke / particle canvas that follows the mouse.
 * 3 theme colours: berry-purple, soft-violet, slate-grey.
 * Feels handcrafted — soft blurred circles with turbulence.
 */

// [r, g, b, baseAlpha]
const COLORS: [number, number, number, number][] = [
  [115,  22,  91, 0.11],   // berry purple — deep brand
  [139,  92, 246, 0.10],   // soft violet
  [100, 116, 139, 0.09],   // slate-grey
  [168,  85, 247, 0.08],   // fuchsia tint
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  radius: number;
  targetRadius: number;
  r: number; g: number; b: number; baseA: number;
  angle: number;
  angleSpeed: number;
}

function makeParticle(mx: number, my: number): Particle {
  const spread = 28;
  const life   = 90 + Math.random() * 90;
  const col    = COLORS[Math.floor(Math.random() * COLORS.length)];
  return {
    x:           mx + (Math.random() - 0.5) * spread,
    y:           my + (Math.random() - 0.5) * spread * 0.6,
    vx:          (Math.random() - 0.5) * 0.6,
    vy:          -(0.35 + Math.random() * 0.55),
    life,
    maxLife:     life,
    radius:      4  + Math.random() * 6,
    targetRadius: 28 + Math.random() * 38,
    r: col[0], g: col[1], b: col[2], baseA: col[3],
    angle:       Math.random() * Math.PI * 2,
    angleSpeed:  (Math.random() - 0.5) * 0.03,
  };
}


export default function SmokeCanvas() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const mouse      = useRef({ x: -999, y: -999, active: false });
  const particles  = useRef<Particle[]>([]);
  const frameRef   = useRef<number>(0);
  const lastSpawn  = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize to fill window
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Track mouse
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
    };
    const onLeave = () => { mouse.current.active = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    // Animation loop
    const loop = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn new particles near mouse
      if (mouse.current.active && timestamp - lastSpawn.current > 28) {
        // 2–3 per frame for a lush smoke
        const count = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < count; i++) {
          if (particles.current.length < 220) {
            particles.current.push(makeParticle(mouse.current.x, mouse.current.y));
          }
        }
        lastSpawn.current = timestamp;
      }

      // Occasionally emit idle ambient particles from the center if no mouse
      if (!mouse.current.active && Math.random() < 0.04 && particles.current.length < 60) {
        particles.current.push(makeParticle(canvas.width * 0.5, canvas.height * 0.55));
      }

      ctx.save();
      // Global blur for soft smoke look
      ctx.filter = "blur(14px)";

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.life -= 1;
        if (p.life <= 0) { particles.current.splice(i, 1); continue; }

        // Physics
        p.angle += p.angleSpeed;
        p.x += p.vx + Math.sin(p.angle) * 0.4;
        p.y += p.vy;
        p.vx *= 0.998;
        p.vy *= 0.997;

        // Grow radius as it ages
        const progress    = 1 - p.life / p.maxLife;
        p.radius = p.radius + (p.targetRadius - p.radius) * 0.018;

        // Fade: in first 15%, out last 40%
        let alpha = 1;
        if (progress < 0.15) alpha = progress / 0.15;
        else if (progress > 0.6) alpha = 1 - (progress - 0.6) / 0.4;
        alpha = Math.max(0, Math.min(1, alpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0, p.radius), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${(p.baseA * alpha).toFixed(3)})`;
        ctx.fill();
      }

      ctx.restore();
      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: "multiply" }}
      aria-hidden
    />
  );
}
