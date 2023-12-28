"use client";

import { noop } from "lodash";
import { Dispatch, SetStateAction, createContext, useCallback, useContext, useState } from "react";

const favoritesContext = createContext<{
  favoritedIds: Set<string>;
  setFavoritedIds: Dispatch<SetStateAction<Set<string>>>;
}>({ favoritedIds: new Set(), setFavoritedIds: noop });

export function FavoritesProvider(props: React.PropsWithChildren) {
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(new Set());
  return (
    <favoritesContext.Provider value={{ favoritedIds, setFavoritedIds }}>{props.children}</favoritesContext.Provider>
  );
}

export function useFavoritesIds() {
  const { favoritedIds, setFavoritedIds } = useContext(favoritesContext);

  const addFavoriteId = useCallback((id: string) => {
    const newSet = favoritedIds;
    newSet.add(id);
    setFavoritedIds(newSet);
    // eslint-disable-next-line
  }, []);

  const removeFavoriteId = useCallback((id: string) => {
    const newSet = favoritedIds;
    newSet.delete(id);
    setFavoritedIds(newSet);
    // eslint-disable-next-line
  }, []);

  return {
    favoritedIds,
    setFavoritedIds,
    addFavoriteId,
    removeFavoriteId,
  };
}
