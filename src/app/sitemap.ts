import type { MetadataRoute } from "next";
import { nav, site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...nav.map((n) => ({
      url: `${site.url}${n.href === "/" ? "" : n.href}`,
      lastModified: now,
      changeFrequency: (n.href === "/irrigation" || n.href === "/calendar" || n.href === "/" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: n.href === "/" ? 1 : 0.7,
    })),
    { url: `${site.url}/documents/red-hawk-canyon-ccrs.pdf`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];
}
