import { Node } from "@xyflow/react";

import { Room, User } from "@/types";

// Node data types
export type PlayerNodeData = {
  user: User;
  isCurrentUser: boolean;
  isCardPicked: boolean;
  card: string | null;
};

export type StoryNodeData = {
  title: string;
  description: string;
  storyId: string;
};

export type TimerNodeData = {
  duration: number;
  isRunning: boolean;
};

export type ControlsNodeData = {
  roomId: string;
  isCardsPicked: boolean;
  isGameOver: boolean;
};

export type VotingCardNodeData = {
  card: { value: string };
  userId: string;
  roomId: string;
  isSelectable: boolean;
  isSelected: boolean;
};

export type ResultsNodeData = {
  votes: Room["game"]["table"];
  users: User[];
};

// Node types
export type PlayerNodeType = Node<PlayerNodeData, "player">;
export type StoryNodeType = Node<StoryNodeData, "story">;
export type TimerNodeType = Node<TimerNodeData, "timer">;
export type ControlsNodeType = Node<ControlsNodeData, "controls">;
export type VotingCardNodeType = Node<VotingCardNodeData, "votingCard">;
export type ResultsNodeType = Node<ResultsNodeData, "results">;

// Union type for all custom nodes
export type CustomNodeType =
  | PlayerNodeType
  | StoryNodeType
  | TimerNodeType
  | ControlsNodeType
  | VotingCardNodeType
  | ResultsNodeType;
