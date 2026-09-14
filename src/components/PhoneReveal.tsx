"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function PhoneReveal({
  children,
  delay = 0,
  spin = true,
}: {
  children: ReactNode;
  delay?: number;
  spin?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const animationClass = spin ? "phone-spin-in" : "phone-rise-in";

  return (
    <div ref={ref} className="[perspective:1400px]">
      <div
        style={visible ? { animationDelay: `${delay}s` } : { opacity: 0 }}
        className={`mx-auto w-fit ${visible ? animationClass : ""}`}
      >
        {children}
      </div>
    </div>
  );
}
