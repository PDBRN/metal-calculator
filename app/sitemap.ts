import { METAL_TO_ASSORTMENTS } from "./lib/seo-engine";
import type { MetadataRoute } from "next";

// Для static export
export const dynamic = "force-static";

const SITE_URL = "https://metalpro.online";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Главная страница
  entries.push({
    url: `${SITE_URL}/`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1.0,
  });

  // Карта сайта (HTML)
  entries.push({
    url: `${SITE_URL}/sitemap/`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.3,
  });

  // Все страницы калькулятора: /metal/assortment/
  for (const [metalSlug, assortments] of Object.entries(METAL_TO_ASSORTMENTS)) {
    for (const assortmentSlug of assortments) {
      entries.push({
        url: `${SITE_URL}/${metalSlug}/${assortmentSlug}/`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
