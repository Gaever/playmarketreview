import { prefetchCategories } from "@/lib/services/categories/prefetch-categories";
import { ClientContainer } from "./client-container";
import Hydrate from "@/components/Hydrate";
import { prefetchCities } from "@/lib/services/cities/prefetch-cities";
import { prefetchPlaces } from "@/lib/services/cities/prefetch-places";

async function Page() {
  await prefetchCategories();
  await prefetchCities();
  await prefetchPlaces();

  return (
    <Hydrate>
      <ClientContainer />
    </Hydrate>
  );
}

export default Page;
