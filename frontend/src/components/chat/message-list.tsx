import { MessageType, MessageList as RCEMessageList } from "react-chat-elements";
import { useRef } from "react";
import style from "./style.module.scss";
import moment from "moment";

export interface Message extends Pick<MessageType, "id" | "text" | "date" | "status" | "title"> {
  isSelf: boolean;
}

export interface MessageListProps {
  items: Message[];
}

function MessageList(props: MessageListProps) {
  const inputReferance = useRef();

  return (
    <>
      <RCEMessageList
        referance={inputReferance}
        className={style["message-list"]}
        lockable={false}
        customProps={{
          MessageList: {},
        }}
        toBottomHeight={100}
        dataSource={(props.items || []).map((item) => ({
          ...item,
          position: item.isSelf ? "right" : "left",
          type: "text",
          focus: false,
          forwarded: false,
          notch: false,
          removeButton: false,
          replyButton: false,
          retracted: false,
          titleColor: "black",
          dateString: moment(item.date).locale("fr").format("HH:mm DD.MM.YYYY")!,
        }))}
      />
    </>
  );
}

export default MessageList;
