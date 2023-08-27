import { NextRequest, NextResponse } from "next/server";
import { badRequest } from "@features/server/server-errors";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const accepts = ["image/png", "image/jpg", "image/jpeg", "image/gif"];

export async function POST(request: NextRequest) {
  let bodyRequest: FormData;
  try {
    bodyRequest = await request.formData();
  } catch (e) {
    return badRequest("bad format will be formdata");
  }
  const file = bodyRequest.get("file") as File;
  if (!file) {
    return badRequest("missing form file arguments");
  }
  if (!file.type) {
    return badRequest("file need mime type");
  }
  if (!accepts.includes(file.type)) {
    return badRequest("mime type not allowed");
  }
  try {
    const buffer = await file.arrayBuffer();
    const fileName = `${crypto.randomUUID()}${path.extname(file.name)}`;
    const destination = `/uploads/${fileName}`;
    const destinationDirPath = path.join(process.cwd(), "/public", destination);
    await fs.writeFile(destinationDirPath, Buffer.from(buffer), { flag: "wx" });
    return NextResponse.json({
      path: `${process.env.URI}/${destination}`,
      fileName,
    });
  } catch (e) {
    console.error(e);
    return badRequest("error with file");
  }
}
