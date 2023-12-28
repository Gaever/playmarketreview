"use client";

import ChatInput from "@/components/chat/chat-input";
import MessageList from "@/components/chat/message-list";
import Header from "@/components/header/header";
import { composeTargetProfileHref } from "@/lib/compose-href";
import { useChat } from "@/lib/services/chat/use-chat";
import NProgress from "nprogress";
import { useEffect, useState } from "react";
import "react-chat-elements/dist/main.css";
import style from "./page.module.scss";
import { Shield } from "react-bootstrap-icons";
import Claim from "@/components/claim/Claim";
import errorHandler from "@/lib/error-handler";

export interface ClientContainerProps {
  targetUserId: string;
  chatRoomId: string;
}

function ClientContainer(props: ClientContainerProps) {
  const { chatListSub, sendMessageMutation, targetProfileQuery, messages, claimWareMutation, sendMessage } = useChat({
    chatRoomId: props.chatRoomId,
    targetUserId: props.targetUserId,
  });
  const [isReportDisplayed, setIsReportDisplayed] = useState(false);

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

  return (
    <div className={`h-100 overflow-hidden ${style.container}`}>
      <Header
        title={targetProfileQuery.data?.userName}
        titleHref={composeTargetProfileHref({ targetUserId: props.targetUserId })}
        rightButtons={
          <Shield
            onClick={() => {
              setIsReportDisplayed(true);
            }}
          />
        }
      />

      <Claim
        isOpen={isReportDisplayed}
        isReportButtonDisplayed={false}
        onClaimSubmit={async (form) => {
          try {
            const message = `Reason: ${form.reason}${form.message ? `. Message: ${form.message}` : ""}`;
            await claimWareMutation.mutateAsync({ bastard_id: props.targetUserId, message });
          } catch (error) {
            errorHandler(error);
          }
        }}
        onHide={() => {
          setIsReportDisplayed(false);
        }}
        variant="ware"
        title="Report trader"
      />

      <MessageList items={messages} />
      {(messages?.length ?? 0) < 1 && chatListSub.loading ? (
        <div className="h-100 w-100 d-flex align-items-center justify-content-center">
          <div className="spinner-border" role="status"></div>
        </div>
      ) : null}
      {(messages?.length ?? 0) < 1 && !chatListSub.loading ? (
        <div className="d-flex h-100 w-100 flex-column align-items-center justify-content-center">
          <p className="fw-semibold fs-4">Let&lsquo;s start conversation</p>
        </div>
      ) : null}
      <div className={`fixed-bottom ${style.input}`}>
        <ChatInput onSubmit={sendMessage} disabled={sendMessageMutation[1].loading} />
      </div>
    </div>
  );
}

export default ClientContainer;
