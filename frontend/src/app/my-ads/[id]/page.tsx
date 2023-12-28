import { prefetchMyAd } from "@/lib/services/my-ad/prefetch-my-ad";
import Hydrate from "@/components/Hydrate";
import ClientContainer from "./client-container";
import { prefetchCities } from "@/lib/services/cities/prefetch-cities";
import { prefetchPlaces } from "@/lib/services/cities/prefetch-places";

async function Page(props: { params: { id: string } }) {
  await prefetchMyAd({ adId: props.params.id });
  await prefetchCities();
  await prefetchPlaces();

  return (
    <Hydrate>
      <ClientContainer />
    </Hydrate>
  );
}

export default Page;
