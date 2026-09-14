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
      className="flex items-center gap-2 rounded-full border border-surface/20 bg-surface/10 py-1.5 pr-4 pl-1.5 transition-colors hover:border-surface/40 sm:gap-2.5 sm:py-2 sm:pr-5 sm:pl-2"
    >
      <Image
        src={src}
        alt={alt}
        width={80}
        height={80}
        className="h-7 w-7 shrink-0 rounded-full sm:h-9 sm:w-9"
      />
      <span className="flex flex-col leading-none">
        <span className="text-[9px] text-surface/60 sm:text-[10px]">{eyebrow}</span>
        <span className="text-[12px] font-semibold text-surface sm:text-sm">
          {label}
        </span>
      </span>
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="mt-auto bg-ink px-6 pt-16 pb-8 text-surface sm:px-10">
      <div className="mx-auto max-w-7xl">
        <h3 className="font-display text-2xl">Shop women&rsquo;s fashion, all in one place.</h3>
        <p className="mt-2 max-w-sm text-sm text-surface/60">
          Ethnic wear, western wear, footwear, swimwear, loungewear and
          winterwear — search once, find it everywhere.
        </p>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl items-center justify-center gap-3">
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

      <div className="mx-auto mt-10 max-w-7xl">
        <Image
          src="/images/LogoDarkBackground-cropped.png"
          alt="Mirra"
          width={480}
          height={172}
          className="h-7 w-auto"
        />
        <p className="mt-2 text-sm text-surface/60">
          Your one search for women&rsquo;s fashion across every brand we carry.
        </p>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 border-t border-surface/15 pt-6 text-xs text-surface/50">
        <a href="mailto:support.mirraai@gmail.com" className="hover:text-surface">
          support.mirraai@gmail.com
        </a>
        <a
          href="https://askmirra.ai/privacy-policy.html"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-surface"
        >
          Privacy
        </a>
        <a
          href="https://askmirra.ai/terms-and-conditions.html"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-surface"
        >
          Terms
        </a>
        <a
          href="https://askmirra.ai/delete-account.html"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-surface"
        >
          Delete Account
        </a>
        <span className="ml-auto">
          © {new Date().getFullYear()} Threadmind Labs Pvt. Ltd.
        </span>
      </div>
    </footer>
  );
}
