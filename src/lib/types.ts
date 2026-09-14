export interface Product {
  id: number;
  name: string | null;
  brand: string | null;
  price: string | null;
  currency: string | null;
  image_url: string | null;
  product_url: string | null;
  category: string | null;
  sub_category: string | null;
  matched_query_count: number | null;
  sample_search_query: string | null;
  price_numeric: number | null;
}

export interface CategoryMeta {
  slug: string;
  label: string;
  category: string;
  swatch: string;
  swatchText: string;
}
