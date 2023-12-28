import formatError from "@/lib/format-error";
import axios from "axios";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const body = await request.json();

  try {
    const backendRes = await axios.post(`${process.env.NEXT_PUBLIC_ALFACMS_BASE_URL}/users`, body, {
      headers: {
        Authorization: `Bearer ${process.env.SIGN_UP_TOKEN}`,
      },
    });
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
