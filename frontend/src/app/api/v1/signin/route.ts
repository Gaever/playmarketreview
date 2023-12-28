import { UNAUTHORIZED } from "@/lib/error-consts";
import formatError from "@/lib/format-error";
import { verifyAuthJwt } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const nextjsToken = searchParams.get("token");
  const redirectTo = (searchParams.get("redirect_to") || "").replaceAll(/(rn_signin=1|rn_logout=1|\?)/gm, "");
  try {
    if (!nextjsToken || !verifyAuthJwt(nextjsToken)) {
      throw new Error(UNAUTHORIZED);
    }

    cookies().set("token", nextjsToken);

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_NEXTJS_URL}${redirectTo}?rn_signin=1`);
  } catch (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_NEXTJS_URL}/?error=${formatError(error)}`);
  }
};
