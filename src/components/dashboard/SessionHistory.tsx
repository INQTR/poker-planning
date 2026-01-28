"use client";

import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Users, Target, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SessionSummary {
  roomId: string;
  roomName: string;
  joinedAt: number;
  lastActivityAt: number;
  issuesCompleted: number;
  totalStoryPoints: number | null;
  averageAgreement: number | null;
}

interface SessionHistoryProps {
  sessions: SessionSummary[];
  isLoading?: boolean;
}

export function SessionHistory({ sessions, isLoading }: SessionHistoryProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Session History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 rounded-lg bg-muted" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Session History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">
            <Users className="mx-auto mb-2 h-8 w-8 opacity-50" />
            <p>No sessions yet</p>
            <p className="text-sm">
              Join a planning room to start tracking your sessions
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Session History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sessions.map((session) => (
            <Link
              key={session.roomId}
              href={`/room/${session.roomId}`}
              className="group flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium">
                    {session.roomName}
                  </span>
                  <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-50" />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {formatDistanceToNow(session.lastActivityAt, {
                    addSuffix: true,
                  })}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Target className="h-4 w-4" />
                  <span>{session.issuesCompleted}</span>
                </div>

                {session.totalStoryPoints !== null && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span>{session.totalStoryPoints} pts</span>
                  </div>
                )}

                {session.averageAgreement !== null && (
                  <div
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      session.averageAgreement >= 80
                        ? "bg-green-100 text-green-700 dark:bg-status-success-bg dark:text-status-success-fg"
                        : session.averageAgreement >= 60
                          ? "bg-amber-100 text-amber-700 dark:bg-status-warning-bg dark:text-status-warning-fg"
                          : "bg-red-100 text-red-700 dark:bg-status-error-bg dark:text-status-error-fg"
                    }`}
                  >
                    {session.averageAgreement}%
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
