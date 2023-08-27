import { NextResponse } from "next/server";

export const serverError = (reason: string, code: number) => {
  return NextResponse.json(
    { reason },
    {
      status: code,
    },
  );
};
