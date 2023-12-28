"use client";

import { ChatListProps } from "@/components/chat-list/chat-list";
import errorHandler from "@/lib/error-handler";
import { http } from "@/lib/http";
import { useAuth } from "@/lib/services/auth/use-auth";
import { useSubscription } from "@apollo/client";
import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import "react-chat-elements/dist/main.css";
import { CHAT_LIST_SUB, CHAT_LIST_SUB_RES } from "./gql";
import localTime from "@/lib/local-time";

export function useChatList(props?: { activeChatTargetUserId?: string }) {
  const { userId } = useAuth();
  const chatListSub = useSubscription<CHAT_LIST_SUB_RES>(CHAT_LIST_SUB, {
    onError: errorHandler,
    skip: !userId,
    variables: {
      currentUserId: userId,
    },
  });

  const profileQueries = useQueries({
    queries: (chatListSub.data?.chat_rooms || []).map((chatRoom) => ({
      queryKey: ["chat-list-profiles", chatRoom.chat_rooms_users__links?.[0]?.userId],
      useErrorBoundary(error: any) {
        errorHandler(error);
        return false;
      },
      queryFn: async () => {
        const { data } = await http.user.getUser({
          userId: chatRoom.chat_rooms_users__links?.[0]?.userId,
        });
        return data;
      },
    })),
  });

  const { profiles, isChatListQueriesLoading } = useMemo(() => {
    let isLoading = false;
    const profiles: Record<string, NonNullable<(typeof profileQueries)[number]["data"]>["data"]> = {};

    profileQueries.forEach((query) => {
      if (query.isLoading) {
        isLoading = true;
      }

      if (query?.data?.data?.id) {
        profiles[query?.data?.data?.id] = query.data.data;
      }
    });

    return { isChatListQueriesLoading: isLoading, profiles };
  }, [profileQueries]);

  const { chatList, unreadChats } = useMemo(() => {
    let unreadChats = 0;

    const chatList: ChatListProps["dataSource"][number][] = [];
    chatListSub.data?.chat_rooms?.map((chatRoom) => {
      const targetUserId = chatRoom.chat_rooms_users__links?.[0]?.userId;
      const lastMessageId = chatRoom?.chat_messages?.[0]?.id;
      const user = profiles?.[targetUserId];
      const isChatUnread =
        !!(chatRoom?.chat_messages?.length ?? 0 > 0) &&
        !!(chatRoom?.messages_reads?.[0]?.last_read_message_id !== lastMessageId) &&
        user?.id?.toString() !== props?.activeChatTargetUserId;

      const chatListItem: ChatListProps["dataSource"][number] = {
        id: user?.id,
        avatar: user?.avatar,
        title: user?.name,
        subtitle: chatRoom?.chat_messages?.[0]?.text,
        unread: isChatUnread ? 1 : 0,
        // dateString: localTime(chatRoom?.chat_messages?.[0]?.created_at).toLocaleString()!,
        date: localTime(chatRoom?.chat_messages?.[0]?.created_at).toDate()!,
        dateString: localTime(chatRoom?.chat_messages?.[0]?.created_at).format("HH:mm DD.MM.YYYY ")!,
      };

      chatList.push(chatListItem);
      if (isChatUnread) {
        unreadChats++;
      }
    });

    return {
      chatList,
      unreadChats,
    };
  }, [chatListSub, profiles, props?.activeChatTargetUserId]);

  return { chatListSub, chatList, isChatListQueriesLoading, unreadChats };
}
