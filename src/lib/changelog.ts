import fs from "fs";
import path from "path";

export interface ChangelogEntry {
  text: string;
}

export interface ChangelogCategory {
  name: string;
  entries: ChangelogEntry[];
}

export interface ChangelogRelease {
  version: string;
  date: string;
  categories: ChangelogCategory[];
}

/**
 * Parse the CHANGELOG.md file and extract releases.
 *
 * Expected format (release-please output):
 * ```
 * ## [1.0.0](https://github.com/...) (2026-01-24)
 *
 * ### Features
 *
 * * feature description ([commit](url))
 * ```
 *
 * @returns Array of parsed releases, empty array if file is missing or malformed
 */
export function parseChangelog(): ChangelogRelease[] {
  const changelogPath = path.join(process.cwd(), "CHANGELOG.md");

  let content: string;
  try {
    content = fs.readFileSync(changelogPath, "utf-8");
  } catch (error) {
    console.error("[changelog] Failed to read CHANGELOG.md:", error);
    return [];
  }

  if (!content.trim()) {
    console.warn("[changelog] CHANGELOG.md is empty");
    return [];
  }

  const releases: ChangelogRelease[] = [];
  const lines = content.split("\n");

  let currentRelease: ChangelogRelease | null = null;
  let currentCategory: ChangelogCategory | null = null;

  for (const line of lines) {
    // Match version header: ## [1.0.0](url) (2026-01-24)
    const versionMatch = line.match(
      /^## \[([^\]]+)\]\([^)]*\) \((\d{4}-\d{2}-\d{2})\)/
    );
    if (versionMatch) {
      if (currentRelease) {
        if (currentCategory && currentCategory.entries.length > 0) {
          currentRelease.categories.push(currentCategory);
        }
        releases.push(currentRelease);
      }
      currentRelease = {
        version: versionMatch[1],
        date: versionMatch[2],
        categories: [],
      };
      currentCategory = null;
      continue;
    }

    // Match category header: ### Features
    const categoryMatch = line.match(/^### (.+)$/);
    if (categoryMatch && currentRelease) {
      if (currentCategory && currentCategory.entries.length > 0) {
        currentRelease.categories.push(currentCategory);
      }
      currentCategory = {
        name: categoryMatch[1],
        entries: [],
      };
      continue;
    }

    // Match entry: * some feature description ([commit](url))
    // Strip PR/commit links, keep only the description
    const entryMatch = line.match(/^\* (.+)$/);
    if (entryMatch && currentCategory) {
      // Remove links in format [text](url) and (url) patterns
      let text = entryMatch[1]
        .replace(/\s*\(\[[^\]]+\]\([^)]+\)\)/g, "") // Remove ([text](url))
        .replace(/\s*\[[^\]]+\]\([^)]+\)/g, "") // Remove [text](url)
        .replace(/\s*\([a-f0-9]{7}\)/g, "") // Remove (commit-hash)
        .replace(/\s*\(#\d+\)/g, "") // Remove (#123)
        .trim();

      // Clean up scope prefix like **table:** or **seo:**
      text = text.replace(/^\*\*([^*]+):\*\*\s*/, "$1: ");

      if (text) {
        currentCategory.entries.push({ text });
      }
    }
  }

  // Don't forget the last release and category
  if (currentRelease) {
    if (currentCategory && currentCategory.entries.length > 0) {
      currentRelease.categories.push(currentCategory);
    }
    releases.push(currentRelease);
  }

  // Validation: warn if changelog has content but no releases were parsed
  if (releases.length === 0 && content.includes("## ")) {
    console.warn(
      "[changelog] CHANGELOG.md contains headers but no releases were parsed. " +
        "Expected format: ## [version](url) (YYYY-MM-DD)"
    );
  }

  return releases;
}

/**
 * Get the latest release from the changelog
 */
export function getLatestRelease(): ChangelogRelease | null {
  const releases = parseChangelog();
  return releases.length > 0 ? releases[0] : null;
}

/**
 * Format a date string to relative time
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "just released";
  } else if (diffDays === 1) {
    return "1 day ago";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 14) {
    return "1 week ago";
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} weeks ago`;
  } else if (diffDays < 60) {
    return "1 month ago";
  } else {
    const months = Math.floor(diffDays / 30);
    return `${months} months ago`;
  }
}
