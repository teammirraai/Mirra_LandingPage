export default function BrandMarquee({ brands }: { brands: string[] }) {
  if (brands.length === 0) return null;
  const loop = [...brands, ...brands];

  return (
    <section className="py-14">
      <div className="no-scrollbar overflow-hidden">
        <div className="flex w-max animate-marquee gap-10">
          {loop.map((b, i) => (
            <span
              key={`${b}-${i}`}
              className="whitespace-nowrap text-sm font-medium uppercase tracking-wide text-ink-500"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
