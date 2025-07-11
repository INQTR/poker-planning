import * as Types from "../types/types.generated";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type UserFragmentFragment = {
  __typename?: "User";
  id: string;
  username: string;
};

export type DeckFragmentFragment = {
  __typename?: "Deck";
  id: string;
  cards: Array<string>;
};

export type UserCardFragmentFragment = {
  __typename?: "UserCard";
  userId: string;
  card?: string | null;
};

export type GameFragmentFragment = {
  __typename?: "Game";
  id: string;
  table: Array<{
    __typename?: "UserCard";
    userId: string;
    card?: string | null;
  }>;
};

export type RoomFragmentFragment = {
  __typename?: "Room";
  id: string;
  name?: string | null;
  isGameOver: boolean;
  users: Array<{ __typename?: "User"; id: string; username: string }>;
  deck: { __typename?: "Deck"; id: string; cards: Array<string> };
  game: {
    __typename?: "Game";
    id: string;
    table: Array<{
      __typename?: "UserCard";
      userId: string;
      card?: string | null;
    }>;
  };
};

export type CreateRoomMutationVariables = Types.Exact<{
  name?: Types.InputMaybe<Types.Scalars["String"]>;
}>;

export type CreateRoomMutation = {
  __typename?: "MutationRoot";
  createRoom: {
    __typename?: "Room";
    id: string;
    name?: string | null;
    isGameOver: boolean;
    users: Array<{ __typename?: "User"; id: string; username: string }>;
    deck: { __typename?: "Deck"; id: string; cards: Array<string> };
    game: {
      __typename?: "Game";
      id: string;
      table: Array<{
        __typename?: "UserCard";
        userId: string;
        card?: string | null;
      }>;
    };
  };
};

export type CreateUserMutationVariables = Types.Exact<{
  username: Types.Scalars["String"];
}>;

export type CreateUserMutation = {
  __typename?: "MutationRoot";
  createUser: { __typename?: "User"; id: string; username: string };
};

export type JoinRoomMutationVariables = Types.Exact<{
  roomId: Types.Scalars["UUID"];
  user: Types.UserInput;
}>;

export type JoinRoomMutation = {
  __typename?: "MutationRoot";
  joinRoom: {
    __typename?: "Room";
    id: string;
    name?: string | null;
    isGameOver: boolean;
    users: Array<{ __typename?: "User"; id: string; username: string }>;
    deck: { __typename?: "Deck"; id: string; cards: Array<string> };
    game: {
      __typename?: "Game";
      id: string;
      table: Array<{
        __typename?: "UserCard";
        userId: string;
        card?: string | null;
      }>;
    };
  };
};

export type EditUserMutationVariables = Types.Exact<{
  userId: Types.Scalars["UUID"];
  username: Types.Scalars["String"];
}>;

export type EditUserMutation = {
  __typename?: "MutationRoot";
  editUser: { __typename?: "User"; id: string; username: string };
};

export type LogoutMutationVariables = Types.Exact<{
  userId: Types.Scalars["UUID"];
}>;

export type LogoutMutation = { __typename?: "MutationRoot"; logout: boolean };

export type PickCardMutationVariables = Types.Exact<{
  userId: Types.Scalars["UUID"];
  roomId: Types.Scalars["UUID"];
  card: Types.Scalars["String"];
}>;

export type PickCardMutation = {
  __typename?: "MutationRoot";
  pickCard: {
    __typename?: "Room";
    id: string;
    name?: string | null;
    isGameOver: boolean;
    users: Array<{ __typename?: "User"; id: string; username: string }>;
    deck: { __typename?: "Deck"; id: string; cards: Array<string> };
    game: {
      __typename?: "Game";
      id: string;
      table: Array<{
        __typename?: "UserCard";
        userId: string;
        card?: string | null;
      }>;
    };
  };
};

export type ShowCardsMutationVariables = Types.Exact<{
  roomId: Types.Scalars["UUID"];
}>;

export type ShowCardsMutation = {
  __typename?: "MutationRoot";
  showCards: {
    __typename?: "Room";
    id: string;
    name?: string | null;
    isGameOver: boolean;
    users: Array<{ __typename?: "User"; id: string; username: string }>;
    deck: { __typename?: "Deck"; id: string; cards: Array<string> };
    game: {
      __typename?: "Game";
      id: string;
      table: Array<{
        __typename?: "UserCard";
        userId: string;
        card?: string | null;
      }>;
    };
  };
};

export type ResetGameMutationVariables = Types.Exact<{
  roomId: Types.Scalars["UUID"];
}>;

export type ResetGameMutation = {
  __typename?: "MutationRoot";
  resetGame: {
    __typename?: "Room";
    id: string;
    name?: string | null;
    isGameOver: boolean;
    users: Array<{ __typename?: "User"; id: string; username: string }>;
    deck: { __typename?: "Deck"; id: string; cards: Array<string> };
    game: {
      __typename?: "Game";
      id: string;
      table: Array<{
        __typename?: "UserCard";
        userId: string;
        card?: string | null;
      }>;
    };
  };
};

