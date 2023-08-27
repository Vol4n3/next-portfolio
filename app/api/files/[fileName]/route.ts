import { NextRequest } from "next/server";
import { badRequest } from "@features/server/server-errors";
import path from "node:path";
import fs from "node:fs/promises";

export async function DELETE(
  request: NextRequest,
  { params: { fileName } }: { params: { fileName: string } },
) {
  if (!fileName) return badRequest("missing path args: fileName");
  try {
    const destination = `/uploads/${fileName}`;
    const destinationDirPath = path.join(process.cwd(), "/public", destination);
    await fs.rm(destinationDirPath);
    return new Response("Success", { status: 200 });
  } catch (e) {
    console.error(e);
    return badRequest(`file not found`);
  }
}
