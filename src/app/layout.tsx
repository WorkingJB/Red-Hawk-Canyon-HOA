import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/fraunces";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/ui";
import { photos, site } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | ${site.city}, ${site.state}`, template: `%s | ${site.name}` },
  description: site.tagline,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    images: [{ url: photos.valley.src, width: photos.valley.width, height: photos.valley.height, alt: photos.valley.alt }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f2" },
    { media: "(prefers-color-scheme: dark)", color: "#171412" },
  ],
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${site.url}/#organization`,
  name: site.legalName,
  alternateName: [site.name, "Red Hawk Canyon Homeowners Association"],
  url: site.url,
  email: site.email,
  logo: `${site.url}/icon.svg`,
  description: site.tagline,
  areaServed: {
    "@type": "Place",
    name: `Red Hawk Canyon, ${site.city}, ${site.state}`,
    address: { "@type": "PostalAddress", addressLocality: site.city, addressRegion: site.state, addressCountry: "US" },
  },
  contactPoint: { "@type": "ContactPoint", email: site.email, contactType: "HOA board" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-friendly site summary" />
      </head>
      <body className="flex min-h-dvh flex-col antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <JsonLd data={orgJsonLd} />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
