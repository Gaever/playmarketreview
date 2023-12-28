import Hydrate from "@/components/Hydrate";
import { prefetchProfile } from "@/lib/services/profile/prefetch-profile";
import ClientContainer from "./client-container";

async function Page() {
  await prefetchProfile();

  return (
    <Hydrate>
      <ClientContainer
        routes={{
          edit: "/profile/edit",
          notificationsSettings: "/profile/notifications-settings",
          transactions: "/profile/transactions",
        }}
      />
    </Hydrate>
  );
}

export default Page;
