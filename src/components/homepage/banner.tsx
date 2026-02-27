import Link from "next/link";

export const Banner = () => {
  return (
    <aside
      aria-label="New feature announcement"
      className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 flex items-center justify-center gap-x-2 z-50 text-sm font-medium"
    >
      <span className="inline-flex items-center rounded-full bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary dark:text-primary">
        New
      </span>
      <p>
        Jira Cloud integration is here — import issues and push estimates
        automatically.{" "}
        <Link
          href="/blog/jira-integration"
          className="underline decoration-1 underline-offset-2 hover:opacity-80 transition-opacity ml-1"
        >
          Learn more
        </Link>
      </p>
    </aside>
  );
};
