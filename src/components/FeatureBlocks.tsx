import Image from "next/image";
import PhoneReveal from "./PhoneReveal";

const FEATURES = [
  {
    title: "Your Style, Decoded",
    body: "Style Fingerprint learns what you love, from colour and fit to formality and price, so every recommendation feels more like you. Your Style Fingerprint is generated from your wardrobe, purchases, likes and style interactions.",
    src: "/images/style-fingerprint-phone.png",
    alt: "Style Fingerprint screen showing sliders for color, formality, fit, culture, price and patterns",
  },
  {
    title: "One Question, every brand.",
    body: "Mirra indexes products across multiple brands and retailers, so a single search surfaces options you'd otherwise have to hunt for site by site.",
    src: "/images/chat-search-phone.png",
    alt: "Mirra chat screen showing a styling request and matching black tops pulled from multiple brands",
  },
];

export default function FeatureBlocks() {
  return (
    <section className="grid grid-cols-1 gap-10 px-6 py-10 sm:px-10 md:grid-cols-2">
      {FEATURES.map((f, i) => (
        <div
          key={f.title}
          className="flex flex-col items-center text-center md:items-start md:text-left"
        >
          <PhoneReveal delay={i * 0.15}>
            <Image
              src={f.src}
              alt={f.alt}
              width={280}
              height={502}
              className="h-auto w-[280px]"
              priority={false}
            />
          </PhoneReveal>
          <h3 className="mt-6 font-display text-2xl text-ink-900">{f.title}</h3>
          <p className="mt-2 max-w-sm text-sm text-ink-700">{f.body}</p>
        </div>
      ))}
    </section>
  );
}
