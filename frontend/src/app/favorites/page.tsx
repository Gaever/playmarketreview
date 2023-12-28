import { prefetchFavorites } from "@/lib/services/favorites/prefetch-favorites";
import ClientContainer from "./client-container";
import Hydrate from "@/components/Hydrate";

async function Page() {
  await prefetchFavorites();

  return (
    <Hydrate>
      <ClientContainer />
    </Hydrate>
  );
}

export default Page;
