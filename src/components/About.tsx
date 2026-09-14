"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/products";

const CYCLE_MS = 6400;
const GREETING =
  "Hi! I'm your outfit assistant. Tell me what you need and I'll find it from your wardrobe.";
const USER_QUERY = "Show me some black shirts";
const TYPE_DELAY_S = 0.9;
const TYPE_SPEED_S_PER_CHAR = 0.07;

const SECTIONS = [
  {
    label: "Chat",
    heading: "Chat with your stylist.",
    body: "Ask the Mirra chatbot for what you need and it pulls matching pieces straight from your wardrobe — no scrolling required.",
  },
  {
    label: "Wishlist",
    heading: "Save what catches your eye.",
    body: "Heart anything you love while you browse, and come back to your saved picks whenever you’re ready.",
  },
  {
    label: "Explore",
    heading: "Explore every category.",
    body: "Scroll through ethnic wear, western wear, footwear, swimwear, loungewear and winterwear — all pulled from multiple brands into one feed.",
  },
] as const;

function ExploreVisual() {
  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
      <div className="slide-in-left overflow-hidden rounded-2xl border border-ink-200 shadow-lg">
        <Image
          src="/images/explore-search-screen.jpg"
          alt="Searching for 'Vest' in the Mirra app, with suggestions for Vest in Western Wear"
          width={190}
          height={422}
          className="h-auto w-[130px] sm:w-[180px] md:w-[130px] lg:w-[195px] xl:w-[220px]"
        />
      </div>
      <span
        style={{ animationDelay: "0.55s" }}
        className="arrow-fade-in flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-surface opacity-0 sm:h-7 sm:w-7"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <div
        style={{ animationDelay: "0.25s" }}
        className="slide-in-right overflow-hidden rounded-2xl border border-ink-200 shadow-lg"
      >
        <Image
          src="/images/explore-results-screen.jpg"
          alt="Western Wear results for Vest, showing product cards with prices"
          width={190}
          height={422}
          className="h-auto w-[130px] sm:w-[180px] md:w-[130px] lg:w-[195px] xl:w-[220px]"
        />
      </div>
    </div>
  );
}

function HeartBadge({ filled }: { filled?: boolean }) {
  return (
    <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-surface-raised/90 shadow-sm">
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill={filled ? "#c0392b" : "none"}
        stroke={filled ? "#c0392b" : "#8a8378"}
        strokeWidth="2"
        aria-hidden
      >
        <path d="M12 21s-6.7-4.35-9.3-8.1C.9 10.2 1.4 6.6 4.4 4.9c2.3-1.3 5-.6 6.6 1.4l1 1.2 1-1.2c1.6-2 4.3-2.7 6.6-1.4 3 1.7 3.5 5.3 1.7 8-2.6 3.75-9.3 8.1-9.3 8.1z" />
      </svg>
    </span>
  );
}

