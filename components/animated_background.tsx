"use client";

import { useState, useEffect } from "react";

export function AnimatedBackground({ children }: { children: React.ReactNode }) {
  const [orbs, setOrbs] = useState<any[]>([]);
  const [shapes, setShapes] = useState<any[]>([]);

  // Generate random values on client only
  useEffect(() => {
    const generateOrbs = [...Array(15)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 4 + Math.random() * 8,
      color: Math.random() > 0.5 ? "#d7b56d" : "#00004D",
      shadowSize: 10 + Math.random() * 20,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 5,
    }));

    const generateShapes = [...Array(10)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: 40 + Math.random() * 60,
      height: 40 + Math.random() * 60,
      borderColor: Math.random() > 0.5 ? "#d7b56d" : "#00004D",
      radius: Math.random() > 0.5 ? "50%" : "8px",
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 5,
    }));

    setOrbs(generateOrbs);
    setShapes(generateShapes);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0f]">

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">

        {/* Background Gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at top, #1a1a2e 0%, #0a0a0f 50%, #000000 100%)",
          }}
        />

        {/* Large Animated Orbs */}
        <div
          className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, #d7b56d 0%, #00004D 40%, transparent 70%)",
            animation: "float-diagonal 25s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-25 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, #00004D 0%, #d7b56d 40%, transparent 70%)",
            animation: "float-diagonal 30s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, #d7b56d 0%, transparent 70%)",
            animation: "pulse-glow 20s ease-in-out infinite",
          }}
        />

        {/* Rotating Rings */}
        <div
          className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-20"
          style={{
            background: "conic-gradient(from 0deg, transparent, #d7b56d, transparent)",
            animation: "rotate-slow 15s linear infinite",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] rounded-full opacity-15"
          style={{
            background:
              "conic-gradient(from 180deg, transparent, #00004D, #d7b56d, transparent)",
            animation: "rotate-slow 20s linear infinite reverse",
            filter: "blur(40px)",
          }}
        />

        {/* Horizontal Mesh Lines */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`mesh-${i}`}
            className="absolute h-px opacity-30"
            style={{
              width: "200%",
              background:
                "linear-gradient(90deg, transparent, #d7b56d, transparent)",
              top: `${15 + i * 15}%`,
              left: "-50%",
              animation: `slide-horizontal ${10 + i * 2}s linear infinite`,
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}

        {/* Vertical Lines */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`vertical-${i}`}
            className="absolute w-px opacity-20"
            style={{
              height: "200%",
              background:
                "linear-gradient(180deg, transparent, #d7b56d, transparent)",
              left: `${15 + i * 15}%`,
              top: "-50%",
              animation: `slide-vertical ${12 + i * 2}s linear infinite`,
              animationDelay: `${i * 1}s`,
            }}
          />
        ))}

        {/* Dynamic Grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(215,181,109,0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(215,181,109,0.4) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            animation: "grid-flow 25s linear infinite",
            maskImage: "radial-gradient(ellipse at center, black 20%, transparent 80%)",
          }}
        />

        {/* Floating Orbs (CLIENT ONLY) */}
        {orbs.map((o, i) => (
          <div
            key={`orb-${i}`}
            className="absolute rounded-full"
            style={{
              left: o.left,
              top: o.top,
              width: o.size,
              height: o.size,
              background: o.color,
              boxShadow: `0 0 ${o.shadowSize}px ${o.color}`,
              animation: `float-orb ${o.duration}s ease-in-out infinite`,
              animationDelay: `${o.delay}s`,
            }}
          />
        ))}

        {/* Geometric Shapes (CLIENT ONLY) */}
        {shapes.map((s, i) => (
          <div
            key={`geo-${i}`}
            className="absolute opacity-10 border"
            style={{
              left: s.left,
              top: s.top,
              width: s.width,
              height: s.height,
              borderColor: s.borderColor,
              borderWidth: "2px",
              borderRadius: s.radius,
              animation: `spin-float ${s.duration}s linear infinite`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}

        {/* Wave */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[300px] opacity-20"
          style={{
            background: "linear-gradient(180deg, transparent 0%, #d7b56d 100%)",
            animation: "wave 8s ease-in-out infinite",
            filter: "blur(60px)",
          }}
        />

        {/* Spotlight */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(215,181,109,0.1) 0%, transparent 50%)",
            animation: "spotlight 10s ease-in-out infinite",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">{children}</div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes float-diagonal {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(100px, -100px) scale(1.1); }
          66% { transform: translate(-50px, 100px) scale(0.9); }
        }

        @keyframes pulse-glow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
          50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.3; }
        }

        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes slide-horizontal {
          0% { transform: translateX(0); }
          100% { transform: translateX(50%); }
        }

        @keyframes slide-vertical {
          0% { transform: translateY(0); }
          100% { transform: translateY(50%); }
        }

        @keyframes grid-flow {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }

        @keyframes float-orb {
          0%, 100% { transform: translate(0, 0); opacity: 0.3; }
          25% { transform: translate(30px, -30px); opacity: 0.6; }
          50% { transform: translate(-20px, 40px); opacity: 0.8; }
          75% { transform: translate(40px, 20px); opacity: 0.5; }
        }

        @keyframes spin-float {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translate(100px, -100vh) rotate(720deg); opacity: 0; }
        }

        @keyframes wave {
          0%, 100% { transform: translateY(0) scaleX(1); }
          50% { transform: translateY(-20px) scaleX(1.1); }
        }

        @keyframes spotlight {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.2); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}
