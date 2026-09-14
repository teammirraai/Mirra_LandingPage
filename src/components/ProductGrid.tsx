import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/products";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-ink-500">
        No products found. Try a different search or category.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => {
        const card = (
          <div className="group">
            <div className="aspect-[3/4] w-full overflow-hidden rounded-xl bg-ink-200">
              {product.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image_url}
                  alt={product.name ?? "Product"}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : null}
            </div>
            <div className="mt-3 space-y-0.5">
              {product.brand ? (
                <p className="truncate text-[11px] font-bold uppercase tracking-wide text-ink-900">
                  {product.brand}
                </p>
              ) : null}
              <p className="truncate text-[13px] text-ink-700">
                {product.name}
              </p>
              <p className="text-[13px] font-semibold text-ink-900">
                {formatPrice(product)}
              </p>
            </div>
          </div>
        );
        return product.product_url ? (
          <a
            key={product.id}
            href={product.product_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {card}
          </a>
        ) : (
          <div key={product.id}>{card}</div>
        );
      })}
    </div>
  );
}
