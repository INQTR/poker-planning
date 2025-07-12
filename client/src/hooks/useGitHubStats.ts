import { useEffect, useState } from "react";

interface GitHubStats {
  stars: number;
  isLoading: boolean;
  error: Error | null;
}

export function useGitHubStats(): GitHubStats {
  const [stars, setStars] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchGitHubStats() {
      try {
        const response = await fetch(
          "https://api.github.com/repos/INQTR/poker-planning",
        );
        if (!response.ok) {
          throw new Error("Failed to fetch GitHub stats");
        }
        const data = await response.json();
        setStars(data.stargazers_count);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    }

    fetchGitHubStats();
  }, []);

  return { stars, isLoading, error };
}
