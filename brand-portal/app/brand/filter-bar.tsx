"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface FilterBarProps {
  categories: string[];
  subCategories: string[];
  selectedCategory: string | null;
  selectedSubCategory: string | null;
}

export function FilterBar({
  categories,
  subCategories,
  selectedCategory,
  selectedSubCategory,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    // Any filter change invalidates the current page number.
    params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="flex flex-wrap gap-4">
      <label className="flex flex-col text-sm text-neutral-700">
        Category
        <select
          value={selectedCategory ?? "all"}
          onChange={(event) =>
            updateParams({ category: event.target.value, subCategory: null })
          }
          className="mt-1 rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus:border-neutral-500 focus:outline-none"
        >
          <option value="all">All</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col text-sm text-neutral-700">
        Sub Category
        <select
          value={selectedSubCategory ?? "all"}
          onChange={(event) => updateParams({ subCategory: event.target.value })}
          className="mt-1 rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus:border-neutral-500 focus:outline-none"
        >
          <option value="all">All</option>
          {subCategories.map((subCategory) => (
            <option key={subCategory} value={subCategory}>
              {subCategory}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
