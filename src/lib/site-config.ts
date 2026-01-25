function getSiteUrl(): string {
  // Custom URL takes priority (for production)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  // Vercel preview/production deployments
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  // Local development
  return "http://localhost:3000";
}

export const siteConfig = {
  name: "AgileKit",
  url: getSiteUrl(),
  description: "Free online planning poker for Scrum teams",
  author: {
    name: "AgileKit Team",
  },
  blog: {
    title: "AgileKit Blog",
    description:
      "Tips, guides, and insights on planning poker and agile estimation.",
  },
} as const;

export type SiteConfig = typeof siteConfig;
