import { UNAUTHORIZED } from "@/lib/error-consts";
import formatError from "@/lib/format-error";
import { createAuthJwt } from "@/lib/jwt";
import { getUserRes } from "@/types/api";
import axios from "axios";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { login, password } = await request.json();
    const backendRes = await axios.post(
      `${process.env.NEXT_PUBLIC_ALFACMS_BASE_URL}/login`,
      { login, password },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const backendToken = backendRes.data.token;

    if (backendToken) {
      const profile = await axios.get<getUserRes>(`${process.env.NEXT_PUBLIC_ALFACMS_BASE_URL}/users/me`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${backendToken}`,
        },
      });
      const userId = profile?.data?.data?.id;
      if (!userId) {
        throw new Error(UNAUTHORIZED);
      }
      const nextjsToken = createAuthJwt({ userId: `${userId}`, claim: { backendToken } });

      return NextResponse.json({ token: nextjsToken }, { status: 201 });
    }

    if (backendRes.status < 400) {
      return NextResponse.json(backendRes.data, {
        status: 400,
      });
    }

    return NextResponse.json(backendRes.data, {
      status: backendRes.status,
    });
  } catch (error) {
    return NextResponse.json(
      { error: formatError(error) },
      {
        status: 401,
      }
    );
  }
};
