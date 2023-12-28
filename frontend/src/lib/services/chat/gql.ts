import { gql } from "@apollo/client";

export const CHAT_LIST_SUB = gql`
  subscription chatRooms($currentUserId: bigint) {
    chat_rooms(
      order_by: { chat_messages_aggregate: { max: { created_at: desc } } }
      where: {
        chat_rooms_users__links: {
          userId: { _eq: $currentUserId }
          chat_room: { chat_rooms_users__links: { userId: { _neq: $currentUserId } } }
        }
        status: { _in: ["open", "closed"] }
      }
    ) {
      id
      status
      created_at
      chat_messages(order_by: { created_at: desc }) {
        id
        text
        variant
        created_at
        author_user_id
      }
      messages_reads(where: { user_id: { _eq: $currentUserId } }) {
        last_read_message_id
      }
      chat_rooms_users__links(where: { userId: { _neq: $currentUserId } }) {
        userId
      }
    }
  }
`;

export const READ_LAST_MESSAGE_MUTATION = gql`
  mutation readLastChatMessage($last_read_message_id: uuid, $chat_room_id: uuid, $user_id: bigint) {
    insert_messages_read_one(
      object: { last_read_message_id: $last_read_message_id, chat_room_id: $chat_room_id, user_id: $user_id }
      on_conflict: { constraint: messages_read_pkey, update_columns: last_read_message_id }
    ) {
      chat_room_id
    }
  }
`;

export interface CHAT_LIST_SUB_RES {
  chat_rooms: {
    id: string;
    status: string;
    created_at: Date;
    chat_messages: {
      id: string;
      text: string;
      variant: string;
      created_at: Date;
      author_user_id: string;
    }[];
    messages_reads: {
      last_read_message_id: string;
    }[];
    chat_rooms_users__links: {
      userId: string;
    }[];
  }[];
}

export const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($messageId: uuid, $author_user_id: bigint, $chat_room_id: uuid = "", $text: String = "") {
    insert_chat_message_one(
      object: { id: $messageId, author_user_id: $author_user_id, chat_room_id: $chat_room_id, text: $text }
    ) {
      id
    }
  }
`;

export interface SEND_MESSAGE_MUTATION_RES {
  insert_chat_message_one: {
    id: string;
  };
}
