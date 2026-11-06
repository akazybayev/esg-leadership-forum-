import type { MetadataRoute } from "next";
import { SITE_PATHS, absoluteUrl } from "@/lib/seo";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routing.locales.flatMap((locale) =>
    SITE_PATHS.map((path) => ({
      url: absoluteUrl(locale, path),
      lastModified,
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority: path === "" ? 1 : path === "/register" || path === "/program" ? 0.9 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((item) => [item, absoluteUrl(item, path)]),
        ),
      },
    })),
  );
}
