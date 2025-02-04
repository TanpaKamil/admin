import { NextResponse } from "next/server";
import usersData from "@/../public/users.json"; // ✅ Import JSON
import { User, UserRole, UserStatus } from "@/types";

// ✅ Ensure `role` is always `"user"`
const users: User[] = usersData.users.map((user) => ({
  ...user,
  role: "user" as const, // ✅ Force TypeScript to treat as "user"
  status: user.status as UserStatus, // ✅ Ensure "active" | "inactive"
}));

export async function GET() {
  return NextResponse.json({ users });
}
