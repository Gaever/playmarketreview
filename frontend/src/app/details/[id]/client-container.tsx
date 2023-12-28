"use client";

import { composeChatHref, composeTargetProfileHref } from "@/lib/compose-href";
import errorHandler from "@/lib/error-handler";
import { useAuth } from "@/lib/services/auth/use-auth";
import { useFavorites } from "@/lib/services/favorites/use-favorites";
import { useWare } from "@/lib/services/wares/use-ware";
import AdDetails from "./ad-details";

export interface AdDetailsClientContainerProps {
  adId: string;
}

function rearrangeArray<T>(arrayOfObjects: T[], index: number): T[] {
  if (index < 0 || index >= arrayOfObjects.length) {
    return [];
  }

  // Move the specified index to the front
  const newArray = [arrayOfObjects[index], ...arrayOfObjects.slice(0, index), ...arrayOfObjects.slice(index + 1)];
  return newArray;
}
export default function ClientContainer(props: AdDetailsClientContainerProps) {
  const { favoriteIds, onFavoriteClick } = useFavorites();
  const { userId, withRedirectOnUnauthorized } = useAuth();
  const { wareQuery, claimWareMutation } = useWare({ wareId: props.adId });
  const isMyAd = userId === wareQuery.data?.seller?.id;
  const ad: typeof wareQuery.data = wareQuery.data
    ? {
        ...wareQuery.data,
        photos: rearrangeArray(wareQuery.data.photos || [], wareQuery.data.titleImageIndex ?? 0),
      }
    : undefined;
  console.log(`ad ${JSON.stringify(ad, null, 2)}`);
  if (!wareQuery.data || !ad) {
    return null;
  }

  return (
    <AdDetails
      ad={ad}
      traderHref={composeTargetProfileHref({ targetUserId: wareQuery.data.seller.id })}
      traderRatingUp={wareQuery.data.seller.ratingUp}
      traderRatingDown={wareQuery.data.seller.ratingDown}
      chatHref={!userId ? "/profile" : composeChatHref({ targetUserId: wareQuery.data.seller.id })}
      isChatWithTraderVisible={!isMyAd}
      isReportAdVisible={!isMyAd}
      isTraderVisible={!isMyAd}
      isFavorited={!!favoriteIds[`${props.adId || ""}`]}
      ClaimWareProps={{
        onReportAdClick: withRedirectOnUnauthorized,
        onClaimSubmit: async (form) => {
          try {
            const message = `Reason: ${form.reason}${form.message ? `. Message: ${form.message}` : ""}`;
            await claimWareMutation.mutateAsync({
              wares_id: props.adId,
              message,
            });
          } catch (error) {
            errorHandler(error);
          }
        },
      }}
      onFavoriteClick={() => {
        withRedirectOnUnauthorized(() => {
          onFavoriteClick({ id: props.adId });
        });
      }}
      similarItemsAdListProps={{
        items: [],
        isLastPage: true,
        isShowPlaceholder: false,
        composeHref: (item) => `/details/${item.id}`,
        onFavoriteClick,
        onScrolledToBottom: () => {},
      }}
    />
  );
}
