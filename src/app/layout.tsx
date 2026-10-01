import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = "https://askmirra.ai";
const SITE_DESCRIPTION =
  "Mirra AI is a women-only fashion discovery platform and AI shopping assistant. Search across thousands of products in ethnic wear, western wear, footwear, swimwear, loungewear and winterwear — all in one place.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mirra AI – Women's Fashion Shopping Assistant",
    template: "%s | Mirra AI",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Mirra AI",
  keywords: [
    "Mirra",
    "Mirra AI",
    "askmirra",
    "AI shopping assistant",
    "women's fashion",
    "ethnic wear",
    "western wear",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Mirra AI",
    title: "Mirra AI – Women's Fashion Shopping Assistant",
    description: SITE_DESCRIPTION,
    images: ["/images/MirraCommonLogo.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mirra AI – Women's Fashion Shopping Assistant",
    description: SITE_DESCRIPTION,
    images: ["/images/MirraCommonLogo.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Mirra AI",
      alternateName: ["Mirra", "askmirra"],
      url: SITE_URL,
      logo: `${SITE_URL}/images/MirraCommonLogo.jpg`,
      sameAs: [
        "https://play.google.com/store/apps/details?id=com.mirraai.stylist",
        "https://apps.apple.com/in/app/mirra-ai-shopping-assistant/id6781397977",
      ],
    },
    {
      "@type": "WebSite",
      name: "Mirra AI",
      alternateName: ["Mirra", "askmirra"],
      url: SITE_URL,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
