import { ChatList as RCEChatList, IChatListProps } from "react-chat-elements";

export interface ChatListProps extends IChatListProps {}

function ChatList(props: ChatListProps) {
  return <RCEChatList {...props} />;
}

export default ChatList;
