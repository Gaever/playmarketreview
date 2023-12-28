"use client";

import axiosService from "@/lib/axios-service";
import { createQueryClient } from "@/lib/get-query-client";
import { useAuthSetup, useAuth } from "@/lib/services/auth/use-auth";
import { ApolloProvider } from "@apollo/client/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { apolloClient as createApolloClient } from "./apollo";
import { FavoritesProvider } from "./services/favorites/favorites-provider";
import { useSearchParams } from "next/navigation";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { rnEvents } from "./rn-events";

const getApolloClient = (token: string | undefined) => {
  return createApolloClient({
    gqlHttpUri: process.env.NEXT_PUBLIC_HASURA_HTTP_URL!,
    gqlWsUri: process.env.NEXT_PUBLIC_HASURA_WS_URL!,
    getAuthJwt: () => token || "",
  });
};

export default function Providers(props: { children: React.ReactNode; csrfToken: string }) {
  const searchParams = useSearchParams();

  if (searchParams.get("rn_signin") && typeof document !== "undefined") {
    const cookies = document.cookie;
    rnEvents.signin({ cookies });
  }

  if (searchParams.get("rn_logout") && typeof document !== "undefined") {
    rnEvents.logout();
  }

  useEffect(() => {
    axiosService.setCsrfToken(props.csrfToken);
    // eslint-disable-next-line
  }, []);
  useAuthSetup();
  const { token } = useAuth();
  const [queryClient] = useState(createQueryClient);
  const [apolloClient, setApolloClient] = useState(() => getApolloClient(token));

  useEffect(() => {
    // setApolloClient(getApolloClient(token));
    // eslint-disable-next-line
  }, [token]);

  return (
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={apolloClient}>
        <FavoritesProvider>
          {props.children}
          {process.env.NEXT_PUBLIC_REACT_QUERY_DEVTOOLS ? (
            <ReactQueryDevtools toggleButtonProps={{ style: { bottom: "50px" } }} />
          ) : null}
        </FavoritesProvider>
      </ApolloProvider>
    </QueryClientProvider>
  );
}
