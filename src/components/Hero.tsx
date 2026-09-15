import type { Product } from "@/lib/types";
import HeroChatDemo from "./HeroChatDemo";

export default function Hero({ products }: { products: Product[] }) {
  return (
    <section className="px-6 pt-14 pb-10 text-center sm:pt-20 sm:pb-14">
      <h1 className="mx-auto max-w-3xl font-display text-4xl font-medium leading-[1.1] tracking-tight text-balance text-ink-900 sm:text-6xl sm:leading-[1.08]">
        No More Endless Browsing, Just Ask MIRRA!
      </h1>

      <HeroChatDemo products={products} />

      <p className="mx-auto mt-20 max-w-xl text-base text-ink-700 sm:mt-24 sm:text-lg">
        Tell Mirra what you need. It finds clothes that match your wardrobe,
        suggests you what to wear and what&rsquo;s actually missing from your
        closet.
      </p>
    </section>
  );
}
