import formatError from "@/lib/format-error";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const message = request.nextUrl.searchParams.get("message");
    const type = request.nextUrl.searchParams.get("type");

    if (type === "error") {
      console.error(message);
    } else {
      console.log(message);
    }
  } catch (error) {
    return NextResponse.json(
      { error: formatError(error) },
      {
        status: 404,
      }
    );
  }
};
