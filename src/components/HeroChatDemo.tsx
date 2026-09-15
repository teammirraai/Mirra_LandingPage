"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/products";

const LOOP_MS = 11000;
const GREETING =
  "Hi! I'm your personal shopping assistant. Tell me what you're looking for and I'll find it for you!";
const QUERY = "Find me some cute crop tops";
const TYPE_DELAY_S = 0.6;
const TYPE_SPEED_S_PER_CHAR = 0.055;
const STEP_DURATION_S = 0.75;

const LOADING_STEPS = [
  "Understanding what you're looking for...",
  "Searching the right styles...",
  "Matching them to your preferences...",
  "Almost ready...",
];

function HeartBadge() {
  return (
    <span className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-surface-raised/90 shadow-sm">
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#8a8378"
        strokeWidth="2"
        aria-hidden
      >
        <path d="M12 21s-6.7-4.35-9.3-8.1C.9 10.2 1.4 6.6 4.4 4.9c2.3-1.3 5-.6 6.6 1.4l1 1.2 1-1.2c1.6-2 4.3-2.7 6.6-1.4 3 1.7 3.5 5.3 1.7 8-2.6 3.75-9.3 8.1-9.3 8.1z" />
      </svg>
    </span>
  );
}

export default function HeroChatDemo({ products }: { products: Product[] }) {
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => setCycle((c) => c + 1), LOOP_MS);
    return () => clearTimeout(id);
  }, [cycle]);

  const items = products.slice(0, 3);
  const brandNames = Array.from(
    new Set(items.map((p) => p.brand).filter((b): b is string => Boolean(b)))
  ).slice(0, 3);
  const brandText =
    brandNames.length > 0 ? brandNames.join(", ") : "top brands";
  const replyText = `Here are ${
    items.length || 3
  } cute, minimalist picks just for you — I think you'll love these! They come from ${brandText}.`;

  const typeDuration = QUERY.length * TYPE_SPEED_S_PER_CHAR;
  const sendDelay = TYPE_DELAY_S + typeDuration + 0.4;
  const loadingDelay = sendDelay + 0.3;
  const loadingDuration = LOADING_STEPS.length * STEP_DURATION_S;
  const replyDelay = loadingDelay + loadingDuration + 0.2;
  const shopLabelDelay = replyDelay + 0.6;
  const cardsStartDelay = shopLabelDelay + 0.3;

  return (
    <div
      key={cycle}
      className="mx-auto mt-8 w-full max-w-2xl overflow-hidden rounded-2xl border border-ink-200 bg-surface-raised p-5 text-left shadow-[0_8px_30px_rgba(23,19,15,0.12)] sm:p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="font-display text-base text-ink-900">Mirra</span>
        <div className="flex items-center gap-0.5 rounded-full bg-ink-200 p-0.5 text-[11px] font-medium">
          <span className="rounded-full px-3 py-1 text-ink-500">
            Wardrobe
          </span>
          <span className="rounded-full bg-[#4d5a45] px-3 py-1 text-white">
            Shop
          </span>
        </div>
      </div>

      <div
        style={{ animationDelay: "0.1s" }}
        className="fade-in-up max-w-[85%] rounded-2xl rounded-tl-sm border border-ink-200 px-4 py-3 opacity-0"
      >
        <p className="text-sm leading-snug text-ink-900">{GREETING}</p>
      </div>

      <div className="mt-3 flex justify-end">
        <div
          style={{ animationDelay: `${sendDelay}s` }}
          className="pop-in max-w-[80%] rounded-2xl rounded-br-sm bg-[#4d5a45] px-4 py-3 opacity-0"
        >
          <p className="text-sm leading-snug text-white">{QUERY}</p>
        </div>
      </div>

      <div
        style={
          {
            "--expand-delay": `${loadingDelay - 0.1}s`,
            "--collapse-delay": `${loadingDelay + loadingDuration}s`,
          } as CSSProperties
        }
        className="loading-collapse mt-3 max-w-[85%]"
      >
        <div className="grid">
          {LOADING_STEPS.map((step, i) => (
            <div
              key={step}
              style={
                {
                  gridArea: "1 / 1",
                  "--step-delay": `${loadingDelay + i * STEP_DURATION_S}s`,
                  "--step-duration": `${STEP_DURATION_S}s`,
                } as CSSProperties
              }
              className="step-fade rounded-2xl rounded-tl-sm border border-ink-200 px-4 py-3 opacity-0"
            >
              <p className="truncate text-sm text-ink-500">{step}</p>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-ink-200">
                <div
                  style={
                    {
                      "--bar-delay": `${loadingDelay + i * STEP_DURATION_S}s`,
                      "--bar-duration": `${STEP_DURATION_S}s`,
                    } as CSSProperties
                  }
                  className="bar-fill h-full rounded-full bg-[#4d5a45]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex justify-start">
        <div
          style={{ animationDelay: `${replyDelay}s` }}
          className="fade-in-up max-w-[85%] rounded-2xl rounded-bl-sm border border-ink-200 px-4 py-3 opacity-0"
        >
          <p className="text-sm leading-snug text-ink-900">{replyText}</p>
        </div>
      </div>

      <div
        style={{ animationDelay: `${shopLabelDelay}s` }}
        className="fade-in-up mt-4 opacity-0"
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-bold tracking-wide text-ink-500">
            ✦ SHOP SIMILAR ITEMS
          </span>
          <span className="text-xs text-ink-500">See all ›</span>
        </div>
        <div className="flex gap-3">
          {items.map((p, i) => (
            <div
              key={p.id}
              style={{ animationDelay: `${cardsStartDelay + i * 0.15}s` }}
              className="pop-in min-w-0 flex-1 opacity-0"
            >
              <div className="relative">
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image_url}
                    alt=""
                    className="aspect-[3/4] w-full rounded-lg object-cover"
                  />
                ) : null}
                <HeartBadge />
              </div>
              <p className="mt-1.5 truncate text-[11px] font-bold uppercase tracking-wide text-ink-900">
                {p.brand}
              </p>
              <p className="truncate text-xs text-ink-700">{p.name}</p>
              <p className="text-xs font-semibold text-ink-900">
                {formatPrice(p)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 overflow-hidden rounded-full border border-ink-200 bg-surface px-4 py-2">
        <div className="grid min-w-0 flex-1 overflow-hidden text-sm">
          <span
            style={{ "--fade-delay": `${TYPE_DELAY_S}s` } as CSSProperties}
            className="placeholder-fade truncate text-ink-500"
          >
            Ask what you want
          </span>
          <span
            style={
              {
                "--typewriter-width": `${QUERY.length}ch`,
                "--typewriter-delay": `${TYPE_DELAY_S}s`,
                "--typewriter-duration": `${typeDuration}s`,
                "--typewriter-steps": QUERY.length,
                "--clear-delay": `${sendDelay}s`,
              } as CSSProperties
            }
            className="typewriter-input text-ink-900"
          >
            {QUERY}
          </span>
        </div>

        <span
          style={{ "--activate-delay": `${TYPE_DELAY_S}s` } as CSSProperties}
          className="send-activate flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-200 text-ink-500"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M3 11.5 21 3l-7 18-3.5-7.5L3 11.5Z" />
          </svg>
        </span>
      </div>
    </div>
  );
}
