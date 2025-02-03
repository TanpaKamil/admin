import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Clear the authentication cookie
  response.cookies.set("Authorization", "", {
    expires: new Date(0), // Expire immediately
    path: "/",
  });

  return response;
}