function ChatVisual({ blackShirts }: { blackShirts: Product[] }) {
  const similar = blackShirts.slice(0, 3);

  const brandNames = Array.from(
    new Set(similar.map((p) => p.brand).filter((b): b is string => Boolean(b)))
  ).slice(0, 3);
  const brandText =
    brandNames.length > 0 ? brandNames.join(", ") : "your favorite brands";

  const prices = similar
    .map((p) => p.price_numeric)
    .filter((n): n is number => typeof n === "number");
  const priceText =
    prices.length > 0
      ? `₹${Math.round(Math.min(...prices)).toLocaleString("en-IN")}–₹${Math.round(
          Math.max(...prices)
        ).toLocaleString("en-IN")}`
      : null;

  const assistantReply = `Found ${blackShirts.length || similar.length} black shirt picks for you${
    priceText ? `, priced ${priceText}` : ""
  }${brandNames.length > 0 ? ` from ${brandText}` : ""}.`;

  const typeDuration = USER_QUERY.length * TYPE_SPEED_S_PER_CHAR;
  const replyDelay = TYPE_DELAY_S + typeDuration + 0.3;
  const shopLabelDelay = replyDelay + 0.7;
  const cardsStartDelay = shopLabelDelay + 0.3;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-ink-200 bg-surface-raised p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-display text-sm text-ink-900">Mirra</span>
        <div className="flex items-center gap-0.5 rounded-full bg-ink-200 p-0.5 text-[10px] font-medium">
          <span className="rounded-full px-2.5 py-1 text-ink-500">
            Wardrobe
          </span>
          <span className="rounded-full bg-[#4d5a45] px-2.5 py-1 text-white">
            Shop
          </span>
        </div>
      </div>

      <div
        style={{ animationDelay: "0.1s" }}
        className="fade-in-up max-w-[85%] rounded-2xl rounded-tl-sm border border-ink-200 px-3.5 py-3 opacity-0"
      >
        <p className="text-[13px] leading-snug text-ink-900">{GREETING}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[10px] text-ink-500">3:33 PM</span>
          <span className="flex gap-2 text-xs text-ink-500" aria-hidden>
            <span>👍</span>
            <span>👎</span>
          </span>
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-[#4d5a45] px-3.5 py-2.5">
          <p
            className="typewriter text-[13px] leading-snug text-white"
            style={
              {
                "--typewriter-width": `${USER_QUERY.length}ch`,
                "--typewriter-delay": `${TYPE_DELAY_S}s`,
                "--typewriter-duration": `${typeDuration}s`,
                "--typewriter-steps": USER_QUERY.length,
              } as CSSProperties
            }
          >
            {USER_QUERY}
          </p>
          <p className="mt-1 text-right text-[10px] text-white/60">3:33 PM</p>
        </div>
      </div>

      <div className="mt-3 flex justify-start">
        <div
          style={{ animationDelay: `${replyDelay}s` }}
          className="fade-in-up max-w-[85%] rounded-2xl rounded-bl-sm border border-ink-200 px-3.5 py-3 opacity-0"
        >
          <p className="text-[13px] leading-snug text-ink-900">
            {assistantReply}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-ink-500">3:34 PM</span>
            <span className="flex gap-2 text-xs text-ink-500" aria-hidden>
              <span>👍</span>
              <span>👎</span>
            </span>
          </div>
        </div>
      </div>

      <div
        style={{ animationDelay: `${shopLabelDelay}s` }}
        className="fade-in-up mt-4 opacity-0"
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-wide text-ink-500">
            ✦ SHOP SIMILAR ITEMS
          </span>
          <span className="text-[10px] text-ink-500">See all ›</span>
        </div>
        <div className="flex gap-2.5">
          {similar.map((p, i) => (
            <div
              key={p.id}
              style={{ animationDelay: `${cardsStartDelay + i * 0.2}s` }}
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
              <p className="mt-1 truncate text-[10px] font-medium text-ink-900">
                {p.name}
              </p>
              <p className="truncate text-[9px] text-ink-500">{p.brand}</p>
              <p className="text-[10px] font-semibold text-ink-900">
                {formatPrice(p)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WishlistVisual({ products }: { products: Product[] }) {
  const items = products.slice(0, 6);
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-ink-200 bg-surface-raised p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-display text-sm text-ink-900">Wishlist</span>
        <span className="text-[11px] text-ink-500">{items.length} items</span>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((p, i) => (
          <div
            key={p.id}
            style={{ animationDelay: `${i * 0.15}s` }}
            className="fade-in-up flex items-center gap-3 rounded-xl border border-ink-200 p-3 opacity-0"
          >
            {p.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.image_url}
                alt=""
                className="h-16 w-16 shrink-0 rounded-lg object-cover"
              />
            ) : null}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-ink-900">
                {p.name}
              </p>
              <p className="truncate text-[10px] text-ink-500">{p.brand}</p>
              <p className="mt-0.5 text-[11px] font-semibold text-ink-900">
                {formatPrice(p)}
              </p>
            </div>
            <span
              style={{ animationDelay: `${0.3 + i * 0.15}s` }}
              className="heart-pop shrink-0 opacity-0"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#c0392b" aria-hidden>
                <path d="M12 21s-6.7-4.35-9.3-8.1C.9 10.2 1.4 6.6 4.4 4.9c2.3-1.3 5-.6 6.6 1.4l1 1.2 1-1.2c1.6-2 4.3-2.7 6.6-1.4 3 1.7 3.5 5.3 1.7 8-2.6 3.75-9.3 8.1-9.3 8.1z" />
              </svg>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function About({
  products,
  blackShirts,
}: {
  products: Product[];
  blackShirts: Product[];
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => {
      setActive((prev) => (prev + 1) % SECTIONS.length);
    }, CYCLE_MS);
    return () => clearTimeout(id);
  }, [active]);

  const current = SECTIONS[active];
  const withImages = products.filter((p) => p.image_url);

  return (
    <section className="py-16">
      <div className="px-6 sm:px-10">
        <p className="text-center text-xs font-bold uppercase tracking-wider text-ink-500">
          Meet Mirra
        </p>
        <h2 className="mt-1 text-center font-display text-3xl text-ink-900 sm:text-4xl">
          Fashion, made for you.
        </h2>

        <div className="mx-auto mt-6 flex w-fit gap-6 border-b border-ink-200">
          {SECTIONS.map((s, i) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setActive(i)}
              className={`pb-3 text-sm transition-colors duration-300 ${
                i === active
                  ? "border-b-2 border-ink-900 font-semibold text-ink-900"
                  : "text-ink-500 hover:text-ink-700"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 items-center gap-10 px-6 sm:px-10 md:grid-cols-2">
        <div
          key={active}
          className="flex min-h-[380px] flex-col justify-center sm:min-h-[460px] md:min-h-[520px]"
        >
          {active === 0 ? <ChatVisual blackShirts={blackShirts} /> : null}
          {active === 1 ? (
            <WishlistVisual products={withImages.slice(3, 9)} />
          ) : null}
          {active === 2 ? <ExploreVisual /> : null}
        </div>

        <div key={`text-${active}`} className="fade-in-up">
          <h3 className="font-display text-3xl leading-tight text-ink-900">
            {current.heading}
          </h3>
          <p className="mt-3 max-w-md text-ink-700">{current.body}</p>
        </div>
      </div>
    </section>
  );
}
