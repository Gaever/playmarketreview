import { QueryCache, QueryClient } from "@tanstack/react-query";
import { cache } from "react";
import errorHandler from "./error-handler";

export const createQueryClient = () =>
  new QueryClient({
    queryCache: new QueryCache({
      onError: errorHandler,
    }),
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60,
        retry: false,
        refetchOnReconnect: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

const getQueryClient = cache(() => new QueryClient());

export default getQueryClient;
