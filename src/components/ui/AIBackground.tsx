// خلفية AI حية تفاعلية
import { useEffect, useRef, useState } from 'react';

// أنواع الخلفية حسب الصفحة
export type BackgroundVariant = 'home' | 'image' | 'video' | 'voice' | 'voiceClone' | 'effects' | 'effect-detail';

interface AIBackgroundProps {
  variant?: BackgroundVariant;
  className?: string;
}

// جسيم (نقطة) في الشبكة العصبية
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

// موجة تفاعلية عند اللمس
interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

export function AIBackground({ variant = 'home', className = '' }: AIBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [isPaused, setIsPaused] = useState(false);

  // إعدادات حسب نوع الصفحة
  const getVariantConfig = (v: BackgroundVariant) => {
    switch (v) {
      case 'home':
        return {
          particleCount: 50,
          connectionDistance: 150,
          particleSpeed: 0.3,
          showWaves: false,
        };
      case 'image':
        return {
          particleCount: 60,
          connectionDistance: 120,
          particleSpeed: 0.2,
          showWaves: false,
        };
      case 'video':
        return {
          particleCount: 70,
          connectionDistance: 180,
          particleSpeed: 0.4,
          showWaves: false,
        };
      case 'voice':
        return {
          particleCount: 45,
          connectionDistance: 140,
          particleSpeed: 0.25,
          showWaves: true,
        };
      case 'voiceClone':
        return {
          particleCount: 55,
          connectionDistance: 100,
          particleSpeed: 0.2,
          showWaves: true,
        };
      case 'effects':
        return {
          particleCount: 65,
          connectionDistance: 160,
          particleSpeed: 0.35,
          showWaves: false,
        };
      case 'effect-detail':
        return {
          particleCount: 55,
          connectionDistance: 130,
          particleSpeed: 0.25,
          showWaves: false,
        };
      default:
        return {
          particleCount: 50,
          connectionDistance: 150,
          particleSpeed: 0.3,
          showWaves: false,
        };
    }
  };

  const config = getVariantConfig(variant);

  // تهيئة الجسيمات
  const initParticles = (width: number, height: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < config.particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * config.particleSpeed,
        vy: (Math.random() - 0.5) * config.particleSpeed,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }
    particlesRef.current = particles;
  };

  // تحديث موضع الجسيمات
  const updateParticles = (width: number, height: number) => {
    particlesRef.current.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // ارتداد من الحواف
      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;

      // تأكد من البقاء داخل الحدود
      particle.x = Math.max(0, Math.min(width, particle.x));
      particle.y = Math.max(0, Math.min(height, particle.y));
    });
  };

  // تحديث الموجات التفاعلية
  const updateRipples = () => {
    ripplesRef.current = ripplesRef.current.filter((ripple) => {
      ripple.radius += 3;
      ripple.opacity -= 0.02;
      return ripple.opacity > 0;
    });
  };

  // رسم التدرج الخلفي
  const drawGradient = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0E0E13');
    gradient.addColorStop(1, '#141421');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  };

  // رسم الخطوط بين الجسيمات القريبة
  const drawConnections = (ctx: CanvasRenderingContext2D) => {
    const particles = particlesRef.current;
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.connectionDistance) {
          const opacity = (1 - distance / config.connectionDistance) * 0.15;
          
          // تدرج لوني بين البنفسجي والسياني
          const gradient = ctx.createLinearGradient(
            particles[i].x,
            particles[i].y,
            particles[j].x,
            particles[j].y
          );
          gradient.addColorStop(0, `rgba(106, 92, 255, ${opacity})`); // #6A5CFF
          gradient.addColorStop(1, `rgba(0, 229, 255, ${opacity})`);  // #00E5FF

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  };

  // رسم الجسيمات
  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    particlesRef.current.forEach((particle) => {
      const gradient = ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.radius * 3
      );
      
      gradient.addColorStop(0, `rgba(106, 92, 255, ${particle.opacity * 0.8})`);
      gradient.addColorStop(0.5, `rgba(0, 229, 255, ${particle.opacity * 0.4})`);
      gradient.addColorStop(1, 'rgba(0, 229, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  // رسم الموجات التفاعلية
  const drawRipples = (ctx: CanvasRenderingContext2D) => {
    ripplesRef.current.forEach((ripple) => {
      const gradient = ctx.createRadialGradient(
        ripple.x,
        ripple.y,
        ripple.radius * 0.8,
        ripple.x,
        ripple.y,
        ripple.radius
      );
      
      gradient.addColorStop(0, `rgba(106, 92, 255, 0)`);
      gradient.addColorStop(0.5, `rgba(106, 92, 255, ${ripple.opacity * 0.3})`);
      gradient.addColorStop(1, `rgba(0, 229, 255, ${ripple.opacity * 0.2})`);

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      ctx.stroke();
    });
  };

  // رسم موجات صوتية (للصفحات الصوتية)
  const drawSoundWaves = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    if (!config.showWaves) return;

    ctx.strokeStyle = 'rgba(0, 229, 255, 0.1)';
    ctx.lineWidth = 1.5;

    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      for (let x = 0; x < width; x += 5) {
        const y = height / 2 + Math.sin((x + time * 50 + i * 100) * 0.01) * (20 + i * 10);
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }
  };

  // حلقة الرسم الرئيسية
  const animate = (time: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isPaused) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;

    // مسح الكانفاس
    ctx.clearRect(0, 0, width, height);

    // رسم الطبقات
    drawGradient(ctx, width, height);
    drawSoundWaves(ctx, width, height, time);
    drawConnections(ctx);
    drawParticles(ctx);
    drawRipples(ctx);

    // تحديث المواضع
    updateParticles(width, height);
    updateRipples();

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // معالجة اللمس/النقر
  const handleInteraction = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let x: number, y: number;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    // إضافة موجة تفاعلية
    ripplesRef.current.push({
      x,
      y,
      radius: 0,
      maxRadius: 150,
      opacity: 1,
    });

    // تفاعل الجسيمات القريبة
    particlesRef.current.forEach((particle) => {
      const dx = particle.x - x;
      const dy = particle.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        particle.vx += dx * 0.01;
        particle.vy += dy * 0.01;
      }
    });
  };

  // تهيئة وتنظيف
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ضبط حجم الكانفاس
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // بدء الرسم
    animationFrameRef.current = requestAnimationFrame(animate);

    // إيقاف الحركة عند فتح الكيبورد (تقريبي)
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // تنظيف
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [variant, isPaused]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 -z-10 ${className}`}
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
      style={{ touchAction: 'none' }}
    />
  );
}
