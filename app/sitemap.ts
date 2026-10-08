import type { MetadataRoute } from "next";
import { siteUrl } from "@/app/lib/links";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/privacidad`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/cookies`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
