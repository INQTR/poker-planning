import { Feed } from "feed";
import { getPosts } from "../posts";

const SITE_URL = "https://agilekit.app";

export async function GET() {
  const posts = await getPosts();

  const feed = new Feed({
    title: "AgileKit Blog",
    description:
      "Tips, guides, and insights on planning poker and agile estimation.",
    id: SITE_URL,
    link: SITE_URL,
    language: "en",
    favicon: `${SITE_URL}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, AgileKit`,
    feedLinks: {
      rss2: `${SITE_URL}/blog/rss.xml`,
      atom: `${SITE_URL}/blog/atom.xml`,
    },
    author: {
      name: "AgileKit Team",
      link: SITE_URL,
    },
  });

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `${SITE_URL}/blog/${post.slug}`,
      link: `${SITE_URL}/blog/${post.slug}`,
      description: post.spoiler,
      date: new Date(post.date),
      author: [
        {
          name: "AgileKit Team",
          link: SITE_URL,
        },
      ],
    });
  });

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
