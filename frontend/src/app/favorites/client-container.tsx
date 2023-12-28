"use client";

import { useFavorites } from "@/lib/services/favorites/use-favorites";
import Favorites from "./favorites";

export interface ClientContainerProps {}

const ClientContainer: React.FC<ClientContainerProps> = (_props) => {
  const { favoritesList, favoritesInfiniteQuery, onFavoriteClick } = useFavorites();

  return (
    <Favorites
      AdListProps={{
        items: favoritesList || [],
        isLastPage: !favoritesInfiniteQuery.hasNextPage,
        onScrolledToBottom: favoritesInfiniteQuery.fetchNextPage,
        onFavoriteClick,
        composeHref: (item) => `/details/${item.id}`,
      }}
    />
  );
};

export default ClientContainer;
