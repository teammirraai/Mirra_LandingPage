"use client";

import type { BrandProduct } from "@/lib/products";

interface ItemCardProps {
  item: BrandProduct;
  onDelete: () => void;
  isDeleting: boolean;
}

function formatPrice(item: BrandProduct): string {
  if (item.price_numeric !== null && item.currency) {
    return `${item.currency} ${item.price_numeric.toLocaleString()}`;
  }
  if (item.price) return item.price;
  return "—";
}

export function ItemCard({ item, onDelete, isDeleting }: ItemCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
      <div className="flex aspect-square w-full items-center justify-center bg-neutral-100">
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- image_url points at arbitrary external hosts
          <img
            src={item.image_url}
            alt={item.name ?? "Product image"}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-xs text-neutral-400">No image</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="line-clamp-2 text-sm font-medium text-neutral-900" title={item.name ?? undefined}>
          {item.name ?? "Untitled"}
        </p>
        <p className="text-xs text-neutral-500">
          {item.category ?? "—"}
          {item.sub_category ? ` / ${item.sub_category}` : ""}
        </p>
        <p className="mt-1 text-sm font-semibold text-neutral-900">{formatPrice(item)}</p>
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="mt-3 rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDeleting ? "Deleting…" : "Delete"}
        </button>
      </div>
    </div>
  );
}
