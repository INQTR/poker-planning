"use client";

import { formatDistanceToNow } from "date-fns";
import { Users, Target, TrendingUp, ArrowRight, Activity, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SessionSummary {
  roomId: string;
  roomName: string;
  joinedAt: number;
  lastActivityAt: number;
  issuesCompleted: number;
  totalStoryPoints: number | null;
  averageAgreement: number | null;
  participantCount: number;
}

interface SessionHistoryProps {
  sessions: SessionSummary[];
  isLoading?: boolean;
}

export function SessionHistory({ sessions, isLoading }: SessionHistoryProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Recent Sessions</h2>
          <p className="text-sm text-muted-foreground">Continue where you left off or review past estimates.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border bg-card p-5 h-[200px]">
              <div className="h-6 w-2/3 bg-muted rounded-md mb-4" />
              <div className="space-y-3">
                <div className="h-4 w-1/2 bg-muted rounded-md" />
                <div className="h-4 w-3/4 bg-muted rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] rounded-2xl border border-dashed p-8 text-center bg-muted/20">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
          <Activity className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No active sessions</h2>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          You haven&apos;t joined any planning rooms yet. Create or join a room to start estimating with your team.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Recent Sessions</h2>
          <p className="text-sm text-muted-foreground mt-1">Pick up where you left off or review past estimates.</p>
        </div>
      </div>
      
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sessions.map((session) => {
          const isHighConsensus = session.averageAgreement !== null && session.averageAgreement >= 80;
          const isMedConsensus = session.averageAgreement !== null && session.averageAgreement >= 60 && session.averageAgreement < 80;
          
          return (
            <Link
              key={session.roomId}
              href={`/room/${session.roomId}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-300 hover:shadow-md hover:border-primary/30"
            >
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              <div className="relative z-10 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Activity className="h-5 w-5" />
                  </div>
                  {session.averageAgreement !== null && (
                    <Tooltip>
                      <TooltipTrigger render={<div className="cursor-default" onClick={(e) => e.preventDefault()} />}>
                        <Badge 
                          variant={isHighConsensus ? "default" : isMedConsensus ? "secondary" : "destructive"}
                          className="font-medium"
                        >
                          <Users className="h-3 w-3 mr-1" />
                          {session.averageAgreement}% Match
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Average team consensus matching</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                
                <h3 className="line-clamp-2 text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
                  {session.roomName}
                </h3>
              </div>

              <div className="relative z-10 mt-auto">
                <div className={`grid gap-4 mb-5 pb-5 border-b border-border/50 ${session.totalStoryPoints !== null ? "grid-cols-3" : "grid-cols-2"}`}>
                  <Tooltip>
                    <TooltipTrigger render={<div className="text-left cursor-default" onClick={(e) => e.preventDefault()} />}>
                      <p className="text-xs text-muted-foreground flex items-center mb-1 whitespace-nowrap">
                        <Target className="h-3 w-3 mr-1 shrink-0" /> Issues
                      </p>
                      <p className="text-base font-medium">{session.issuesCompleted}</p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Total issues estimated</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger render={<div className="text-left cursor-default" onClick={(e) => e.preventDefault()} />}>
                      <p className="text-xs text-muted-foreground flex items-center mb-1 whitespace-nowrap">
                        <Users className="h-3 w-3 mr-1 shrink-0" /> Members
                      </p>
                      <p className="text-base font-medium">{session.participantCount}</p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Total room participants</p>
                    </TooltipContent>
                  </Tooltip>

                  {session.totalStoryPoints !== null && (
                    <Tooltip>
                      <TooltipTrigger render={<div className="text-left cursor-default" onClick={(e) => e.preventDefault()} />}>
                        <p className="text-xs text-muted-foreground flex items-center mb-1 whitespace-nowrap">
                          <TrendingUp className="h-3 w-3 mr-1 shrink-0" /> Points
                        </p>
                        <p className="text-base font-medium">{session.totalStoryPoints}</p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Total story points estimated</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Tooltip>
                    <TooltipTrigger render={<div className="flex items-center text-xs text-muted-foreground cursor-default" onClick={(e) => e.preventDefault()} />}>
                      <Clock className="h-3.5 w-3.5 mr-1.5" />
                      <time dateTime={new Date(session.lastActivityAt).toISOString()}>
                        {formatDistanceToNow(session.lastActivityAt, { addSuffix: true })}
                      </time>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Time since last activity</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0 group-hover:opacity-100">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
