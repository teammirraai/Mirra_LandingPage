"use client";

import { useRef, useState } from "react";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

const COLUMN_COUNT = 4;
const RESUME_DELAY_MS = 5000;
// Alternate direction and duration per column so the columns drift out of
// sync with each other instead of moving as one uniform block.
const COLUMN_CONFIG = [
  { direction: "up", duration: 34 },
  { direction: "down", duration: 42 },
  { direction: "up", duration: 38 },
  { direction: "down", duration: 30 },
] as const;

function splitIntoColumns(products: Product[], columns: number): Product[][] {
  const result: Product[][] = Array.from({ length: columns }, () => []);
  products.forEach((p, i) => result[i % columns].push(p));
  return result.filter((col) => col.length > 0);
}

export default function ProductRail({ products }: { products: Product[] }) {
  const [paused, setPaused] = useState(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function pause() {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    setPaused(true);
  }

  function scheduleResume() {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setPaused(false);
    }, RESUME_DELAY_MS);
  }

  if (products.length === 0) {
    return (
      <p className="px-6 py-8 text-sm text-ink-500 sm:px-10">
        No products to show yet — connect your Supabase database to populate
        this section.
      </p>
    );
  }

  const columns = splitIntoColumns(products, COLUMN_COUNT);

  return (
    <div
      onPointerDown={pause}
      onPointerUp={scheduleResume}
      onPointerCancel={scheduleResume}
      onPointerLeave={scheduleResume}
      className="relative flex h-[460px] justify-center gap-3 overflow-hidden px-6 select-none sm:px-10"
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0, black 64px, black calc(100% - 64px), transparent 100%)",
        maskImage:
          "linear-gradient(to bottom, transparent 0, black 64px, black calc(100% - 64px), transparent 100%)",
      }}
    >
      {columns.map((col, i) => {
        const config = COLUMN_CONFIG[i % COLUMN_CONFIG.length];
        return (
          <div
            key={i}
            className={`w-32 shrink-0 sm:w-36 ${i >= 2 ? "hidden sm:block" : ""}`}
          >
            <div
              className="flex flex-col gap-3"
              style={{
                animationName: config.direction === "up" ? "scroll-up" : "scroll-down",
                animationDuration: `${config.duration}s`,
                animationTimingFunction: "linear",
                animationIterationCount: "infinite",
                animationPlayState: paused ? "paused" : "running",
                willChange: "transform",
              }}
            >
              {[...col, ...col].map((p, j) => (
                <ProductCard key={`${p.id}-${j}`} product={p} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
