import type { CategoryMeta } from "./types";

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: "ethnic-wear",
    label: "Ethnic Wear",
    category: "Ethnic Wear",
    swatch: "#96372f",
    swatchText: "#faf1ec",
  },
  {
    slug: "western-wear",
    label: "Western Wear",
    category: "Western Wear",
    swatch: "#263850",
    swatchText: "#eef1f6",
  },
  {
    slug: "footwear",
    label: "Footwear",
    category: "Footwear",
    swatch: "#8a5a34",
    swatchText: "#f7efe4",
  },
  {
    slug: "innerwear-loungewear",
    label: "Innerwear & Loungewear",
    category: "Innerwear & Loungewear",
    swatch: "#6c3c4c",
    swatchText: "#f6ecef",
  },
  {
    slug: "swimwear",
    label: "Swimwear",
    category: "Swimwear",
    swatch: "#2c5278",
    swatchText: "#eaf1f7",
  },
  {
    slug: "winterwear",
    label: "Winterwear",
    category: "Winterwear",
    swatch: "#2a4638",
    swatchText: "#ecf2ee",
  },
];

export function categoryBySlug(slug: string): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

const FALLBACK_SWATCH = { swatch: "#4a4038", swatchText: "#f4efe9" };

export function swatchForCategory(category: string | null | undefined): {
  swatch: string;
  swatchText: string;
} {
  const match = CATEGORIES.find((c) => c.category === category);
  return match ? { swatch: match.swatch, swatchText: match.swatchText } : FALLBACK_SWATCH;
}
