import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShopFilters from "@/components/ShopFilters";
import ProductGrid from "@/components/ProductGrid";
import { searchProducts } from "@/lib/products";

const PAGE_SIZE = 24;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const page = Number(params.page) > 0 ? Number(params.page) : 1;

  const { products, count } = await searchProducts({
    q: params.q,
    category: params.category,
    sub_category: params.sub_category,
    page,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  function pageHref(p: number) {
    const usp = new URLSearchParams();
    if (params.q) usp.set("q", params.q);
    if (params.category) usp.set("category", params.category);
    if (params.sub_category) usp.set("sub_category", params.sub_category);
    usp.set("page", String(p));
    return `/shop?${usp.toString()}`;
  }

  return (
    <>
      <Header />
      <main className="flex-1 px-6 py-8 sm:px-10">
        <div className="mb-6">
          {params.q ? (
            <h1 className="font-display text-2xl text-ink-900">
              Results for &ldquo;{params.q}&rdquo;
            </h1>
          ) : params.category ? (
            <h1 className="font-display text-2xl text-ink-900">
              {params.category}
            </h1>
          ) : (
            <h1 className="font-display text-2xl text-ink-900">Shop all</h1>
          )}
          <p className="mt-1 text-sm text-ink-500">
            {count.toLocaleString()} product{count === 1 ? "" : "s"}
          </p>
        </div>

        <ShopFilters activeCategory={params.category} />

        <div className="mt-8">
          <ProductGrid products={products} />
        </div>

        {totalPages > 1 ? (
          <div className="mt-10 flex items-center justify-center gap-2">
            {page > 1 ? (
              <Link
                href={pageHref(page - 1)}
                className="rounded-full border border-ink-300 px-4 py-2 text-sm text-ink-700 hover:border-ink-900"
              >
                Previous
              </Link>
            ) : null}
            <span className="px-3 text-sm text-ink-500">
              Page {page} of {totalPages}
            </span>
            {page < totalPages ? (
              <Link
                href={pageHref(page + 1)}
                className="rounded-full border border-ink-300 px-4 py-2 text-sm text-ink-700 hover:border-ink-900"
              >
                Next
              </Link>
            ) : null}
          </div>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
