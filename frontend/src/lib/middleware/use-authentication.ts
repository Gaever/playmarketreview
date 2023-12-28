import { UNAUTHORIZED } from "@/lib/error-consts";
import formatError from "@/lib/format-error";
import { jwtToUserId, verifyAuthJwt } from "@/lib/jwt";
import { CustomNextApiRequest } from "@/types";
import { NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import { headers } from "next/headers";
import { NextFetchEvent } from "next/server";

export async function reqToUser(_req: CustomNextApiRequest) {
  const authorizationHeader = headers().get("authorization");
  const jwt = (authorizationHeader || "").split("Bearer ").filter(Boolean)?.[0];
  if (!jwt) return null;

  if (!verifyAuthJwt(jwt)) {
    return null;
  }

  const userId = jwtToUserId(jwt);
  if (!userId) {
    return null;
  }

  return {
    id: userId,
  };
}

export async function useBackendAuthentication(_req: CustomNextApiRequest, _res: NextFetchEvent, next: NextHandler) {
  if (headers().get("x-saharasell") !== process.env.BACKEND_TOKEN) {
    throw new Error(formatError(UNAUTHORIZED));
  }
  await next();
}

async function useAuthentication(req: CustomNextApiRequest, _res: NextFetchEvent, next: NextHandler) {
  if (headers().get("x-saharasell") !== process.env.BACKEND_TOKEN) {
    throw new Error(formatError(UNAUTHORIZED));
  }

  const user = await reqToUser(req);

  if (!user?.id) {
    throw new Error(formatError(UNAUTHORIZED));
  }
  req.user = user;

  await next();
}

export default useAuthentication;
