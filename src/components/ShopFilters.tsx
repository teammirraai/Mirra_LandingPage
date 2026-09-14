"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CATEGORIES } from "@/lib/categories";

export default function ShopFilters({
  activeCategory,
}: {
  activeCategory?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  function updateParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  }

  return (
    <div className="border-b border-ink-200 pb-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateParams({ q: q || null });
        }}
        className="flex items-center gap-2 rounded-full border border-ink-300 bg-surface-raised p-1.5 pl-4"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products…"
          className="min-w-0 flex-1 bg-transparent text-sm text-ink-900 placeholder:text-ink-500 focus:outline-none"
        />
        <button
          type="submit"
          className="h-8 shrink-0 rounded-full bg-ink px-4 text-xs font-medium text-surface"
        >
          Search
        </button>
      </form>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
        <button
          onClick={() => updateParams({ category: null, sub_category: null })}
          className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
            !activeCategory
              ? "border-ink-900 bg-ink text-surface"
              : "border-ink-300 text-ink-700 hover:border-ink-900"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.slug}
            onClick={() =>
              updateParams({ category: c.category, sub_category: null })
            }
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              activeCategory === c.category
                ? "border-ink-900 bg-ink text-surface"
                : "border-ink-300 text-ink-700 hover:border-ink-900"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
