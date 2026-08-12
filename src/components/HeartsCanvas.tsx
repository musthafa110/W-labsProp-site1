import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

export interface HeartsCanvasRef {
  burstHearts: (x?: number, y?: number) => void;
  burstConfetti: (x?: number, y?: number) => void;
  triggerGlow: () => void;
  rainHearts: () => void;
}

interface HeartParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  wiggleSpeed: number;
  wiggleRange: number;
  wiggleOffset: number;
  isRain?: boolean;
}

interface ConfettiParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  shape: "circle" | "rect" | "triangle";
  gravity: number;
  friction: number;
}

interface SparkleParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX?: number;
  opacity: number;
  fadeSpeed: number;
  color: string;
  isBackground?: boolean;
  shape?: "circle" | "star";
}

export const HeartsCanvas = forwardRef<HeartsCanvasRef, {}>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hearts = useRef<HeartParticle[]>([]);
  const confetti = useRef<ConfettiParticle[]>([]);
  const sparkles = useRef<SparkleParticle[]>([]);
  
  // Custom blush and romantic colors
  const colors = [
    "#FFB7C5", // Sakura pink
    "#FFC0CB", // Blush pink
    "#FFD1D7", // Pale pink
    "#FFE3E7", // Light pastel pink
    "#FFF0F2", // Creamy pink
    "#FBC5C5", // Deep soft pink
    "#FCE2DB", // Soft peach cream
    "#FFF9F2", // Warm vanilla cream
  ];

  const confettiColors = [
    "#FFB7C5", "#FFC0CB", "#FFD1D7", "#FCE2DB", "#FFF9F2",
    "#FFD700", // Soft Gold
    "#FFE4E1", // Misty Rose
    "#FFF0F5", // Lavender Blush
  ];

  useImperativeHandle(ref, () => ({
    burstHearts(x, y) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const startX = x !== undefined ? x : canvas.width / 2;
      const startY = y !== undefined ? y : canvas.height / 2;

      // Spawn heart burst
      const count = 40;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 8;
        const size = 6 + Math.random() * 12;
        
        hearts.current.push({
          x: startX,
          y: startY,
          size,
          speedX: Math.cos(angle) * velocity,
          speedY: Math.sin(angle) * velocity - 1, // slight upward bias
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.1,
          opacity: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          wiggleSpeed: 0.05 + Math.random() * 0.05,
          wiggleRange: 0.5 + Math.random() * 1.5,
          wiggleOffset: Math.random() * 100,
        });
      }
    },

    burstConfetti(x, y) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const startX = x !== undefined ? x : canvas.width / 2;
      const startY = y !== undefined ? y : canvas.height / 3; // slightly higher default for confetti drop

      const count = 80;
      const shapes: Array<"circle" | "rect" | "triangle"> = ["circle", "rect", "triangle"];
      
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = 4 + Math.random() * 10;
        
        confetti.current.push({
          x: startX,
          y: startY,
          size: 6 + Math.random() * 8,
          speedX: Math.cos(angle) * velocity,
          speedY: Math.sin(angle) * velocity - 3, // strong upward launch
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.2,
          opacity: 1,
          color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          gravity: 0.15 + Math.random() * 0.15,
          friction: 0.96 + Math.random() * 0.02,
        });
      }
    },

    triggerGlow() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Spawn extra ambient sparkles as a reaction
      for (let i = 0; i < 50; i++) {
        sparkles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 2 + Math.random() * 4,
          speedY: -(0.2 + Math.random() * 0.8),
          opacity: 0.8 + Math.random() * 0.2,
          fadeSpeed: 0.005 + Math.random() * 0.01,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    },

    rainHearts() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Spawn cascading heart rain falling from the top across the screen
      const count = 80;
      for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width;
        const y = -20 - Math.random() * (canvas.height * 0.6); // staggered start heights above or near top
        const size = 10 + Math.random() * 18;
        const speedY = 1.8 + Math.random() * 3.5; // gentle falling rain speed
        const speedX = (Math.random() - 0.5) * 1.5; // subtle lateral drift

        hearts.current.push({
          x,
          y,
          size,
          speedX,
          speedY,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.05,
          opacity: 0.8 + Math.random() * 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          wiggleSpeed: 0.02 + Math.random() * 0.04,
          wiggleRange: 1.0 + Math.random() * 2.0,
          wiggleOffset: Math.random() * 100,
          isRain: true,
        });
      }
    }
  }));

  // Setup drawing helper
  const drawHeart = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    opacity: number,
    rotation: number,
    color: string
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.beginPath();
    // Beautiful Bezier heart path
    ctx.moveTo(0, -size / 4);
    ctx.bezierCurveTo(-size / 2, -size * 0.7, -size, -size * 0.3, -size, size / 5);
    ctx.bezierCurveTo(-size, size * 0.6, -size / 3, size * 0.8, 0, size);
    ctx.bezierCurveTo(size / 3, size * 0.8, size, size * 0.6, size, size / 5);
    ctx.bezierCurveTo(size, -size * 0.3, size / 2, -size * 0.7, 0, -size / 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  const drawConfettiItem = (ctx: CanvasRenderingContext2D, p: ConfettiParticle) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    
    if (p.shape === "circle") {
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
    } else if (p.shape === "triangle") {
      ctx.moveTo(0, -p.size / 2);
      ctx.lineTo(-p.size / 2, p.size / 2);
      ctx.lineTo(p.size / 2, p.size / 2);
      ctx.closePath();
    } else {
      ctx.rect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    }
    
    ctx.fill();
    ctx.restore();
  };

  const drawSparkleStar = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    opacity: number,
    color: string
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, -size * 1.5);
    ctx.quadraticCurveTo(0, 0, size * 1.5, 0);
    ctx.quadraticCurveTo(0, 0, 0, size * 1.5);
    ctx.quadraticCurveTo(0, 0, -size * 1.5, 0);
    ctx.quadraticCurveTo(0, 0, 0, -size * 1.5);
    ctx.closePath();
    ctx.fill();
    
    // High-performance soft glow halo
    ctx.globalAlpha = opacity * 0.25;
    ctx.beginPath();
    ctx.arc(0, 0, size * 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Initialize gentle background sparkles & ambient hearts
    const ambientCount = 12;
    for (let i = 0; i < ambientCount; i++) {
      hearts.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height + canvas.height, // spawn below or staggered
        size: 8 + Math.random() * 12,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: -(0.5 + Math.random() * 1.0),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        opacity: 0.15 + Math.random() * 0.25,
        color: colors[Math.floor(Math.random() * colors.length)],
        wiggleSpeed: 0.01 + Math.random() * 0.02,
        wiggleRange: 0.5 + Math.random() * 1.0,
        wiggleOffset: Math.random() * 100,
      });
    }

    for (let i = 0; i < 40; i++) {
      sparkles.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 1 + Math.random() * 2.5,
        speedY: -(0.1 + Math.random() * 0.3),
        opacity: 0.2 + Math.random() * 0.6,
        fadeSpeed: 0.002 + Math.random() * 0.003,
        color: colors[Math.floor(Math.random() * colors.length)],
        isBackground: true,
      });
    }

    const spawnStarTrail = (x: number, y: number) => {
      for (let i = 0; i < 2; i++) {
        sparkles.current.push({
          x: x + (Math.random() - 0.5) * 16,
          y: y + (Math.random() - 0.5) * 16,
          size: 1.2 + Math.random() * 2.2,
          speedY: -(0.15 + Math.random() * 0.45),
          speedX: (Math.random() - 0.5) * 0.4,
          opacity: 1,
          fadeSpeed: 0.015 + Math.random() * 0.015,
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: "star"
        });
      }
    };

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      spawnStarTrail(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: globalThis.TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        spawnStarTrail(touch.clientX, touch.clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    let animationId: number;

    const updateAndRender = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Update and Draw Ambient & Interactive Sparkles
      sparkles.current = sparkles.current.filter((s) => {
        s.y += s.speedY;
        if (s.speedX !== undefined) {
          s.x += s.speedX;
        }
        s.opacity -= s.fadeSpeed;

        if (s.opacity > 0) {
          if (s.shape === "star") {
            drawSparkleStar(ctx, s.x, s.y, s.size, s.opacity, s.color);
          } else {
            ctx.save();
            ctx.globalAlpha = s.opacity;
            ctx.fillStyle = s.color;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();
            
            // High-performance soft glow halo
            ctx.globalAlpha = s.opacity * 0.25;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size * 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }

        // Recycle background, remove temporary mouse sparkles
        if (s.opacity <= 0 || s.y < -20) {
          if (s.isBackground) {
            s.x = Math.random() * canvas.width;
            s.y = canvas.height + 10;
            s.size = 1 + Math.random() * 2.5;
            s.speedY = -(0.1 + Math.random() * 0.3);
            s.opacity = 0.3 + Math.random() * 0.5;
            s.fadeSpeed = 0.001 + Math.random() * 0.003;
            return true;
          }
          return false;
        }
        return true;
      });

      // 2. Update and Draw Hearts
      hearts.current = hearts.current.filter((h) => {
        // Move
        h.x += h.speedX + Math.sin(Date.now() * h.wiggleSpeed + h.wiggleOffset) * h.wiggleRange * 0.2;
        h.y += h.speedY;
        h.rotation += h.rotationSpeed;

        // Drag if exploded
        if (Math.abs(h.speedX) > 0.1) h.speedX *= 0.95;
        if (h.speedY < -1.5 && Math.abs(h.speedX) > 0.1) h.speedY *= 0.97;

        // Render
        drawHeart(ctx, h.x, h.y, h.size, h.opacity, h.rotation, h.color);

        // Keep or recycle/remove
        if (h.isRain) {
          if (h.y > canvas.height + 40) {
            return false;
          }
          return true;
        }

        if (h.y < -30) {
          // If it's part of the continuous background stream, recycle it at the bottom
          if (hearts.current.length <= ambientCount + 5) {
            h.y = canvas.height + 30;
            h.x = Math.random() * canvas.width;
            h.speedY = -(0.5 + Math.random() * 1.0);
            h.speedX = (Math.random() - 0.5) * 0.5;
            h.opacity = 0.15 + Math.random() * 0.25;
            return true;
          }
          return false; // delete burst particles
        }
        return true;
      });

      // 3. Update and Draw Confetti
      confetti.current = confetti.current.filter((p) => {
        // Apply friction and gravity
        p.speedX *= p.friction;
        p.speedY = p.speedY * p.friction + p.gravity;
        
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        
        // Softly fade when landing or going offscreen
        if (p.y > canvas.height - 20) {
          p.opacity -= 0.01;
        }

        drawConfettiItem(ctx, p);

        // Filter out completely faded particles
        return p.opacity > 0 && p.y < canvas.height + 10 && p.x > -10 && p.x < canvas.width + 10;
      });

      // Spawn extra subtle floating background heart if count drops below ambient threshold
      if (hearts.current.filter(h => Math.abs(h.speedX) < 0.6).length < ambientCount) {
        hearts.current.push({
          x: Math.random() * canvas.width,
          y: canvas.height + 30,
          size: 6 + Math.random() * 10,
          speedX: (Math.random() - 0.5) * 0.4,
          speedY: -(0.4 + Math.random() * 0.8),
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          opacity: 0.1 + Math.random() * 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          wiggleSpeed: 0.01 + Math.random() * 0.02,
          wiggleRange: 0.5 + Math.random() * 1.0,
          wiggleOffset: Math.random() * 100,
        });
      }

      animationId = requestAnimationFrame(updateAndRender);
    };

    updateAndRender();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      id="hearts-interaction-canvas"
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
});

HeartsCanvas.displayName = "HeartsCanvas";
