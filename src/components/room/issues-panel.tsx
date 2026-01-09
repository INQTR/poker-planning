"use client";

import { FC, useRef, useState } from "react";
import { X, Download, Plus, ListTodo, Loader2, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useIssues } from "./hooks/useIssues";
import { IssueItem } from "./issue-item";
import { exportIssuesToCSV } from "@/utils/export-issues-csv";
import type { Id } from "@/convex/_generated/dataModel";

interface IssuesPanelProps {
  roomId: Id<"rooms">;
  roomName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const IssuesPanel: FC<IssuesPanelProps> = ({
  roomId,
  roomName,
  isOpen,
  onClose,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [newIssueTitle, setNewIssueTitle] = useState("");
  const [isAddingIssue, setIsAddingIssue] = useState(false);

  const {
    issues,
    currentIssue,
    isQuickVoteMode,
    isLoading,
    createIssue,
    startVoting,
    switchToQuickVote,
    updateTitle,
    updateEstimate,
    deleteIssue,
    exportData,
  } = useIssues({ roomId });

  const handleAddIssue = async () => {
    if (!newIssueTitle.trim()) return;

    setIsAddingIssue(true);
    try {
      await createIssue(newIssueTitle.trim());
      setNewIssueTitle("");
      toast({
        title: "Issue added",
        description: `"${newIssueTitle.trim()}" has been added to the list.`,
      });
    } catch (error) {
      console.error("Failed to add issue:", error);
      toast({
        title: "Failed to add issue",
        variant: "destructive",
      });
    } finally {
      setIsAddingIssue(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isAddingIssue) {
      handleAddIssue();
    }
  };

  const handleStartVoting = async (issueId: Id<"issues">) => {
    const issue = issues.find((i) => i._id === issueId);
    try {
      await startVoting(issueId);
      toast({
        title: issue ? `Voting on "${issue.title}"` : "Voting started",
        description: "All previous votes have been cleared.",
      });
    } catch (error) {
      console.error("Failed to start voting:", error);
      toast({
        title: "Failed to start voting",
        variant: "destructive",
      });
    }
  };

  const handleSwitchToQuickVote = async () => {
    if (isQuickVoteMode) return; // Already in Quick Vote mode
    try {
      await switchToQuickVote();
      toast({
        title: "Quick Vote",
        description: "Switched to ad-hoc voting mode.",
      });
    } catch (error) {
      console.error("Failed to switch to Quick Vote:", error);
      toast({
        title: "Failed to switch mode",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTitle = async (issueId: Id<"issues">, title: string) => {
    try {
      await updateTitle(issueId, title);
    } catch (error) {
      console.error("Failed to update title:", error);
      toast({
        title: "Failed to update title",
        variant: "destructive",
      });
    }
  };

  const handleUpdateEstimate = async (
    issueId: Id<"issues">,
    estimate: string
  ) => {
    try {
      await updateEstimate(issueId, estimate);
    } catch (error) {
      console.error("Failed to update estimate:", error);
      toast({
        title: "Failed to update estimate",
        variant: "destructive",
      });
    }
  };

  const handleDeleteIssue = async (issueId: Id<"issues">) => {
    try {
      await deleteIssue(issueId);
      toast({
        title: "Issue deleted",
      });
    } catch (error) {
      console.error("Failed to delete issue:", error);
      toast({
        title: "Failed to delete issue",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    if (!exportData || exportData.length === 0) {
      toast({
        title: "No issues to export",
        description: "Add some issues first.",
        variant: "destructive",
      });
      return;
    }

    exportIssuesToCSV(exportData, roomName);
    toast({
      title: "Export successful",
      description: `Exported ${exportData.length} issues to CSV.`,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className={cn(
        "absolute top-4 right-4 bottom-4 z-50 w-96",
        "bg-white/95 dark:bg-surface-1/95 backdrop-blur-sm",
        "rounded-xl shadow-2xl",
        "border border-gray-200/50 dark:border-border",
        "animate-in fade-in-0 slide-in-from-right-2 duration-200",
        "flex flex-col"
      )}
      role="dialog"
      aria-label="Issues panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200/50 dark:border-border">
        <div className="flex items-center gap-2">
          <ListTodo className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            Issues
          </h2>
          <span className="text-xs text-gray-500 dark:text-gray-500">
            {issues.length} {issues.length === 1 ? "issue" : "issues"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExport}
                  disabled={issues.length === 0}
                  className="h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-surface-3 rounded-md"
                  aria-label="Export to CSV"
                >
                  <Download className="h-4 w-4" />
                </Button>
              }
            />
            <TooltipContent>
              <p>Export to CSV</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-surface-3 rounded-md"
                  aria-label="Close panel"
                >
                  <X className="h-4 w-4" />
                </Button>
              }
            />
            <TooltipContent>
              <p>Close</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Add Issue Input - at top */}
      <div className="border-b border-gray-200/50 dark:border-border p-4">
        <div className="flex gap-2">
          <Input
            value={newIssueTitle}
            onChange={(e) => setNewIssueTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add new issue..."
            className="h-9 text-sm"
            disabled={isAddingIssue}
          />
          <Button
            onClick={handleAddIssue}
            disabled={!newIssueTitle.trim() || isAddingIssue}
            className="h-9 px-3"
            size="sm"
          >
            {isAddingIssue ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Issues List */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-2">
        {/* Quick Vote option - always first */}
        <button
          onClick={handleSwitchToQuickVote}
          className={cn(
            "w-full p-3 rounded-lg border text-left transition-colors",
            isQuickVoteMode
              ? "bg-primary/10 border-primary dark:bg-primary/20"
              : "bg-gray-50 dark:bg-surface-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700"
          )}
        >
          <div className="flex items-center gap-2">
            <Zap className={cn(
              "h-4 w-4",
              isQuickVoteMode ? "text-primary" : "text-gray-500"
            )} />
            <span className={cn(
              "font-medium text-sm",
              isQuickVoteMode ? "text-primary" : "text-gray-700 dark:text-gray-300"
            )}>
              Quick Vote
            </span>
            {isQuickVoteMode && (
              <span className="text-xs text-primary ml-auto">Active</span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">
            Ad-hoc voting without tracking
          </p>
        </button>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : issues.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Add issues to track estimates
            </p>
          </div>
        ) : (
          issues.map((issue) => (
            <IssueItem
              key={issue._id}
              issue={issue}
              isCurrent={currentIssue?._id === issue._id}
              onStartVoting={handleStartVoting}
              onUpdateTitle={handleUpdateTitle}
              onUpdateEstimate={handleUpdateEstimate}
              onDelete={handleDeleteIssue}
            />
          ))
        )}
      </div>

    </div>
  );
};
