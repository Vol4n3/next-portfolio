import { NextRequest, NextResponse } from "next/server";
import { serverError } from "@features/server/server-errors";
import { ObjectFilterByKeys } from "@commons/utils/utils";
import { Article } from "@features/article/article";
import {
  articleCollectionName,
  mongoConnection,
} from "@features/server/mongodb/mongo-connection";

export async function DELETE(
  request: NextRequest,
  { params: { articleId } }: { params: { articleId: string } },
) {
  if (!articleId) return serverError("missing path args: articleId", 400);
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
    return serverError(`Error with bdd  : ${e}`, 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params: { articleId } }: { params: { articleId: string } },
) {
  if (!articleId) return serverError("missing path args: articleId", 400);
  let bodyRequest: Partial<Article>;
  try {
    bodyRequest = await request.json();
  } catch (e) {
    return serverError("missing body", 400);
  }
  const data = ObjectFilterByKeys<Article>(bodyRequest, [
    "creator",
    "content",
    "description",
    "keywords",
    "title",
    "imageUri",
    "id",
    "published",
  ]);

  try {
    return NextResponse.json(
      await mongoConnection(async (db) => {
        const result = await db
          .collection(articleCollectionName)
          .findOneAndUpdate(
            { id: articleId },
            {
              $set: { ...data, updated: new Date() },
            },
            { returnDocument: "after" },
          );
        return result.value;
      }),
    );
  } catch (e) {
    console.error(e);
    return serverError(`Error with bdd  : ${e}`, 500);
  }
}

export async function GET(
  request: NextRequest,
  { params: { articleId } }: { params: { articleId: string } },
) {
  if (!articleId) return serverError("missing path args: articleId", 400);
  console.log(articleId);
  try {
    const document = await mongoConnection(async (db) =>
      db.collection(articleCollectionName).findOne({ id: articleId }),
    );
    if (document) {
      return NextResponse.json(document);
    }
    return serverError(`not found`, 404);
  } catch (e) {
    console.error(e);
    return serverError(`Error with bdd  : ${e}`, 500);
  }
}
