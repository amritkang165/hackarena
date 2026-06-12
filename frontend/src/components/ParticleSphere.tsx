"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#f4b8d0", "#c8b6f0", "#a8d8f0", "#d4c4f8", "#b8e0f8"];
const PARTICLE_COUNT = 200;
const RADIUS = 50;

export default function ParticleSphere({ scrollY }: { scrollY: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<{ theta: number; phi: number; r: number; color: string }[]>([]);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = RADIUS * (0.94 + Math.random() * 0.06);
      particles.push({ theta, phi, r, color: COLORS[Math.floor(Math.random() * COLORS.length)] });
    }
    particlesRef.current = particles;

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    function draw() {
      frame++;
      const w = canvas!.width;
      const h = canvas!.height;
      ctx!.clearRect(0, 0, w, h);

      const baseRotX = -10 + scrollY * 0.06;
      const baseRotY = 20 + scrollY * 0.10;
      const mouseX = (mouseRef.current.x - 0.5) * 20;
      const mouseY = (mouseRef.current.y - 0.5) * 15;
      const rotX = baseRotX + mouseY;
      const rotY = baseRotY + mouseX;

      const cx = w / 2;
      const cy = h / 2;

      const cosRX = Math.cos((rotX * Math.PI) / 180);
      const sinRX = Math.sin((rotX * Math.PI) / 180);
      const cosRY = Math.cos((rotY * Math.PI) / 180);
      const sinRY = Math.sin((rotY * Math.PI) / 180);

      const projected = particlesRef.current.map((p) => {
        const theta = p.theta + frame * 0.002;
        const phi = p.phi + frame * 0.001;
        const x = p.r * Math.sin(phi) * Math.cos(theta);
        const y = p.r * Math.cos(phi);
        const z = p.r * Math.sin(phi) * Math.sin(theta);

        const ry = y * cosRX - z * sinRX;
        const rz = y * sinRX + z * cosRX;
        const rx = x * cosRY + rz * sinRY;
        const rz2 = -x * sinRY + rz * cosRY;

        return { x: rx, y: ry, z: rz2, color: p.color };
      });

      projected.sort((a, b) => a.z - b.z);

      // Soft glow behind sphere
      const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, RADIUS * 0.6);
      grad.addColorStop(0, "rgba(200, 182, 240, 0.04)");
      grad.addColorStop(1, "rgba(200, 182, 240, 0)");
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, w, h);

      for (const p of projected) {
        const px = cx + p.x;
        const py = cy + p.y;
        const scale = (p.z + RADIUS) / (RADIUS * 2);
        const size = 0.8 + scale * 1.8;
        const alpha = 0.2 + scale * 0.6;

        // Glow
        ctx!.beginPath();
        ctx!.arc(px, py, size * 3, 0, Math.PI * 2);
        ctx!.fillStyle = p.color;
        ctx!.globalAlpha = alpha * 0.2;
        ctx!.fill();

        // Core
        ctx!.beginPath();
        ctx!.arc(px, py, size, 0, Math.PI * 2);
        ctx!.fillStyle = p.color;
        ctx!.globalAlpha = alpha;
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [scrollY]);

  return (
    <div
      style={{
        width: "160px",
        height: "180px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        width={160}
        height={180}
        style={{ width: "160px", height: "180px", display: "block" }}
      />
    </div>
  );
}
