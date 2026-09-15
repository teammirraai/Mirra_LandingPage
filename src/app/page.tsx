import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryRail from "@/components/CategoryRail";
import ProductRail from "@/components/ProductRail";
import About from "@/components/About";
import FeatureBlocks from "@/components/FeatureBlocks";
import BrandMarquee from "@/components/BrandMarquee";
import Footer from "@/components/Footer";
import {
  getFeaturedProducts,
  getSubCategoryPreviews,
  getBrands,
  getBlackShirts,
  getCropTops,
  isSupabaseConfigured,
} from "@/lib/products";

export const revalidate = 300;

export default async function Home() {
  const [featured, subCategoryPreviews, brands, blackShirts, cropTops] =
    await Promise.all([
      getFeaturedProducts(24),
      getSubCategoryPreviews(),
      getBrands(20),
      getBlackShirts(6),
      getCropTops(3),
    ]);

  return (
    <>
      <Header />
      <main className="flex-1">
        {!isSupabaseConfigured ? (
          <div className="border-b border-amber-200 bg-amber-50 px-6 py-2.5 text-center text-xs text-amber-800 sm:px-10">
            Supabase isn&rsquo;t connected yet — add your project URL and anon
            key to <code>.env.local</code> to populate real products.
          </div>
        ) : null}

        <Hero products={cropTops} />
        <CategoryRail previews={subCategoryPreviews} />

        <section className="py-10">
          <div className="px-6 sm:px-10">
            <h2 className="font-display text-2xl text-ink-900">
              Pieces from popular home grown and international brands.
            </h2>
          </div>
          <div className="mt-5">
            <ProductRail products={featured} />
          </div>
        </section>

        <About products={featured} blackShirts={blackShirts} />
        <FeatureBlocks />
        <BrandMarquee brands={brands} />
      </main>
      <Footer />
    </>
  );
}
