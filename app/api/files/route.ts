import { NextRequest, NextResponse } from "next/server";
import { serverError } from "@features/server/server-errors";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const accepts = ["image/png", "image/jpg", "image/jpeg", "image/gif"];

export async function POST(request: NextRequest) {
  let bodyRequest: FormData;
  try {
    bodyRequest = await request.formData();
  } catch (e) {
    return serverError("bad format will be formdata", 400);
  }
  const file = bodyRequest.get("file") as File;
  if (!file) {
    return serverError("missing form file arguments", 400);
  }
  if (!file.type) {
    return serverError("file need mime type", 400);
  }
  if (!accepts.includes(file.type)) {
    return serverError("mime type not allowed", 400);
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
    return serverError("error with file", 500);
  }
}
