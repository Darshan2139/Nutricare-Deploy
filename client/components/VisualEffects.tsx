import { useEffect, useState } from "react";

export function FloatingElements() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating Shapes */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-rose-200/30 to-rose-300/30 rounded-full animate-pulse"></div>
      <div className="absolute top-1/4 right-20 w-16 h-16 bg-gradient-to-br from-lavender-200/30 to-lavender-300/30 rounded-full animate-bounce delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-gradient-to-br from-peach-200/30 to-peach-300/30 rounded-full animate-pulse delay-500"></div>
      <div className="absolute top-1/2 right-1/3 w-12 h-12 bg-gradient-to-br from-sage-200/30 to-sage-300/30 rounded-full animate-bounce delay-300"></div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-rose-500/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-lavender-500/5 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Mouse Follower */}
      <div
        className="absolute w-6 h-6 bg-gradient-to-br from-rose-400/20 to-lavender-400/20 rounded-full blur-sm transition-all duration-1000 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
        }}
      ></div>
    </div>
  );
}

export function ParticleBackground() {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bg-rose-300/10 rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        ></div>
      ))}
    </div>
  );
}

export function GlowingCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative group ${className}`}
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.3)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-lavender-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function AnimatedCounter({
  end,
  duration = 2000,
  suffix = "",
}: {
  end: number;
  duration?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return (
    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-lavender-600">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function PulsatingDot({ size = "w-2 h-2", color = "bg-rose-500" }) {
  return (
    <div className="relative">
      <div className={`${size} ${color} rounded-full`}></div>
      <div
        className={`absolute inset-0 ${size} ${color} rounded-full animate-ping`}
      ></div>
    </div>
  );
}
