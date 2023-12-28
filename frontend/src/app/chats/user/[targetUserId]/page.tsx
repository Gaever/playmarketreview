import { getServersideAuth } from "@/lib/services/auth/get-serverside-auth";
import { getOrCreateChatRoom } from "@/lib/services/chat/chat";
import ClientContainer from "./client-container";
import { prefetchProfile } from "@/lib/services/profile/prefetch-profile";
import Hydrate from "@/components/Hydrate";

async function Page(props: { params: { targetUserId: string } }) {
  const { userId } = getServersideAuth({ redirectOnUnauthorized: "/profile" });
  const targetUserId = props.params.targetUserId;

  const { chatRoomId } = await getOrCreateChatRoom({ currentUserId: userId, targetUserId });
  await prefetchProfile({ userId: targetUserId });
  await prefetchProfile();

  return (
    <Hydrate>
      <ClientContainer targetUserId={targetUserId} chatRoomId={chatRoomId} />
    </Hydrate>
  );
}

export default Page;
