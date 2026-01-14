"use client";

import { StickyNote } from "lucide-react";
import { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";

interface NodePickerToolbarProps {
  currentIssueId: Id<"issues"> | null;
  hasNoteForCurrentIssue: boolean;
  onCreateNote: () => void;
  isDemoMode?: boolean;
}

export function NodePickerToolbar({
  currentIssueId,
  hasNoteForCurrentIssue,
  onCreateNote,
  isDemoMode = false,
}: NodePickerToolbarProps): ReactElement | null {
  // Only show toolbar when there's an issue selected and no note exists
  if (!currentIssueId || hasNoteForCurrentIssue || isDemoMode) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed left-4 top-1/2 -translate-y-1/2 z-40",
        "bg-white/95 dark:bg-surface-1/95 backdrop-blur-sm",
        "rounded-lg shadow-lg border border-gray-200/50 dark:border-border",
        "p-1"
      )}
    >
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              onClick={onCreateNote}
              className={cn(
                "hover:bg-amber-100 dark:hover:bg-amber-900/30",
                "hover:text-amber-700 dark:hover:text-amber-400"
              )}
              aria-label="Add discussion note"
            >
              <StickyNote className="h-4 w-4" />
            </Button>
          }
        />
        <TooltipContent side="right">
          <p>Add discussion note</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
