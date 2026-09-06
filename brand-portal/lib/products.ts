import "server-only";
import { getSupabaseAdmin } from "./supabase-admin";

export const PAGE_SIZE = 40;

export interface BrandProduct {
  id: number;
  name: string | null;
  brand: string | null;
  price: string | null;
  price_numeric: number | null;
  currency: string | null;
  image_url: string | null;
  product_url: string | null;
  category: string | null;
  sub_category: string | null;
}

const PRODUCT_COLUMNS =
  "id, name, brand, price, price_numeric, currency, image_url, product_url, category, sub_category";

/** Returns the brand name as it's actually cased in the catalog, for display. */
export async function getBrandDisplayName(brand: string): Promise<string> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("unique_products")
    .select("brand")
    .ilike("brand", brand)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data?.brand ?? brand;
}

/** True if at least one catalog row belongs to this brand (case-insensitive). */
export async function brandExistsInCatalog(brand: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { count, error } = await supabase
    .from("unique_products")
    .select("id", { count: "exact", head: true })
    .ilike("brand", brand);
  if (error) throw error;
  return (count ?? 0) > 0;
}

/** Distinct, sorted category values among this brand's items only. */
export async function getBrandCategories(brand: string): Promise<string[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("unique_products")
    .select("category")
    .ilike("brand", brand)
    .not("category", "is", null);
  if (error) throw error;
  const values = new Set<string>();
  for (const row of data ?? []) {
    if (row.category) values.add(row.category);
  }
  return Array.from(values).sort((a, b) => a.localeCompare(b));
}

/**
 * Distinct, sorted sub_category values among this brand's items, narrowed to
 * `category` when one is given (matches case-insensitively).
 */
export async function getBrandSubCategories(
  brand: string,
  category: string | null,
): Promise<string[]> {
  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("unique_products")
    .select("sub_category")
    .ilike("brand", brand)
    .not("sub_category", "is", null);
  if (category) {
    query = query.ilike("category", category);
  }
  const { data, error } = await query;
  if (error) throw error;
  const values = new Set<string>();
  for (const row of data ?? []) {
    if (row.sub_category) values.add(row.sub_category);
  }
  return Array.from(values).sort((a, b) => a.localeCompare(b));
}

export interface BrandProductsPage {
  items: BrandProduct[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export async function getBrandProducts(params: {
  brand: string;
  category: string | null;
  subCategory: string | null;
  page: number;
}): Promise<BrandProductsPage> {
  const { brand, category, subCategory, page } = params;
  const supabase = getSupabaseAdmin();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("unique_products")
    .select(PRODUCT_COLUMNS, { count: "exact" })
    .ilike("brand", brand);

  if (category) query = query.ilike("category", category);
  if (subCategory) query = query.ilike("sub_category", subCategory);

  const { data, error, count } = await query
    .order("id", { ascending: true })
    .range(from, to);
  if (error) throw error;

  return {
    items: (data as BrandProduct[] | null) ?? [],
    totalCount: count ?? 0,
    page,
    pageSize: PAGE_SIZE,
  };
}

/**
 * Deletes a product by id, scoped to the session's brand. The `ilike("brand", ...)`
 * filter is load-bearing: without it a logged-in brand could delete another
 * brand's row by guessing/crafting an id. `unique_product_embeddings` cascades
 * on delete, so no extra cleanup is needed here.
 */
export async function deleteBrandProduct(brand: string, id: number): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error, count } = await supabase
    .from("unique_products")
    .delete({ count: "exact" })
    .eq("id", id)
    .ilike("brand", brand);
  if (error) throw error;
  if (!count) {
    throw new Error("Item not found, or it does not belong to this brand.");
  }
}
