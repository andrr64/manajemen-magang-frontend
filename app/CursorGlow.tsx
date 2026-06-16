"use client";

import { useState, useEffect } from "react";

export default function CursorGlow() {
  const [mousePos, setMousePos] = useState({ x: -9999, y: -9999 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition-all duration-200"
      style={{
        background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(6,182,212,0.07), transparent 60%)`,
      }}
    />
  );
}
