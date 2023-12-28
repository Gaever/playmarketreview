import Hydrate from "@/components/Hydrate";
import { prefetchProfile } from "@/lib/services/profile/prefetch-profile";
import ClientContainer from "./client-container";

async function Page(props: { params: { id: string } }) {
  await prefetchProfile({ userId: props.params.id });

  return (
    <Hydrate>
      <ClientContainer userId={props.params.id} />
    </Hydrate>
  );
}

export default Page;
