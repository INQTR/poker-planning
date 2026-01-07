import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import GithubSlugger from "github-slugger";

export interface Post {
  slug: string;
  title: string;
  date: string;
  spoiler: string;
  tags: string[];
  content: string;
  readingTime: string;
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  spoiler: string;
  tags: string[];
  readingTime: string;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

const BLOG_DIR = path.join(process.cwd(), "public", "blog");

/**
 * Get all blog posts with metadata (without content)
 */
export async function getPosts(): Promise<PostMeta[]> {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const entries = fs.readdirSync(BLOG_DIR, { withFileTypes: true });
  const posts: PostMeta[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const filePath = path.join(BLOG_DIR, entry.name, "index.md");
    if (!fs.existsSync(filePath)) continue;

    try {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      // Validate required frontmatter
      if (!data.date) {
        console.warn(`Blog post missing date: ${filePath}`);
        continue; // Skip posts without dates
      }

      posts.push({
        slug: entry.name,
        title: data.title || entry.name,
        date: String(data.date),
        spoiler: data.spoiler || "",
        tags: data.tags || [],
        readingTime: readingTime(content).text,
      });
    } catch (error) {
      console.error(`Failed to read blog post: ${filePath}`, error);
      continue;
    }
  }

  // Sort by date (newest first)
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Get a single post by slug (with full content)
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filePath = path.join(BLOG_DIR, slug, "index.md");

  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    // Validate required frontmatter
    if (!data.date) {
      console.warn(`Blog post missing date: ${filePath}`);
      return null;
    }

    return {
      slug,
      title: data.title || slug,
      date: String(data.date),
      spoiler: data.spoiler || "",
      tags: data.tags || [],
      content,
      readingTime: readingTime(content).text,
    };
  } catch (error) {
    console.error(`Failed to read blog post: ${filePath}`, error);
    return null;
  }
}

/**
 * Get all post slugs for static generation
 */
export async function getAllSlugs(): Promise<string[]> {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const entries = fs.readdirSync(BLOG_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => {
      if (!entry.isDirectory()) return false;
      const filePath = path.join(BLOG_DIR, entry.name, "index.md");
      return fs.existsSync(filePath);
    })
    .map((entry) => entry.name);
}

/**
 * Extract table of contents from markdown content
 * Uses github-slugger to match rehype-slug's ID generation
 */
export function getTableOfContents(content: string): TocItem[] {
  const slugger = new GithubSlugger();

  // Remove code blocks before parsing headings to avoid false matches
  const contentWithoutCode = content
    .replace(/```[\s\S]*?```/g, "") // Fenced code blocks
    .replace(/`[^`]+`/g, ""); // Inline code

  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const toc: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(contentWithoutCode)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    // Use github-slugger to match rehype-slug's ID generation
    const id = slugger.slug(text);

    toc.push({ id, text, level });
  }

  return toc;
}

/**
 * Get related posts based on matching tags
 */
export async function getRelatedPosts(
  currentPost: PostMeta,
  allPosts: PostMeta[],
  limit = 3
): Promise<PostMeta[]> {
  const currentTags = new Set(currentPost.tags);

  const scored = allPosts
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => {
      const matchingTags = post.tags.filter((tag) => currentTags.has(tag));
      return { post, score: matchingTags.length };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ post }) => post);
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
