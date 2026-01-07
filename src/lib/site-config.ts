export const siteConfig = {
  name: "AgileKit",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://agilekit.app",
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
