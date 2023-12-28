"use client";

import { QUERY_KEY_FAVORITES } from "@/lib/consts";
import errorHandler from "@/lib/error-handler";
import { formatGetFavorites } from "@/lib/formatters/favorites";
import { http } from "@/lib/http";
import { useAuth } from "@/lib/services/auth/use-auth";
import { IAdListItem } from "@/types";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import _keyBy from "lodash/keyBy";
import _mapValues from "lodash/mapValues";
import _filter from "lodash/filter";
import { usePathname } from "next/navigation";
import { useCallback, useRef } from "react";

export function useFavorites() {
  const { token, withRedirectOnUnauthorized } = useAuth();
  const queryClient = useQueryClient();
  const pathname = usePathname();

  const favoritesInfiniteQuery = useInfiniteQuery({
    queryKey: [QUERY_KEY_FAVORITES],
    keepPreviousData: true,
    enabled: !!token,
    queryFn: async ({ pageParam }) => (await http.favorites.getFavorites({ nextPageUrl: pageParam }))?.data,
    getNextPageParam: (lastPage) => lastPage?.links?.next || undefined,
  });
  const favoritesList = (favoritesInfiniteQuery.data?.pages || [])
    .map(formatGetFavorites)
    .flat()
    .filter((item) => item.status === "on");

  const favoriteIdsRef = useRef<Record<string, string>>(_mapValues(_keyBy(favoritesList, "id"), "id"));

  const invalidateQueries = () => {
    if (!/^\/favorites/.test(pathname)) {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_FAVORITES] });
    }
  };

  const addFavoritedId = (id: string | number) => {
    if (id === undefined) {
      return;
    }

    favoriteIdsRef.current = { ...favoriteIdsRef.current, [id.toString()]: id.toString() };
  };

  const removeFavoritedId = (id: string | number) => {
    if (id === undefined) {
      return;
    }

    const newIds = { ...favoriteIdsRef.current };
    delete newIds[id.toString()];
    favoriteIdsRef.current = newIds;
  };

  const favoriteMutaion = useMutation({
    mutationFn: http.wares.favoriteWare,
    onMutate: async (variables) => {
      addFavoritedId(variables.wareId);
    },
    onError: (error, variables) => {
      removeFavoritedId(variables.wareId);
      errorHandler(error);
    },
    onSettled: () => {
      invalidateQueries();
    },
  });

  const unfavoriteMutaion = useMutation({
    mutationFn: http.wares.unfavoriteWare,
    onMutate: async (variables) => {
      removeFavoritedId(variables.wareId);
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY_FAVORITES] });

      const previousFavorites = queryClient.getQueryData<typeof favoritesInfiniteQuery.data>([QUERY_KEY_FAVORITES]);

      queryClient.setQueryData<typeof favoritesInfiniteQuery.data>([QUERY_KEY_FAVORITES], (old) => {
        if (!old) {
          return old;
        }

        return {
          pageParams: old.pageParams,
          pages: old?.pages?.map((page) => ({
            ...page,
            data: _filter(page.data, function (item) {
              return item.id?.toString() !== variables.wareId?.toString();
            }),
          })),
        };
      });

      return { previousFavorites };
    },
    onError: (error, variables, context) => {
      addFavoritedId(variables.wareId);
      queryClient.setQueryData([QUERY_KEY_FAVORITES], context?.previousFavorites || []);
      errorHandler(error);
    },
    onSettled: () => {
      invalidateQueries();
    },
  });

  const onFavoriteClick = useCallback(
    (item: Pick<IAdListItem, "id">) => {
      withRedirectOnUnauthorized(() => {
        const isFavorited = !!favoriteIdsRef.current?.[`${item?.id}`];

        if (isFavorited) {
          unfavoriteMutaion.mutate({ wareId: item.id });
        } else {
          favoriteMutaion.mutate({ wareId: item.id });
        }
      });
    },
    // eslint-disable-next-line
    [favoriteMutaion, unfavoriteMutaion, favoriteIdsRef.current]
  );

  return {
    favoritesInfiniteQuery,
    favoritesList,
    favoriteMutaion,
    unfavoriteMutaion,
    favoriteIds: favoriteIdsRef.current,
    onFavoriteClick,
  };
}
