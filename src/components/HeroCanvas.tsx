import { useEffect, useRef } from 'react';

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 220);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // ── Gradient Mesh Background ──
    const drawGradientMesh = (time: number) => {
      const grd1 = ctx.createRadialGradient(
        width * 0.15 + Math.sin(time * 0.0003) * 40, height * 0.4,
        0,
        width * 0.15, height * 0.4,
        width * 0.4
      );
      grd1.addColorStop(0, 'rgba(0, 229, 255, 0.06)');
      grd1.addColorStop(1, 'transparent');
      ctx.fillStyle = grd1;
      ctx.fillRect(0, 0, width, height);

      const grd2 = ctx.createRadialGradient(
        width * 0.85 + Math.cos(time * 0.0004) * 30, height * 0.6,
        0,
        width * 0.85, height * 0.6,
        width * 0.35
      );
      grd2.addColorStop(0, 'rgba(240, 38, 208, 0.04)');
      grd2.addColorStop(1, 'transparent');
      ctx.fillStyle = grd2;
      ctx.fillRect(0, 0, width, height);

      const grd3 = ctx.createRadialGradient(
        width * 0.5 + Math.sin(time * 0.0002) * 50, height * 0.2,
        0,
        width * 0.5, height * 0.2,
        width * 0.3
      );
      grd3.addColorStop(0, 'rgba(120, 80, 255, 0.03)');
      grd3.addColorStop(1, 'transparent');
      ctx.fillStyle = grd3;
      ctx.fillRect(0, 0, width, height);
    };

    // ── Particle constellation system ──
    const numParticles = Math.min(Math.floor(width / 16), 80);
    const particles = Array.from({ length: numParticles }, () => {
      const hueChoice = Math.random();
      let color: string;
      let glowColor: string;
      if (hueChoice > 0.6) {
        color = 'rgba(0, 229, 255, ';
        glowColor = '#00e5ff';
      } else if (hueChoice > 0.3) {
        color = 'rgba(240, 38, 208, ';
        glowColor = '#f026d0';
      } else {
        color = 'rgba(140, 100, 255, ';
        glowColor = '#8c64ff';
      }

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 0.6,
        color,
        glowColor,
        alpha: Math.random() * 0.5 + 0.25,
        pulseOffset: Math.random() * Math.PI * 2,
      };
    });

    let mouseX = -1000;
    let mouseY = -1000;
    let mouseMoveTicking = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseMoveTicking) {
        window.requestAnimationFrame(() => {
          if (canvas) {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
          }
          mouseMoveTicking = false;
        });
        mouseMoveTicking = true;
      }
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    canvas.parentElement?.addEventListener('mousemove', handleMouseMove);
    canvas.parentElement?.addEventListener('mouseleave', handleMouseLeave);

    let startTime = performance.now();

    const render = () => {
      const time = performance.now() - startTime;
      ctx.clearRect(0, 0, width, height);

      // Draw ambient gradient mesh
      drawGradientMesh(time);

      // Draw particle connections & particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Move
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Pulsing alpha
        const pulse = Math.sin(time * 0.002 + p1.pulseOffset) * 0.15 + 0.85;
        const currentAlpha = p1.alpha * pulse;

        // Draw particle with glow
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p1.color}${currentAlpha})`;
        ctx.shadowColor = p1.glowColor;
        ctx.shadowBlur = 10;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const lineAlpha = (1 - dist / 120) * 0.2;
            ctx.strokeStyle = `rgba(0, 229, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.shadowBlur = 0;
            ctx.stroke();
          }
        }

        // Connect to mouse cursor with magenta glow
        const mdx = p1.x - mouseX;
        const mdy = p1.y - mouseY;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 160) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouseX, mouseY);
          const mAlpha = (1 - mdist / 160) * 0.5;
          ctx.strokeStyle = `rgba(240, 38, 208, ${mAlpha})`;
          ctx.lineWidth = 1.2;
          ctx.shadowColor = '#f026d0';
          ctx.shadowBlur = 6;
          ctx.stroke();

          // Attract particle slightly towards cursor
          p1.vx += (mouseX - p1.x) * 0.00008;
          p1.vy += (mouseY - p1.y) * 0.00008;
        }
      }

      // Draw mouse cursor glow point
      if (mouseX > 0 && mouseY > 0) {
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(240, 38, 208, 0.6)';
        ctx.shadowColor = '#f026d0';
        ctx.shadowBlur = 20;
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.parentElement?.removeEventListener('mousemove', handleMouseMove);
      canvas.parentElement?.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 opacity-70"
      aria-hidden="true"
    />
  );
}

export default HeroCanvas;
