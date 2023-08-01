import { NextRequest, NextResponse } from "next/server";
import { badRequest, notFound } from "@features/server/server-errors";
import { getJwt } from "./jwt";

export async function POST(request: NextRequest) {
  let bodyRequest: {
    client?: string;
    secret?: string;
  };
  try {
    bodyRequest = await request.json();
  } catch (e) {
    return badRequest("missing body");
  }
  if (
    bodyRequest.client === process.env.ADMIN_CLIENT &&
    bodyRequest.secret === process.env.ADMIN_SECRET
  ) {
    return NextResponse.json(await getJwt());
  } else {
    return notFound();
  }
}
