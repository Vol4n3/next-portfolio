import { NextRequest, NextResponse } from "next/server";
import { badRequest, notFound } from "@features/server/server-errors";
import { objectFilterByKeys } from "@commons/utils/utils";
import { Article } from "@features/article/article";
import {
  articleCollectionName,
  mongoConnection,
} from "@features/server/mongodb/mongo-connection";

export async function DELETE(
  request: NextRequest,
  { params: { articleId } }: { params: { articleId: string } },
) {
  if (!articleId) return badRequest("missing path args: articleId");
  try {
    return NextResponse.json(
      await mongoConnection(async (db) =>
        db
          .collection<Article>(articleCollectionName)
          .deleteOne({ id: articleId }),
      ),
    );
  } catch (e) {
    console.error(e);
    return badRequest(`Error with bdd  : ${e}`);
  }
}

export async function PATCH(
  request: NextRequest,
  { params: { articleId } }: { params: { articleId: string } },
) {
  if (!articleId) return badRequest("missing path args: articleId");
  let bodyRequest: Partial<Article>;
  try {
    bodyRequest = await request.json();
  } catch (e) {
    return badRequest("missing body");
  }
  const data = objectFilterByKeys<Article>(bodyRequest, [
    "creator",
    "content",
    "description",
    "title",
    "imageUri",
    "id",
  ]);
  try {
    return NextResponse.json(
      await mongoConnection(async (db) =>
        db.collection(articleCollectionName).findOneAndUpdate(
          { id: articleId },
          {
            $set: { ...data, updated: new Date() },
          },
        ),
      ),
    );
  } catch (e) {
    console.error(e);
    return badRequest(`Error with bdd  : ${e}`);
  }
}

export async function GET(
  request: NextRequest,
  { params: { articleId } }: { params: { articleId: string } },
) {
  if (!articleId) return badRequest("missing path args: articleId");
  try {
    const document = await mongoConnection(async (db) =>
      db
        .collection(articleCollectionName)
        .findOne({ id: encodeURI(articleId.replace(" ", "-")) }),
    );
    if (document) {
      return NextResponse.json(document);
    }
    return notFound();
  } catch (e) {
    console.error(e);
    return badRequest(`Error with bdd  : ${e}`);
  }
}
