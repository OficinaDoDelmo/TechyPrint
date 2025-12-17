import React, { useEffect, useRef } from 'react';

const Confetti: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particles config
    const particles: any[] = [];
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444'];
    const particleCount = 150;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        w: Math.random() * 8 + 4,
        h: Math.random() * 8 + 4,
        vx: (Math.random() - 0.5) * 35, // Explosion velocity X
        vy: (Math.random() - 0.5) * 35 - 10, // Explosion velocity Y (upwards bias)
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        gravity: 0.6,
        drag: 0.95, // Air resistance
        opacity: 1
      });
    }

    let animationId: number;

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let activeParticles = 0;

      particles.forEach(p => {
        if (p.opacity <= 0.01) return;
        activeParticles++;
        
        // Physics
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;
        
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.008;

        // Draw
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      if (activeParticles > 0) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
        window.removeEventListener('resize', resizeCanvas);
        cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-[120]"
        style={{ width: '100%', height: '100%' }}
    />
  );
};

export default Confetti;