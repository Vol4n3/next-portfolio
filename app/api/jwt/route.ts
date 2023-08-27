import { NextRequest, NextResponse } from "next/server";
import { serverError } from "@features/server/server-errors";
import { getJwt } from "./jwt";

export async function POST(request: NextRequest) {
  let bodyRequest: {
    client?: string;
    secret?: string;
  };
  try {
    bodyRequest = await request.json();
  } catch (e) {
    return serverError("missing body", 400);
  }
  if (
    bodyRequest.client === process.env.ADMIN_CLIENT &&
    bodyRequest.secret === process.env.ADMIN_SECRET
  ) {
    return NextResponse.json(await getJwt());
  } else {
    return serverError("not found", 404);
  }
}
