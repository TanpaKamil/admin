import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function GET() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  response.headers.set(
    "Set-Cookie",
    serialize("Authorization", "", {
      expires: new Date(0),
      path: "/",
    })
  );

  return response;
}