export type RoomSubscriptionVariables = Types.Exact<{
  roomId: Types.Scalars["UUID"];
}>;

export type RoomSubscription = {
  __typename?: "SubscriptionRoot";
  room: {
    __typename?: "Room";
    id: string;
    name?: string | null;
    isGameOver: boolean;
    users: Array<{ __typename?: "User"; id: string; username: string }>;
    deck: { __typename?: "Deck"; id: string; cards: Array<string> };
    game: {
      __typename?: "Game";
      id: string;
      table: Array<{
        __typename?: "UserCard";
        userId: string;
        card?: string | null;
      }>;
    };
  };
};

export const UserFragmentFragmentDoc = gql`
  fragment UserFragment on User {
    id
    username
  }
`;
export const DeckFragmentFragmentDoc = gql`
  fragment DeckFragment on Deck {
    id
    cards
  }
`;
export const UserCardFragmentFragmentDoc = gql`
  fragment UserCardFragment on UserCard {
    userId
    card
  }
`;
export const GameFragmentFragmentDoc = gql`
  fragment GameFragment on Game {
    id
    table {
      ...UserCardFragment
    }
  }
  ${UserCardFragmentFragmentDoc}
`;
export const RoomFragmentFragmentDoc = gql`
  fragment RoomFragment on Room {
    id
    name
    isGameOver
    users {
      ...UserFragment
    }
    deck {
      ...DeckFragment
    }
    game {
      ...GameFragment
    }
  }
  ${UserFragmentFragmentDoc}
  ${DeckFragmentFragmentDoc}
  ${GameFragmentFragmentDoc}
`;
export const CreateRoomDocument = gql`
  mutation CreateRoom($name: String) {
    createRoom(name: $name) {
      ...RoomFragment
    }
  }
  ${RoomFragmentFragmentDoc}
`;
export type CreateRoomMutationFn = Apollo.MutationFunction<
  CreateRoomMutation,
  CreateRoomMutationVariables
>;

/**
 * __useCreateRoomMutation__
 *
 * To run a mutation, you first call `useCreateRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRoomMutation, { data, loading, error }] = useCreateRoomMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateRoomMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateRoomMutation,
    CreateRoomMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateRoomMutation, CreateRoomMutationVariables>(
    CreateRoomDocument,
    options,
  );
}
export type CreateRoomMutationHookResult = ReturnType<
  typeof useCreateRoomMutation
>;
export type CreateRoomMutationResult =
  Apollo.MutationResult<CreateRoomMutation>;
export type CreateRoomMutationOptions = Apollo.BaseMutationOptions<
  CreateRoomMutation,
  CreateRoomMutationVariables
>;
export const CreateUserDocument = gql`
  mutation CreateUser($username: String!) {
    createUser(username: $username) {
      ...UserFragment
    }
  }
  ${UserFragmentFragmentDoc}
`;
export type CreateUserMutationFn = Apollo.MutationFunction<
  CreateUserMutation,
  CreateUserMutationVariables
>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useCreateUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateUserMutation,
    CreateUserMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(
    CreateUserDocument,
    options,
  );
}
export type CreateUserMutationHookResult = ReturnType<
  typeof useCreateUserMutation
>;
export type CreateUserMutationResult =
  Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<
  CreateUserMutation,
  CreateUserMutationVariables
>;
export const JoinRoomDocument = gql`
  mutation JoinRoom($roomId: UUID!, $user: UserInput!) {
    joinRoom(roomId: $roomId, user: $user) {
      ...RoomFragment
    }
  }
  ${RoomFragmentFragmentDoc}
`;
export type JoinRoomMutationFn = Apollo.MutationFunction<
  JoinRoomMutation,
  JoinRoomMutationVariables
>;

/**
 * __useJoinRoomMutation__
 *
 * To run a mutation, you first call `useJoinRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinRoomMutation, { data, loading, error }] = useJoinRoomMutation({
 *   variables: {
 *      roomId: // value for 'roomId'
 *      user: // value for 'user'
 *   },
 * });
 */
export function useJoinRoomMutation(
  baseOptions?: Apollo.MutationHookOptions<
    JoinRoomMutation,
    JoinRoomMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<JoinRoomMutation, JoinRoomMutationVariables>(
    JoinRoomDocument,
    options,
  );
}
export type JoinRoomMutationHookResult = ReturnType<typeof useJoinRoomMutation>;
export type JoinRoomMutationResult = Apollo.MutationResult<JoinRoomMutation>;
export type JoinRoomMutationOptions = Apollo.BaseMutationOptions<
  JoinRoomMutation,
  JoinRoomMutationVariables
>;
export const EditUserDocument = gql`
  mutation EditUser($userId: UUID!, $username: String!) {
    editUser(userId: $userId, username: $username) {
      ...UserFragment
    }
  }
  ${UserFragmentFragmentDoc}
`;
export type EditUserMutationFn = Apollo.MutationFunction<
  EditUserMutation,
  EditUserMutationVariables
>;

/**
 * __useEditUserMutation__
 *
 * To run a mutation, you first call `useEditUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editUserMutation, { data, loading, error }] = useEditUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      username: // value for 'username'
 *   },
 * });
 */
