import Link from "next/link";

interface PaginationProps {
  page: number;
  totalPages: number;
  category: string | null;
  subCategory: string | null;
}

function buildHref(page: number, category: string | null, subCategory: string | null): string {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (subCategory) params.set("subCategory", subCategory);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/Brand?${query}` : "/Brand";
}

/** Page numbers to render, with "..." gaps for large ranges. */
function getPageWindow(current: number, total: number): (number | "...")[] {
  const delta = 2;
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  const window: (number | "...")[] = [1];
  if (left > 2) window.push("...");
  for (let i = left; i <= right; i++) window.push(i);
  if (right < total - 1) window.push("...");
  if (total > 1) window.push(total);
  return window;
}

export function Pagination({ page, totalPages, category, subCategory }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageWindow = getPageWindow(page, totalPages);

  return (
    <nav className="mt-6 flex flex-wrap items-center justify-center gap-1" aria-label="Pagination">
      {pageWindow.map((entry, index) =>
        entry === "..." ? (
          <span key={`ellipsis-${index}`} className="px-2 text-sm text-neutral-400">
            …
          </span>
        ) : (
          <Link
            key={entry}
            href={buildHref(entry, category, subCategory)}
            aria-current={entry === page ? "page" : undefined}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              entry === page
                ? "bg-neutral-900 text-white"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            {entry}
          </Link>
        ),
      )}
    </nav>
  );
}
