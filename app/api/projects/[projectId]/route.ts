import { NextRequest, NextResponse } from "next/server";
import { mongoConnection, projectCollectionName } from "@api/mongodb";
import { badRequest } from "@features/server/server-errors";
import { ObjectId } from "bson";
type PartialProject = {
  js?: string;
  css?: string;
  html?: string;
};
export async function DELETE(
  request: NextRequest,
  { params: { projectId } }: { params: { projectId: string } },
) {
  if (!projectId) return badRequest("missing path args: projectId");
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
    return badRequest(`Error with bdd  : ${e}`);
  }
}

export async function PATCH(
  request: NextRequest,
  { params: { projectId } }: { params: { projectId: string } },
) {
  if (!projectId) return badRequest("missing path args: projectId");
  let bodyRequest: PartialProject;
  try {
    bodyRequest = await request.json();
  } catch (e) {
    return badRequest("missing body");
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
    return badRequest(`Error with bdd  : ${e}`);
  }
}

export async function GET(
  request: NextRequest,
  { params: { projectId } }: { params: { projectId: string } },
) {
  if (!projectId) return badRequest("missing path args: projectId");
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
    return badRequest(`Error with bdd  : ${e}`);
  }
}
