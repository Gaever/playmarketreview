export const composeTargetProfileHref = (args: { targetUserId: string }) =>
  args.targetUserId ? `/trader/${args.targetUserId}` : "";
export const composeChatHref = (args: { targetUserId: string }) =>
  args.targetUserId ? `/chats/user/${args.targetUserId}` : "";
export const wareDetailsHref = (args: { itemId: string }) => `/details/${args.itemId}`;
