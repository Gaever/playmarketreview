import axiosService from "@/lib/axios-service";
import { COOKIE_AUTH_TOKEN } from "@/lib/consts";
import { jwtToUserId } from "@/lib/jwt";
import { RedirectType } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export function getServersideAuth(props?: { redirectOnUnauthorized?: string }) {
  const cookieList = cookies();
  const nextjsToken = cookieList.get(COOKIE_AUTH_TOKEN)?.value;
  axiosService.setNextjsToken(nextjsToken);

  if (props?.redirectOnUnauthorized && !nextjsToken) {
    redirect(props?.redirectOnUnauthorized, RedirectType.replace);
  }

  const userId = jwtToUserId(nextjsToken || "");

  return { token: nextjsToken, userId };
}