export function useEditUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    EditUserMutation,
    EditUserMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<EditUserMutation, EditUserMutationVariables>(
    EditUserDocument,
    options,
  );
}
export type EditUserMutationHookResult = ReturnType<typeof useEditUserMutation>;
export type EditUserMutationResult = Apollo.MutationResult<EditUserMutation>;
export type EditUserMutationOptions = Apollo.BaseMutationOptions<
  EditUserMutation,
  EditUserMutationVariables
>;
export const LogoutDocument = gql`
  mutation Logout($userId: UUID!) {
    logout(userId: $userId)
  }
`;
export type LogoutMutationFn = Apollo.MutationFunction<
  LogoutMutation,
  LogoutMutationVariables
>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useLogoutMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LogoutMutation,
    LogoutMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(
    LogoutDocument,
    options,
  );
}
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<
  LogoutMutation,
  LogoutMutationVariables
>;
export const PickCardDocument = gql`
  mutation PickCard($userId: UUID!, $roomId: UUID!, $card: String!) {
    pickCard(userId: $userId, roomId: $roomId, card: $card) {
      ...RoomFragment
    }
  }
  ${RoomFragmentFragmentDoc}
`;
export type PickCardMutationFn = Apollo.MutationFunction<
  PickCardMutation,
  PickCardMutationVariables
>;

/**
 * __usePickCardMutation__
 *
 * To run a mutation, you first call `usePickCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePickCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pickCardMutation, { data, loading, error }] = usePickCardMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      roomId: // value for 'roomId'
 *      card: // value for 'card'
 *   },
 * });
 */
export function usePickCardMutation(
  baseOptions?: Apollo.MutationHookOptions<
    PickCardMutation,
    PickCardMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<PickCardMutation, PickCardMutationVariables>(
    PickCardDocument,
    options,
  );
}
export type PickCardMutationHookResult = ReturnType<typeof usePickCardMutation>;
export type PickCardMutationResult = Apollo.MutationResult<PickCardMutation>;
export type PickCardMutationOptions = Apollo.BaseMutationOptions<
  PickCardMutation,
  PickCardMutationVariables
>;
export const ShowCardsDocument = gql`
  mutation ShowCards($roomId: UUID!) {
    showCards(roomId: $roomId) {
      ...RoomFragment
    }
  }
  ${RoomFragmentFragmentDoc}
`;
export type ShowCardsMutationFn = Apollo.MutationFunction<
  ShowCardsMutation,
  ShowCardsMutationVariables
>;

/**
 * __useShowCardsMutation__
 *
 * To run a mutation, you first call `useShowCardsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useShowCardsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [showCardsMutation, { data, loading, error }] = useShowCardsMutation({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useShowCardsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ShowCardsMutation,
    ShowCardsMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<ShowCardsMutation, ShowCardsMutationVariables>(
    ShowCardsDocument,
    options,
  );
}
export type ShowCardsMutationHookResult = ReturnType<
  typeof useShowCardsMutation
>;
export type ShowCardsMutationResult = Apollo.MutationResult<ShowCardsMutation>;
export type ShowCardsMutationOptions = Apollo.BaseMutationOptions<
  ShowCardsMutation,
  ShowCardsMutationVariables
>;
export const ResetGameDocument = gql`
  mutation ResetGame($roomId: UUID!) {
    resetGame(roomId: $roomId) {
      ...RoomFragment
    }
  }
  ${RoomFragmentFragmentDoc}
`;
export type ResetGameMutationFn = Apollo.MutationFunction<
  ResetGameMutation,
  ResetGameMutationVariables
>;

/**
 * __useResetGameMutation__
 *
 * To run a mutation, you first call `useResetGameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetGameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetGameMutation, { data, loading, error }] = useResetGameMutation({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useResetGameMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ResetGameMutation,
    ResetGameMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<ResetGameMutation, ResetGameMutationVariables>(
    ResetGameDocument,
    options,
  );
}
export type ResetGameMutationHookResult = ReturnType<
  typeof useResetGameMutation
>;
export type ResetGameMutationResult = Apollo.MutationResult<ResetGameMutation>;
export type ResetGameMutationOptions = Apollo.BaseMutationOptions<
  ResetGameMutation,
  ResetGameMutationVariables
>;
export const RoomDocument = gql`
  subscription Room($roomId: UUID!) {
    room(roomId: $roomId) {
      ...RoomFragment
    }
  }
  ${RoomFragmentFragmentDoc}
`;

/**
 * __useRoomSubscription__
 *
 * To run a query within a React component, call `useRoomSubscription` and pass it any options that fit your needs.
 * When your component renders, `useRoomSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRoomSubscription({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useRoomSubscription(
  baseOptions: Apollo.SubscriptionHookOptions<
    RoomSubscription,
    RoomSubscriptionVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSubscription<RoomSubscription, RoomSubscriptionVariables>(
    RoomDocument,
    options,
  );
}
export type RoomSubscriptionHookResult = ReturnType<typeof useRoomSubscription>;
export type RoomSubscriptionResult =
  Apollo.SubscriptionResult<RoomSubscription>;
