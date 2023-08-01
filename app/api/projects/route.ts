import { NextRequest, NextResponse } from "next/server";
import {
  mongoConnection,
  projectCollectionName,
  queryPagination,
} from "../mongodb";
import { badRequest } from "@features/server/server-errors";

export async function POST(request: NextRequest) {
  let bodyRequest: {
    js?: string;
    css?: string;
    html?: string;
  };
  try {
    bodyRequest = await request.json();
  } catch (e) {
    return badRequest("missing body");
  }
  const { js, html, css } = bodyRequest;
  if (!js || !css || !html)
    return badRequest("missing body args: js | css | html");
  try {
    return NextResponse.json(
      await mongoConnection(async (db) =>
        db.collection(projectCollectionName).insertOne({
          js,
          css,
          html,
          updated: new Date(),
        }),
      ),
    );
  } catch (e) {
    console.error(e);
    return badRequest(`Error with bdd  : ${e}`);
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const skip = Number(searchParams.get("skip")) || 0;
  const limit = Number(searchParams.get("limit")) || 10;
  try {
    return NextResponse.json(
      await mongoConnection((db) =>
        queryPagination(db.collection(projectCollectionName), {
          limit,
          skip,
        }),
      ),
    );
  } catch (e) {
    console.error(e);
    return badRequest(`Error with bdd  : ${e}`);
  }
}
