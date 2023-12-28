"use client";

import { ApolloClient, from, HttpLink, InMemoryCache, split } from "@apollo/client/core";
import { onError } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

interface GraphqlClientCtx {
  gqlHttpUri: string;
  gqlWsUri?: string;
  hasuraAdminSecret?: string;
  refreshTokenUrl?: string;
  customHeaders?: Record<string, string>;
  getAuthJwt?: () => string;
  logout?: () => void;
  onTokenExpired?: () => void;
  onUpdateAuthToken?: (args: { refreshJwt: string | undefined; authJwt: string | undefined }) => void;
}

const httpLink = (ctx: GraphqlClientCtx) => {
  if (!ctx.gqlHttpUri) throw new Error("!ctx.gqlHttpUri");
  if (!ctx.getAuthJwt) throw new Error("!ctx.getAuthJwt");
  const authJwt = ctx.getAuthJwt();

  return new HttpLink({
    uri: ctx.gqlHttpUri,
    ...(authJwt
      ? {
          headers: {
            Authorization: `Bearer ${ctx.getAuthJwt()}`,
            ...(ctx.customHeaders ? ctx.customHeaders : null),
          },
        }
      : {
          ...(ctx.customHeaders ? ctx.customHeaders : null),
        }),
  });
};

const wsLink = (ctx: GraphqlClientCtx) => {
  if (!ctx.gqlWsUri) throw new Error("!ctx.gqlWsUri");
  if (!ctx.getAuthJwt) throw new Error("!ctx.getAuthJwt");
  const authJwt = ctx.getAuthJwt();
  return new GraphQLWsLink(
    createClient({
      url: ctx.gqlWsUri,
      ...(authJwt
        ? {
            connectionParams: {
              headers: { Authorization: `Bearer ${ctx.getAuthJwt()}` },
              ...(ctx.customHeaders ? ctx.customHeaders : null),
            },
          }
        : {
            ...(ctx.customHeaders ? ctx.customHeaders : null),
          }),
    })
  );
};

const splitLink = (ctx: GraphqlClientCtx) =>
  split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === "OperationDefinition" && definition.operation === "subscription";
    },
    wsLink(ctx),
    httpLink(ctx)
  );

const errorLink = (ctx: GraphqlClientCtx) =>
  onError(({ graphQLErrors, networkError, operation, forward, ...rest }) => {
    let isStaleToken = false;
    if (graphQLErrors)
      graphQLErrors.forEach(({ message }) => {
        if (/JWT/gim.test(message)) {
          isStaleToken = true;
        }
      });
    if (networkError) {
      console.error("[Network error]", networkError, {
        operation: operation.operationName,
        variables: operation.variables,
      });
      if (/JWT/gim.test(networkError?.message)) {
        isStaleToken = true;
      }
    }

    // @ts-expect-error
    const statusCode = networkError?.statusCode as number;

    if (statusCode === 401) {
      isStaleToken = true;
    }

    if (isStaleToken) {
      operation.setContext({ isStaleToken: true });
      ctx.onTokenExpired?.();
    } else {
      forward(operation);
    }
  });

export const apolloClient = (ctx: GraphqlClientCtx) => {
  return new ApolloClient({
    link: from([errorLink(ctx), splitLink(ctx)]),
    cache: new InMemoryCache(),
    defaultOptions: {
      mutate: {
        fetchPolicy: "no-cache",
      },
      query: {
        fetchPolicy: "no-cache",
      },
    },
  });
};
