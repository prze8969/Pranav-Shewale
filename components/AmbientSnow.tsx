'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  density: number;
  alpha: number;
  vx: number;
  vy: number;
}

export const AmbientSnow: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particleCount = Math.min(Math.floor((width * height) / 14000), 75);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.6 + 0.6,
        density: Math.random() * particleCount,
        alpha: Math.random() * 0.5 + 0.15,
        vx: Math.random() * 0.4 - 0.2,
        vy: Math.random() * 0.6 + 0.3
      });
    }

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle atmospheric vignette
      const gradient = ctx.createRadialGradient(
        width / 2,
        height * 0.4,
        width * 0.1,
        width / 2,
        height / 2,
        width * 0.85
      );
      gradient.addColorStop(0, 'rgba(18, 24, 38, 0.05)');
      gradient.addColorStop(1, 'rgba(6, 8, 12, 0.7)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      angle += 0.005;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.vy;
        p.x += Math.sin(angle + p.density) * 0.35 + p.vx;

        // Reset if off-screen
        if (p.y > height) {
          p.y = -5;
          p.x = Math.random() * width;
        }
        if (p.x > width + 5) p.x = -5;
        if (p.x < -5) p.x = width + 5;

        ctx.beginPath();
        ctx.fillStyle = `rgba(215, 230, 245, ${p.alpha})`;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
};
