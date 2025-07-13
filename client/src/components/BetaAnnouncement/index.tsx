import { X, Sparkles, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";

export function BetaAnnouncement() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if announcement was previously dismissed
    const dismissed = localStorage.getItem("canvas-beta-dismissed");
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem("canvas-beta-dismissed", "true");
  };

  if (!isVisible || isDismissed) return null;

  return (
    <aside
      aria-label="Beta feature announcement"
      className="relative bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-b border-purple-200 dark:border-purple-800/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                New Beta Feature
              </span>
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Try our new Canvas Room with endless whiteboard, floating
              navigation, and modern UI inspired by collaborative tools!
            </span>
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-full">
              <AlertCircle className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                Experimental
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-8 w-8 p-0 hover:bg-purple-100 dark:hover:bg-purple-900/30"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss announcement</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
