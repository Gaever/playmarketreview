"use-client";

import { MessageListProps } from "@/components/chat/message-list";
import errorHandler from "@/lib/error-handler";
import localTime from "@/lib/local-time";
import { useAuth } from "@/lib/services/auth/use-auth";
import { useProfile } from "@/lib/services/profile/use-profile";
import { useMutation, useSubscription } from "@apollo/client";
import {
  CHAT_LIST_SUB,
  CHAT_LIST_SUB_RES,
  READ_LAST_MESSAGE_MUTATION,
  SEND_MESSAGE_MUTATION,
  SEND_MESSAGE_MUTATION_RES,
} from "./gql";
import { v4 as uuid } from "uuid";
import { useCallback, useEffect } from "react";

export function useChat(props: { chatRoomId: string; targetUserId: string }) {
  const { userId } = useAuth();
  const chatListSub = useSubscription<CHAT_LIST_SUB_RES>(CHAT_LIST_SUB, {
    onError: errorHandler,
    skip: !userId,
    variables: {
      currentUserId: userId,
    },
  });

  const { profileQuery: targetProfileQuery } = useProfile({ userId: props.targetUserId });
  const { profileQuery: myProfileQuery, claimWareMutation } = useProfile();

  const chatRoom = chatListSub?.data?.chat_rooms?.find((room) => room.id === props.chatRoomId);

  const messages: MessageListProps["items"] = [...(chatRoom?.chat_messages || [])].reverse().map((item) => {
    const isSelf = `${item.author_user_id}` === `${userId}`;
    return {
      date: localTime(item.created_at).toDate(),
      id: item.id,
      isSelf,
      status: "read",
      text: item.text,
      title: (isSelf ? myProfileQuery.data?.userName : targetProfileQuery.data?.userName) || "",
    };
  });

  const sendMessageMutation = useMutation<SEND_MESSAGE_MUTATION_RES>(SEND_MESSAGE_MUTATION, {
    onError: errorHandler,
  });

  const sendMessage = (text: string) => {
    sendMessageMutation[0]({
      variables: {
        messageId: uuid(),
        author_user_id: userId,
        chat_room_id: props.chatRoomId,
        text,
      },
    });
  };

  const readLastMessageMutation = useMutation(READ_LAST_MESSAGE_MUTATION, {
    onError: console.error,
  });

  const readLastChatMessage = useCallback(() => {
    const lastMessageId = chatRoom?.chat_messages?.[0]?.id;
    const chatRoomId = chatRoom?.id;
    const [mutate] = readLastMessageMutation;

    if (lastMessageId && chatRoomId) {
      mutate({
        variables: {
          last_read_message_id: lastMessageId,
          chat_room_id: chatRoomId,
          user_id: userId,
        },
      });
    }
  }, [chatRoom, userId, readLastMessageMutation]);

  useEffect(() => {
    readLastChatMessage();
    // eslint-disable-next-line
  }, [chatRoom?.chat_messages?.length, chatRoom]);

  return { chatListSub, chatRoom, messages, sendMessageMutation, targetProfileQuery, claimWareMutation, sendMessage };
}
