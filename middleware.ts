import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@api/jwt/jwt";
import { rateLimiter } from "@commons/utils/rate-limiter";

export const config = {
  matcher: ["/", "/api/:path*"],
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
    return NextResponse.redirect(new URL("/site", request.url));
  }

  if (!request.nextUrl.pathname.startsWith("/api")) {
    return;
  }
  const ip = getIP(request);
  if (rateLimiter(ip)) {
    console.info(`Too many requests by ${ip}`);
    return new Response("Too Many Requests", {
      status: 429,
      statusText: `Too Many Requests`,
    });
  }
  if (
    (
      [
        { method: "POST", path: "/api/jwt" },
        { method: "GET", path: "/api/articles", startWith: true },
        { method: "GET", path: "/api/projects" },
      ] as {
        method: string;
        path: string;
        startWith?: boolean;
      }[]
    ).some((item) =>
      request.method === item.method && item.startWith
        ? request.nextUrl.pathname.startsWith(item.path)
        : request.nextUrl.pathname === item.path,
    )
  ) {
    return;
  }
  const authorization = request.headers.get("Authorization");
  if (!authorization) {
    return new Response("Forbidden", {
      status: 403,
      statusText: `Forbidden`,
    });
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
    console.error("pass", e);
    return new Response("Unauthorized", {
      status: 401,
      statusText: `Unauthorized`,
    });
  }
}
