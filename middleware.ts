import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@api/jwt/jwt";
import { rateLimiter } from "@commons/utils/rate-limiter";
import { Routes } from "@features/routes/routes";
import { serverError } from "@features/server/server-errors";

export const config = {
  matcher: ["/", `${Routes.api}/:path*`],
};
const getIP = (request: NextRequest): string => {
  return (
    request.ip ||
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded") ||
    "global"
  );
};

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL(Routes.site, request.url));
  }
  if (!request.nextUrl.pathname.startsWith(Routes.api)) {
    return;
  }
  const ip = getIP(request);
  if (rateLimiter(ip)) {
    console.info(`Too many requests by ${ip}`);
    return serverError("Too Many Requests", 429);
  }
  console.info("Check whitelist");
  if (
    (
      [
        { method: "POST", path: Routes.apiJwt },
        { method: "GET", path: Routes.apiArticles, startWith: true },
        { method: "GET", path: Routes.apiProjects },
      ] as {
        method: string;
        path: string;
        startWith?: boolean;
      }[]
    ).some(
      (item) =>
        request.method === item.method &&
        (item.startWith
          ? request.nextUrl.pathname.startsWith(item.path)
          : request.nextUrl.pathname === item.path),
    )
  ) {
    return;
  }
  console.info("Check Authorization");
  const authorization = request.headers.get("Authorization");
  if (!authorization) {
    return serverError("Forbidden", 403);
  }
  const [authScheme, token] = authorization.split(" ");
  if (authScheme !== "Bearer") {
    return new Response("Bad request", {
      status: 400,
      statusText: `Authorization Bearer only`,
    });
  }
  try {
    await verifyJwt(token);
    // can use token data or not
  } catch (e) {
    console.error(e);
    return serverError("Unauthorized", 401);
  }
}
