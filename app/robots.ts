import type { MetadataRoute } from "next";
import { siteUrl } from "@/app/lib/links";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
