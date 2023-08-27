import { NextRequest, NextResponse } from "next/server";

import { serverError } from "@features/server/server-errors";
import {
  mongoConnection,
  projectCollectionName,
} from "@features/server/mongodb/mongo-connection";
import { queryPagination } from "@features/server/mongodb/query-pagination";

export async function POST(request: NextRequest) {
  let bodyRequest: any;
  try {
    bodyRequest = await request.json();
  } catch (e) {
    return serverError("missing body", 400);
  }
  const { js, html, css } = bodyRequest;
  if (!js || !css || !html)
    return serverError("missing body args: js | css | html", 400);
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
    return serverError(`Error with bdd  : ${e}`, 500);
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
    return serverError(`Error with bdd  : ${e}`, 500);
  }
}
