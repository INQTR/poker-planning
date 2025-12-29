import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://agilekit.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/room/", "/demo", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
