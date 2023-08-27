import { NextRequest, NextResponse } from "next/server";
import { serverError } from "@features/server/server-errors";
import { ObjectId } from "bson";
import {
  mongoConnection,
  projectCollectionName,
} from "@features/server/mongodb/mongo-connection";
type PartialProject = {
  js?: string;
  css?: string;
  html?: string;
};
export async function DELETE(
  request: NextRequest,
  { params: { projectId } }: { params: { projectId: string } },
) {
  if (!projectId) return serverError("missing path args: projectId", 400);
  try {
    return NextResponse.json(
      await mongoConnection(async (db) =>
        db
          .collection(projectCollectionName)
          .deleteOne({ _id: new ObjectId(projectId) }),
      ),
    );
  } catch (e) {
    console.error(e);
    return serverError(`Error with bdd  : ${e}`, 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params: { projectId } }: { params: { projectId: string } },
) {
  if (!projectId) return serverError("missing path args: projectId", 400);
  let bodyRequest: PartialProject;
  try {
    bodyRequest = await request.json();
  } catch (e) {
    return serverError("missing body", 400);
  }
  const data: PartialProject = {};
  if (bodyRequest.js) data.js = bodyRequest.js;
  if (bodyRequest.css) data.css = bodyRequest.css;
  if (bodyRequest.html) data.html = bodyRequest.html;
  try {
    return NextResponse.json(
      await mongoConnection(async (db) =>
        db
          .collection(projectCollectionName)
          .findOneAndUpdate({ _id: new ObjectId(projectId) }, data),
      ),
    );
  } catch (e) {
    console.error(e);
    return serverError(`Error with bdd  : ${e}`, 500);
  }
}

export async function GET(
  request: NextRequest,
  { params: { projectId } }: { params: { projectId: string } },
) {
  if (!projectId) return serverError("missing path args: projectId", 400);
  try {
    return NextResponse.json(
      await mongoConnection(async (db) =>
        db
          .collection(projectCollectionName)
          .find({ _id: new ObjectId(projectId) }),
      ),
    );
  } catch (e) {
    console.error(e);
    return serverError(`Error with bdd  : ${e}`, 500);
  }
}
