"use client";

import { useQuery, useMutation } from "convex/react";
import { useCallback } from "react";
import { api } from "@/convex/_generated/api";
import type { Id, Doc } from "@/convex/_generated/dataModel";
import type { ExportableIssue } from "@/convex/model/issues";

interface UseIssuesProps {
  roomId: Id<"rooms">;
}

interface UseIssuesReturn {
  issues: Doc<"issues">[];
  currentIssue: Doc<"issues"> | null;
  isQuickVoteMode: boolean;
  isLoading: boolean;
  createIssue: (title: string) => Promise<Id<"issues">>;
  startVoting: (issueId: Id<"issues">) => Promise<void>;
  switchToQuickVote: () => Promise<void>;
  updateTitle: (issueId: Id<"issues">, title: string) => Promise<void>;
  updateEstimate: (issueId: Id<"issues">, estimate: string) => Promise<void>;
  deleteIssue: (issueId: Id<"issues">) => Promise<void>;
  reorderIssues: (issueIds: Id<"issues">[]) => Promise<void>;
  exportData: ExportableIssue[] | undefined;
}

export function useIssues({ roomId }: UseIssuesProps): UseIssuesReturn {
  // Queries
  const issues = useQuery(api.issues.list, { roomId });
  const currentIssue = useQuery(api.issues.getCurrent, { roomId });
  const exportData = useQuery(api.issues.getForExport, { roomId });

  // Mutations
  const createMutation = useMutation(api.issues.create);
  const startVotingMutation = useMutation(api.issues.startVoting);
  const clearCurrentIssueMutation = useMutation(api.issues.clearCurrentIssue);
  const updateTitleMutation = useMutation(api.issues.updateTitle);
  const updateEstimateMutation = useMutation(api.issues.updateEstimate);
  const deleteMutation = useMutation(api.issues.remove);
  const reorderMutation = useMutation(api.issues.reorder);

  const createIssue = useCallback(
    async (title: string) => {
      return await createMutation({ roomId, title });
    },
    [createMutation, roomId]
  );

  const startVoting = useCallback(
    async (issueId: Id<"issues">) => {
      await startVotingMutation({ roomId, issueId });
    },
    [startVotingMutation, roomId]
  );

  const switchToQuickVote = useCallback(async () => {
    await clearCurrentIssueMutation({ roomId });
  }, [clearCurrentIssueMutation, roomId]);

  const updateTitle = useCallback(
    async (issueId: Id<"issues">, title: string) => {
      await updateTitleMutation({ issueId, title });
    },
    [updateTitleMutation]
  );

  const updateEstimate = useCallback(
    async (issueId: Id<"issues">, estimate: string) => {
      await updateEstimateMutation({ issueId, finalEstimate: estimate });
    },
    [updateEstimateMutation]
  );

  const deleteIssue = useCallback(
    async (issueId: Id<"issues">) => {
      await deleteMutation({ issueId });
    },
    [deleteMutation]
  );

  const reorderIssues = useCallback(
    async (issueIds: Id<"issues">[]) => {
      await reorderMutation({ roomId, issueIds });
    },
    [reorderMutation, roomId]
  );

  return {
    issues: issues ?? [],
    currentIssue: currentIssue ?? null,
    isQuickVoteMode: !currentIssue,
    isLoading: issues === undefined,
    createIssue,
    startVoting,
    switchToQuickVote,
    updateTitle,
    updateEstimate,
    deleteIssue,
    reorderIssues,
    exportData,
  };
}
