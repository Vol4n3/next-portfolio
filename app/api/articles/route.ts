import { NextRequest, NextResponse } from "next/server";

import { badRequest } from "@features/server/server-errors";

import { objectFilterByKeys } from "@commons/utils/utils";
import { Article } from "@features/article/article";
import {
  articleCollectionName,
  mongoConnection,
} from "@features/server/mongodb/mongo-connection";
import { queryPagination } from "@features/server/mongodb/query-pagination";
import { Filter } from "mongodb";

export async function POST(request: NextRequest) {
  let bodyRequest: any;
  try {
    bodyRequest = await request.json();
  } catch (e) {
    console.error(e);
    return badRequest("missing body");
  }
  if (!bodyRequest) {
    return badRequest("missing body");
  }
  const { title, content, creator, id } = bodyRequest;
  if (!title || !content || !creator || !id)
    return badRequest("miss on body : title | content | creator | id");
  try {
    const data = objectFilterByKeys<Article>(bodyRequest, [
      "creator",
      "content",
      "description",
      "title",
      "imageUri",
      "id",
      "published",
    ]);
    return NextResponse.json(
      await mongoConnection(async (db) =>
        db.collection(articleCollectionName).insertOne({
          ...data,
          updated: new Date(),
          created: new Date(),
        }),
      ),
    );
  } catch (e) {
    console.error(e);
    return badRequest(`Error with bdd : ${e}`);
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const skip = Number(searchParams.get("skip")) || 0;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "-updated";
  const published: Filter<Article> | null = searchParams.get("published")
    ? { published: true }
    : null;
  try {
    return NextResponse.json(
      await mongoConnection((db) =>
        queryPagination<Article>(db.collection(articleCollectionName), {
          search,
          where: published,
          sort,
          limit,
          skip,
        }),
      ),
    );
  } catch (e) {
    console.error(e);
    return badRequest(`Error with bdd : ${e}`);
  }
}