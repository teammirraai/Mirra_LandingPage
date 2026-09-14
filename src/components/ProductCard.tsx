import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="w-32 shrink-0 snap-start sm:w-36">
      <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-surface">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name ?? "Product"}
            loading="lazy"
            className="h-full w-full scale-105 object-cover"
          />
        ) : null}
      </div>
      <div className="mt-2 space-y-0.5">
        {product.brand ? (
          <p className="truncate text-[10px] font-bold uppercase tracking-wide text-ink-900">
            {product.brand}
          </p>
        ) : null}
        <p className="truncate text-[11px] text-ink-700">{product.name}</p>
        <p className="text-[11px] font-semibold text-ink-900">
          {formatPrice(product)}
        </p>
      </div>
    </div>
  );
}
