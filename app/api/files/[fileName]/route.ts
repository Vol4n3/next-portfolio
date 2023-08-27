import { NextRequest } from "next/server";
import { serverError } from "@features/server/server-errors";
import path from "node:path";
import fs from "node:fs/promises";

export async function DELETE(
  request: NextRequest,
  { params: { fileName } }: { params: { fileName: string } },
) {
  if (!fileName) return serverError("missing path args: fileName", 400);
  try {
    const destination = `/uploads/${fileName}`;
    const destinationDirPath = path.join(process.cwd(), "/public", destination);
    await fs.rm(destinationDirPath);
    return new Response("Success", { status: 200 });
  } catch (e) {
    console.error(e);
    return serverError(`file not found`, 404);
  }
}
