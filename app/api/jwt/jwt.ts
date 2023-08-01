import { jwtVerify, JWTVerifyResult, SignJWT } from "jose";

export const getJwt = async (): Promise<{ token: string; expire: number }> => {
  const iat = Math.floor(Date.now() / 1000);
  const expire = iat + 60 * 60 * 2; // 2 hours
  const token = await new SignJWT({
    admin: true,
    expire,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(expire)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(process.env.JWT_SECRET || ""));
  return { expire, token };
};
export const verifyJwt = async (token: string): Promise<JWTVerifyResult> => {
  return jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_SECRET || ""),
  );
};
