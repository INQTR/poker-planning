import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs";
import { parseChangelog, formatRelativeTime } from "./changelog";

vi.mock("fs");

describe("parseChangelog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should parse a valid changelog with single release", () => {
    const mockChangelog = `# Changelog

## [1.0.0](https://github.com/org/repo/compare/v0.1.0...v1.0.0) (2026-01-24)

### Features

* add new feature ([abc1234](https://github.com/org/repo/commit/abc1234))
* another feature (#123)

### Bug Fixes

* fix a bug ([def5678](https://github.com/org/repo/commit/def5678))
`;

    vi.mocked(fs.readFileSync).mockReturnValue(mockChangelog);

    const releases = parseChangelog();

    expect(releases).toHaveLength(1);
    expect(releases[0].version).toBe("1.0.0");
    expect(releases[0].date).toBe("2026-01-24");
    expect(releases[0].categories).toHaveLength(2);
    expect(releases[0].categories[0].name).toBe("Features");
    expect(releases[0].categories[0].entries).toHaveLength(2);
    expect(releases[0].categories[0].entries[0].text).toBe("add new feature");
    expect(releases[0].categories[1].name).toBe("Bug Fixes");
  });

  it("should parse multiple releases", () => {
    const mockChangelog = `# Changelog

## [2.0.0](https://github.com/org/repo/compare/v1.0.0...v2.0.0) (2026-02-01)

### Features

* new feature in v2

## [1.0.0](https://github.com/org/repo/compare/v0.1.0...v1.0.0) (2026-01-24)

### Features

* initial feature
`;

    vi.mocked(fs.readFileSync).mockReturnValue(mockChangelog);

    const releases = parseChangelog();

    expect(releases).toHaveLength(2);
    expect(releases[0].version).toBe("2.0.0");
    expect(releases[1].version).toBe("1.0.0");
  });

  it("should return empty array when file is missing", () => {
    vi.mocked(fs.readFileSync).mockImplementation(() => {
      throw new Error("ENOENT: no such file or directory");
    });

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const releases = parseChangelog();

    expect(releases).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith(
      "[changelog] Failed to read CHANGELOG.md:",
      expect.any(Error)
    );
  });

  it("should return empty array for empty changelog", () => {
    vi.mocked(fs.readFileSync).mockReturnValue("");

    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const releases = parseChangelog();

    expect(releases).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith("[changelog] CHANGELOG.md is empty");
  });

  it("should warn when headers exist but no releases parsed", () => {
    const mockChangelog = `# Changelog

## Invalid Header Format

Some content here
`;

    vi.mocked(fs.readFileSync).mockReturnValue(mockChangelog);
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const releases = parseChangelog();

    expect(releases).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("no releases were parsed")
    );
  });

  it("should strip scope prefixes like **table:**", () => {
    const mockChangelog = `## [1.0.0](https://github.com/org/repo) (2026-01-24)

### Features

* **seo:** add meta tags
`;

    vi.mocked(fs.readFileSync).mockReturnValue(mockChangelog);

    const releases = parseChangelog();

    expect(releases[0].categories[0].entries[0].text).toBe("seo: add meta tags");
  });

  it("should handle releases without categories", () => {
    const mockChangelog = `## [1.0.0](https://github.com/org/repo) (2026-01-24)

Just some description without categories.
`;

    vi.mocked(fs.readFileSync).mockReturnValue(mockChangelog);

    const releases = parseChangelog();

    expect(releases).toHaveLength(1);
    expect(releases[0].categories).toHaveLength(0);
  });
});

describe("formatRelativeTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-24T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return "just released" for today', () => {
    expect(formatRelativeTime("2026-01-24")).toBe("just released");
  });

  it('should return "1 day ago" for yesterday', () => {
    expect(formatRelativeTime("2026-01-23")).toBe("1 day ago");
  });

  it("should return days for less than a week", () => {
    expect(formatRelativeTime("2026-01-20")).toBe("4 days ago");
  });

  it('should return "1 week ago" for 7-13 days', () => {
    expect(formatRelativeTime("2026-01-15")).toBe("1 week ago");
  });

  it("should return weeks for 14-29 days", () => {
    expect(formatRelativeTime("2026-01-05")).toBe("2 weeks ago");
  });

  it('should return "1 month ago" for 30-59 days', () => {
    expect(formatRelativeTime("2025-12-25")).toBe("1 month ago");
  });

  it("should return months for 60+ days", () => {
    expect(formatRelativeTime("2025-10-24")).toBe("3 months ago");
  });
});
