"use client";

import ChatList from "@/components/chat-list/chat-list";
import { composeChatHref } from "@/lib/compose-href";
import { useChatList } from "@/lib/services/chat/use-chat-list";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";
import { useEffect } from "react";
import "react-chat-elements/dist/main.css";

export interface ClientContainerProps {}

const ClientContainer: React.FC<ClientContainerProps> = (_props) => {
  const router = useRouter();
  const { chatList, isChatListQueriesLoading, chatListSub } = useChatList();

  useEffect(() => {
    if (!chatListSub.data) {
      NProgress.start();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (chatListSub.data || !chatListSub.loading) {
      NProgress.done();
    }
  }, [chatListSub.data, chatListSub.loading]);

  if (chatListSub.loading || isChatListQueriesLoading) {
    return (
      <div className="h-100 w-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  return (
    <>
      <ChatList
        onClick={(item) => {
          router.push(composeChatHref({ targetUserId: `${item.id}` }));
        }}
        dataSource={chatList}
        id="chat-list"
        lazyLoadingImage=""
      />
      {chatList.length < 1 ? (
        <div className="d-flex h-100 w-100 flex-column align-items-center justify-content-center">
          <p className="fw-semibold fs-4 text-center">Here will be chats with your customers and sellers</p>
        </div>
      ) : null}
    </>
  );
};

export default ClientContainer;
