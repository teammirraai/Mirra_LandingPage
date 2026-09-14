import Link from "next/link";
import Image from "next/image";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.mirraai.stylist";
const APP_STORE_URL =
  "https://apps.apple.com/in/app/mirra-ai-shopping-assistant/id6781397977";

function StoreBadge({
  href,
  src,
  alt,
  eyebrow,
  label,
}: {
  href: string;
  src: string;
  alt: string;
  eyebrow: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 rounded-full border border-ink-200 bg-surface-raised py-1 pr-2.5 pl-1 shadow-sm transition-colors hover:border-ink-300 sm:gap-2 sm:py-1.5 sm:pr-3.5 sm:pl-1.5"
    >
      <Image
        src={src}
        alt={alt}
        width={80}
        height={80}
        className="h-5 w-5 shrink-0 rounded-full sm:h-7 sm:w-7"
      />
      <span className="flex flex-col leading-none">
        <span className="text-[7px] text-ink-500 sm:text-[8px]">{eyebrow}</span>
        <span className="text-[9.5px] font-semibold text-ink-900 sm:text-[11px]">
          {label}
        </span>
      </span>
    </a>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-10">
        <Link href="/" className="shrink-0">
          <Image
            src="/images/LogoLightBackground-cropped.png"
            alt="Mirra"
            width={480}
            height={164}
            priority
            className="h-7 w-auto sm:h-8"
          />
        </Link>

        <div className="flex items-center gap-2">
          <StoreBadge
            href={PLAY_STORE_URL}
            src="/images/icon-google-play.png"
            alt="Google Play"
            eyebrow="Get it on"
            label="Google Play"
          />
          <StoreBadge
            href={APP_STORE_URL}
            src="/images/icon-app-store.png"
            alt="App Store"
            eyebrow="Download on"
            label="App Store"
          />
        </div>
      </div>
    </header>
  );
}
