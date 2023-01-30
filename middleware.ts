import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: "/",
};

export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL("/site", request.url));
}
