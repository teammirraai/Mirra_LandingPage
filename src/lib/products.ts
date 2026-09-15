import { supabase, isSupabaseConfigured } from "./supabase/client";
import { SUB_CATEGORIES } from "./subcategories";
import type { Product } from "./types";

const PRODUCT_COLUMNS =
  "id, name, brand, price, currency, image_url, product_url, category, sub_category, matched_query_count, sample_search_query, price_numeric";

export async function getFeaturedProducts(limit = 12): Promise<Product[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("unique_products")
    .select(PRODUCT_COLUMNS)
    .not("image_url", "is", null)
    .order("matched_query_count", { ascending: false, nullsFirst: false })
    .limit(limit);
  if (error) {
    console.error("getFeaturedProducts", error.message);
    return [];
  }
  return data ?? [];
}

export interface SubCategoryPreview {
  sub_category: string;
  category: string | null;
  image_url: string;
}

export async function getSubCategoryPreviews(): Promise<SubCategoryPreview[]> {
  if (!supabase) return [];

  const results = await Promise.all(
    SUB_CATEGORIES.map(async (sub_category) => {
      const { data, error } = await supabase!
        .from("unique_products")
        .select("category, image_url")
        .eq("sub_category", sub_category)
        .not("image_url", "is", null)
        .order("matched_query_count", { ascending: false, nullsFirst: false })
        .limit(1);
      if (error) {
        console.error("getSubCategoryPreviews", sub_category, error.message);
        return null;
      }
      const row = data?.[0];
      if (!row?.image_url) return null;
      return {
        sub_category,
        category: row.category,
        image_url: row.image_url,
      } satisfies SubCategoryPreview;
    })
  );

  return results.filter((r): r is SubCategoryPreview => r !== null);
}

export async function getBlackShirts(limit = 6): Promise<Product[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("unique_products")
    .select(PRODUCT_COLUMNS)
    .eq("sub_category", "Shirt / Shacket")
    .ilike("name", "%black%")
    .not("image_url", "is", null)
    .order("matched_query_count", { ascending: false, nullsFirst: false })
    .limit(limit);
  if (error) {
    console.error("getBlackShirts", error.message);
    return [];
  }
  return data ?? [];
}

export async function getCropTops(limit = 3): Promise<Product[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("unique_products")
    .select(PRODUCT_COLUMNS)
    .eq("sub_category", "Crop Top")
    .not("image_url", "is", null)
    .order("matched_query_count", { ascending: false, nullsFirst: false })
    .limit(limit);
  if (error) {
    console.error("getCropTops", error.message);
    return [];
  }
  return data ?? [];
}

// unique_products rows are clustered by brand in id order, so a single
// limit()'d select only ever sees a couple of brands. Sample evenly spaced
// windows across the whole id range instead, so a small number of rows
// fetched still turns up a wide spread of distinct brands.
export async function getBrands(limit = 24): Promise<string[]> {
  if (!supabase) return [];

  const { count } = await supabase
    .from("unique_products")
    .select("*", { count: "exact", head: true })
    .not("brand", "is", null);
  const total = count ?? 0;
  if (total === 0) return [];

  const chunks = 20;
  const windowSize = 50;
  const step = Math.max(1, Math.floor(total / chunks));

  const results = await Promise.all(
    Array.from({ length: chunks }, (_, i) => {
      const from = i * step;
      return supabase!
        .from("unique_products")
        .select("brand")
        .not("brand", "is", null)
        .range(from, from + windowSize - 1);
    })
  );

  const seen = new Set<string>();
  for (const { data, error } of results) {
    if (error) {
      console.error("getBrands", error.message);
      continue;
    }
    for (const row of data ?? []) {
      const b = row.brand?.trim();
      if (b) seen.add(b);
    }
  }
  return Array.from(seen).slice(0, limit);
}

export interface SearchParams {
  q?: string;
  category?: string;
  sub_category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}

export interface SearchResult {
  products: Product[];
  count: number;
}

export async function searchProducts({
  q,
  category,
  sub_category,
  minPrice,
  maxPrice,
  page = 1,
  pageSize = 24,
}: SearchParams): Promise<SearchResult> {
  if (!supabase) return { products: [], count: 0 };

  let query = supabase
    .from("unique_products")
    .select(PRODUCT_COLUMNS, { count: "exact" })
    .not("image_url", "is", null);

  if (q && q.trim()) {
    const terms = q
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((t) => `${t}:*`)
      .join(" & ");
    query = query.textSearch("search_tsv", terms, {
      type: "plain",
      config: "english",
    });
  }
  if (category) query = query.eq("category", category);
  if (sub_category) query = query.eq("sub_category", sub_category);
  if (typeof minPrice === "number") query = query.gte("price_numeric", minPrice);
  if (typeof maxPrice === "number") query = query.lte("price_numeric", maxPrice);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  query = q
    ? query.order("matched_query_count", { ascending: false, nullsFirst: false })
    : query.order("matched_query_count", { ascending: false, nullsFirst: false });

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error("searchProducts", error.message);
    return { products: [], count: 0 };
  }
  return { products: data ?? [], count: count ?? 0 };
}

export function formatPrice(product: Pick<Product, "price" | "currency" | "price_numeric">) {
  if (product.price_numeric != null) {
    const currency = product.currency?.trim() || "INR";
    const symbol = currency === "INR" || currency === "₹" ? "₹" : currency + " ";
    return `${symbol}${Math.round(product.price_numeric).toLocaleString("en-IN")}`;
  }
  return product.price ?? "";
}

export { isSupabaseConfigured };
