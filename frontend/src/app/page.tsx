import Hydrate from "@/components/Hydrate";
import { prefetchCategories } from "@/lib/services/categories/prefetch-categories";
import { prefetchFavorites } from "@/lib/services/favorites/prefetch-favorites";
import { prefetchWares } from "@/lib/services/wares/prefetch-wares";
import ClientContainer from "./client-container";
import { prefetchCities } from "@/lib/services/cities/prefetch-cities";
import { prefetchPlaces } from "@/lib/services/cities/prefetch-places";

export default async function Page() {
  await prefetchWares();
  await prefetchCategories();
  await prefetchFavorites();
  await prefetchCities();
  await prefetchPlaces();

  return (
    <Hydrate>
      <ClientContainer />
    </Hydrate>
  );
}
