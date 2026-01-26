"use client";

import { FC, useState, useRef, useEffect } from "react";
import { MoreHorizontal, Trash2, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Doc, Id } from "@/convex/_generated/dataModel";

interface IssueItemProps {
  issue: Doc<"issues">;
  isCurrent: boolean;
  onStartVoting: (issueId: Id<"issues">) => void;
  onUpdateTitle: (issueId: Id<"issues">, title: string) => void;
  onUpdateEstimate: (issueId: Id<"issues">, estimate: string) => void;
  onDelete: (issueId: Id<"issues">) => void;
  isDemoMode?: boolean;
}

export const IssueItem: FC<IssueItemProps> = ({
  issue,
  isCurrent,
  onStartVoting,
  onUpdateTitle,
  onUpdateEstimate,
  onDelete,
  isDemoMode = false,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingEstimate, setIsEditingEstimate] = useState(false);
  const [editedTitle, setEditedTitle] = useState(issue.title);
  const [editedEstimate, setEditedEstimate] = useState(
    issue.finalEstimate ?? ""
  );
  const titleInputRef = useRef<HTMLInputElement>(null);
  const estimateInputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    if (isEditingEstimate && estimateInputRef.current) {
      estimateInputRef.current.focus();
      estimateInputRef.current.select();
    }
  }, [isEditingEstimate]);

  const handleTitleSave = () => {
    if (editedTitle.trim() && editedTitle !== issue.title) {
      onUpdateTitle(issue._id, editedTitle.trim());
    } else {
      setEditedTitle(issue.title);
    }
    setIsEditingTitle(false);
  };

  const handleEstimateSave = () => {
    if (editedEstimate !== (issue.finalEstimate ?? "")) {
      onUpdateEstimate(issue._id, editedEstimate);
    }
    setIsEditingEstimate(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleSave();
    } else if (e.key === "Escape") {
      setEditedTitle(issue.title);
      setIsEditingTitle(false);
    }
  };

  const handleEstimateKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEstimateSave();
    } else if (e.key === "Escape") {
      setEditedEstimate(issue.finalEstimate ?? "");
      setIsEditingEstimate(false);
    }
  };

  const isCompleted = issue.status === "completed";
  const isVoting = issue.status === "voting";

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg transition-colors",
        "bg-white dark:bg-surface-1",
        "border border-gray-200/50 dark:border-border",
        isCurrent && "ring-2 ring-blue-400 dark:ring-blue-500"
      )}
    >
      {/* Title */}
      <div className="flex-1 min-w-0">
        {isEditingTitle ? (
          <Input
            ref={titleInputRef}
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={handleTitleKeyDown}
            className="h-7 text-sm"
          />
        ) : (
          <span
            className={cn(
              "text-sm font-medium text-gray-900 dark:text-gray-100 truncate block",
              !isVoting && !isDemoMode && "cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
            )}
            onClick={() => !isVoting && !isDemoMode && onStartVoting(issue._id)}
            title={isDemoMode ? issue.title : (isVoting ? issue.title : `Click to vote on: ${issue.title}`)}
          >
            {issue.title}
          </span>
        )}
      </div>

      {/* Status/Action Button */}
      <div className="flex-shrink-0">
        {isVoting ? (
          <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-blue-500 text-white">
            Voting now...
          </span>
        ) : isCompleted ? (
          <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-green-100 dark:bg-status-success-bg text-green-700 dark:text-status-success-fg">
            Done
          </span>
        ) : isDemoMode ? (
          <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-surface-2 text-gray-500 dark:text-gray-400">
            Pending
          </span>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStartVoting(issue._id)}
            className="h-7 px-2.5 text-xs"
          >
            Vote this issue
          </Button>
        )}
      </div>

      {/* Final Estimate */}
      <div className="flex-shrink-0 w-10 text-center">
        {isEditingEstimate ? (
          <Input
            ref={estimateInputRef}
            value={editedEstimate}
            onChange={(e) => setEditedEstimate(e.target.value)}
            onBlur={handleEstimateSave}
            onKeyDown={handleEstimateKeyDown}
            className="h-7 w-10 text-xs text-center p-1"
          />
        ) : (
          <span
            className={cn(
              "text-sm font-mono",
              !isDemoMode && "cursor-pointer hover:text-blue-600 dark:hover:text-blue-400",
              issue.finalEstimate
                ? "text-gray-900 dark:text-gray-100 font-medium"
                : "text-gray-400 dark:text-gray-500"
            )}
            onClick={() => !isDemoMode && setIsEditingEstimate(true)}
            title={isDemoMode ? (issue.finalEstimate ?? "No estimate") : "Click to edit estimate"}
          >
            {issue.finalEstimate ?? "-"}
          </span>
        )}
      </div>

      {/* Actions Menu (hidden in demo mode) */}
      {!isDemoMode && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-surface-3"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Issue actions</span>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit title
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(issue._id)}
              className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
