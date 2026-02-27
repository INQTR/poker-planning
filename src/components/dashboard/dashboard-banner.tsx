import { Github } from "lucide-react";

export function DashboardBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 mb-8">
      <div className="absolute inset-0 bg-grid-white/10 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.5))] dark:bg-grid-black/10" />
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-background/50 backdrop-blur-sm px-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-indigo-500/15 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-300">
              Alpha
            </span>
            <span className="font-medium text-sm text-foreground">
              Dashboard functionality is a work in progress
            </span>
          </div>
          <span className="text-muted-foreground hidden sm:inline text-sm">
            &mdash;
          </span>
          <p className="text-sm text-muted-foreground">
            Help us shape the future by sharing your feedback on GitHub!
          </p>
        </div>
        <div className="flex shrink-0 w-full sm:w-auto">
          <a 
            href="https://github.com/INQTR/poker-planning/issues/new" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-indigo-600 text-white hover:bg-indigo-600/90 h-8 px-3 w-full sm:w-auto shadow-sm"
          >
            <Github className="mr-2 h-3.5 w-3.5" />
            Submit Issue
          </a>
        </div>
      </div>
    </div>
  );
}
