export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  UUID: string;
};

export type Deck = {
  __typename?: "Deck";
  cards: Array<Scalars["String"]>;
  id: Scalars["UUID"];
};

export type Game = {
  __typename?: "Game";
  id: Scalars["UUID"];
  table: Array<UserCard>;
};

export type MutationRoot = {
  __typename?: "MutationRoot";
  createRoom: Room;
  createUser: User;
  editUser: User;
  joinRoom: Room;
  logout: Scalars["Boolean"];
  pickCard: Room;
  resetGame: Room;
  showCards: Room;
};

export type MutationRootCreateRoomArgs = {
  name?: InputMaybe<Scalars["String"]>;
};

export type MutationRootCreateUserArgs = {
  username: Scalars["String"];
};

export type MutationRootEditUserArgs = {
  userId: Scalars["UUID"];
  username: Scalars["String"];
};

export type MutationRootJoinRoomArgs = {
  roomId: Scalars["UUID"];
  user: UserInput;
};

export type MutationRootLogoutArgs = {
  userId: Scalars["UUID"];
};

export type MutationRootPickCardArgs = {
  card: Scalars["String"];
  roomId: Scalars["UUID"];
  userId: Scalars["UUID"];
};

export type MutationRootResetGameArgs = {
  roomId: Scalars["UUID"];
};

export type MutationRootShowCardsArgs = {
  roomId: Scalars["UUID"];
};

export type QueryRoot = {
  __typename?: "QueryRoot";
  rooms: Array<Room>;
  userRooms: Array<Room>;
};

export type QueryRootUserRoomsArgs = {
  userId: Scalars["UUID"];
};

export type Room = {
  __typename?: "Room";
  deck: Deck;
  game: Game;
  id: Scalars["UUID"];
  isGameOver: Scalars["Boolean"];
  name?: Maybe<Scalars["String"]>;
  users: Array<User>;
};

export type SubscriptionRoot = {
  __typename?: "SubscriptionRoot";
  room: Room;
};

export type SubscriptionRootRoomArgs = {
  roomId: Scalars["UUID"];
};

export type User = {
  __typename?: "User";
  id: Scalars["UUID"];
  username: Scalars["String"];
};

export type UserCard = {
  __typename?: "UserCard";
  card?: Maybe<Scalars["String"]>;
  userId: Scalars["UUID"];
};

export type UserInput = {
  id: Scalars["UUID"];
  username: Scalars["String"];
};
