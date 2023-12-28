import Hydrate from "@/components/Hydrate";
import { prefetchProfile } from "@/lib/services/profile/prefetch-profile";
import EditProfile from "./edit-profile-client-container";

export interface PageProps {}

const Page = async (_props: PageProps) => {
  await prefetchProfile();

  return (
    <Hydrate>
      <EditProfile />
    </Hydrate>
  );
};

export default Page;
