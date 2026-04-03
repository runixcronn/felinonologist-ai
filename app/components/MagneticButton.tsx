"use client";

import { useRef, useState, ReactNode } from "react";
import gsap from "gsap";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function MagneticButton({
  children,
  className = "",
  onClick,
  type = "button",
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(buttonRef.current, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!buttonRef.current) return;

    setIsHovered(false);
    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)",
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className={`
        relative px-8 py-4 rounded-full bg-brand text-white font-semibold
        transition-shadow duration-300
        ${isHovered ? "glow-box-intense" : "glow-box"}
        ${className}
      `}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {/* Hover glow overlay */}
      <div
        className={`
          absolute inset-0 rounded-full bg-brand-light
          transition-opacity duration-300
          ${isHovered ? "opacity-100" : "opacity-0"}
        `}
        style={{ filter: "blur(20px)", transform: "scale(1.2)" }}
      />
    </button>
  );
}
