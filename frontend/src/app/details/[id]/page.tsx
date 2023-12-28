import Hydrate from "@/components/Hydrate";
import { prefetchFavorites } from "@/lib/services/favorites/prefetch-favorites";
import { prefetchWare } from "@/lib/services/wares/prefetch-ware";
import ClientContainer from "./client-container";
import { prefetchCities } from "@/lib/services/cities/prefetch-cities";

export default async function AdDetailsPage(props: { params: { id: string } }) {
  await prefetchWare({ wareId: props.params.id });
  await prefetchFavorites();

  return (
    <Hydrate>
      <ClientContainer adId={props.params.id} />
    </Hydrate>
  );
}
