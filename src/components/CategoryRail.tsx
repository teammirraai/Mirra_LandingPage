"use client";

import { useEffect, useRef } from "react";
import { swatchForCategory } from "@/lib/categories";
import type { SubCategoryPreview } from "@/lib/products";

const SPEED_PX_PER_MS = 0.045;
const RESUME_DELAY_MS = 5000;

export default function CategoryRail({
  previews,
}: {
  previews: SubCategoryPreview[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || previews.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let rafId: number;
    let lastTs: number | null = null;

    function step(ts: number) {
      if (lastTs == null) lastTs = ts;
      const dt = ts - lastTs;
      lastTs = ts;

      if (track && !pausedRef.current) {
        const half = track.scrollWidth / 2;
        track.scrollLeft += SPEED_PX_PER_MS * dt;
        if (half > 0 && track.scrollLeft >= half) {
          track.scrollLeft -= half;
        }
      }
      rafId = requestAnimationFrame(step);
    }
    rafId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafId);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [previews.length]);

  function pause() {
    pausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  }

  function scheduleResume() {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, RESUME_DELAY_MS);
  }

  if (previews.length === 0) return null;

  const items = [...previews, ...previews];

  return (
    <section className="py-10">
      <div className="px-6 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-500">
          Categories
        </p>
        <h2 className="mt-1 font-display text-2xl text-ink-900">
          What are you shopping for?
        </h2>
      </div>

      <div
        ref={trackRef}
        onPointerDown={pause}
        onPointerUp={scheduleResume}
        onPointerCancel={scheduleResume}
        onPointerLeave={scheduleResume}
        className="no-scrollbar mt-5 flex cursor-grab gap-4 overflow-x-auto select-none px-6 active:cursor-grabbing sm:px-10"
      >
        {items.map((p, i) => {
          const { swatch, swatchText } = swatchForCategory(p.category);
          return (
            <div key={`${p.sub_category}-${i}`} className="w-44 shrink-0 sm:w-52">
              <div
                className="relative flex aspect-[3/4] w-full items-end overflow-hidden rounded-2xl p-4"
                style={{ backgroundColor: swatch }}
              >
                <span
                  className="absolute top-4 left-4 text-[11px] font-bold uppercase tracking-wide opacity-70"
                  style={{ color: swatchText }}
                >
                  {p.sub_category}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image_url}
                  alt={p.sub_category}
                  draggable={false}
                  className="absolute inset-x-6 top-10 bottom-0 h-[calc(100%-2.5rem)] w-[calc(100%-3rem)] rounded-t-xl object-cover object-top shadow-lg"
                />
                <span
                  className="relative font-display text-lg"
                  style={{ color: swatchText }}
                >
                  
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
