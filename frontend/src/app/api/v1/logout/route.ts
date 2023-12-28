import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const redirectTo = (searchParams.get("redirect_to") || "").replaceAll(/(rn_signin=1|rn_logout=1|\?)/gm, "");

  cookies().delete("token");
  cookies().delete("gql_token");

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_NEXTJS_URL}${redirectTo}?rn_logout=1`);
};
