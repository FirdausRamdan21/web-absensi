"use client";

import { useEffect, useRef, useState } from "react";

type RevealProps = { children: React.ReactNode; className?: string; direction?: "up" | "left" | "right"; delay?: number };

export function Reveal({ children, className = "", direction = "up", delay = 0 }: RevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const offset = direction === "left" ? "-translate-x-4" : direction === "right" ? "translate-x-4" : "translate-y-4";
  return <div ref={elementRef} className={`reveal ${isVisible ? "reveal-visible" : `reveal-pending ${offset}`} ${className}`} style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}>{children}</div>;
}