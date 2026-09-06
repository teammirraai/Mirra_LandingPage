import {
  getBrandCategories,
  getBrandDisplayName,
  getBrandProducts,
  getBrandSubCategories,
  PAGE_SIZE,
} from "@/lib/products";
import { FilterBar } from "./filter-bar";
import { ItemListClient } from "./item-list-client";
import { Pagination } from "./pagination";
import { LogoutButton } from "./logout-button";
import { ToastProvider } from "./toast";

interface DashboardProps {
  brand: string;
  category: string | null;
  subCategory: string | null;
  page: number;
}

export async function Dashboard({ brand, category, subCategory, page }: DashboardProps) {
  const [displayBrand, categories, subCategories, productsPage] = await Promise.all([
    getBrandDisplayName(brand),
    getBrandCategories(brand),
    getBrandSubCategories(brand, category),
    getBrandProducts({ brand, category, subCategory, page }),
  ]);

  const totalPages = Math.max(1, Math.ceil(productsPage.totalCount / PAGE_SIZE));

  return (
    <ToastProvider>
      <div className="min-h-screen bg-neutral-50">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 bg-white px-6 py-4">
          <div>
            <h1 className="text-lg font-semibold text-neutral-900">{displayBrand}</h1>
            <p className="text-sm text-neutral-500">
              {productsPage.totalCount} item{productsPage.totalCount === 1 ? "" : "s"} in your catalog
            </p>
          </div>
          <LogoutButton />
        </header>

        <main className="mx-auto max-w-6xl px-6 py-6">
          <div className="mb-6">
            <FilterBar
              categories={categories}
              subCategories={subCategories}
              selectedCategory={category}
              selectedSubCategory={subCategory}
            />
          </div>

          <ItemListClient key={`${category ?? "all"}-${subCategory ?? "all"}-${page}`} initialItems={productsPage.items} />

          <Pagination page={page} totalPages={totalPages} category={category} subCategory={subCategory} />
        </main>
      </div>
    </ToastProvider>
  );
}
