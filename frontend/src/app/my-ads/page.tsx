import Hydrate from "@/components/Hydrate";
import { prefetchMyAds } from "@/lib/services/my-ads/prefetch-my-ads";
import MyAdsClientContainer from "./client-container";

export default async function Page() {
  await prefetchMyAds();

  return (
    <Hydrate>
      <MyAdsClientContainer />
    </Hydrate>
  );
}
