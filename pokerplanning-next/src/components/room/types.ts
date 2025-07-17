import { Node } from "@xyflow/react";

// Node data types
export type PlayerNodeData = {
  user: any; // Will be typed properly when Convex types are generated
  isCurrentUser: boolean;
  isCardPicked: boolean;
  card: string | null;
};

export type StoryNodeData = {
  title: string;
  description: string;
  storyId: string;
  isGameOver?: boolean;
  hasVotes?: boolean;
  onRevealCards?: () => void;
  onResetGame?: () => void;
};

export type SessionNodeData = {
  sessionName: string;
  participantCount: number;
  voteCount: number;
  isVotingComplete: boolean;
  hasVotes: boolean;
  onRevealCards?: () => void;
  onResetGame?: () => void;
};

export type TimerNodeData = {
  duration: number;
  isRunning: boolean;
};

export type VotingCardNodeData = {
  card: { value: string };
  userId: string;
  roomId: string;
  isSelectable: boolean;
  isSelected: boolean;
  onCardSelect?: (cardValue: string) => void;
};

export type ResultsNodeData = {
  votes: any[]; // Will be typed properly when Convex types are generated
  users: any[]; // Will be typed properly when Convex types are generated
};

// Node types
export type PlayerNodeType = Node<PlayerNodeData, "player">;
export type StoryNodeType = Node<StoryNodeData, "story">;
export type SessionNodeType = Node<SessionNodeData, "session">;
export type TimerNodeType = Node<TimerNodeData, "timer">;
export type VotingCardNodeType = Node<VotingCardNodeData, "votingCard">;
export type ResultsNodeType = Node<ResultsNodeData, "results">;

// Union type for all custom nodes
export type CustomNodeType =
  | PlayerNodeType
  | StoryNodeType
  | SessionNodeType
  | TimerNodeType
  | VotingCardNodeType
  | ResultsNodeType;