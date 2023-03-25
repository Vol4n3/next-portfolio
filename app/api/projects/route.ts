import { Request } from "next/dist/compiled/@edge-runtime/primitives/fetch";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  try {
    const response = await fetch(`${process.env.URI}/projects/${id}.json`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (e) {
    return new Response("Not found", {
      status: 404,
    });
  }
}
