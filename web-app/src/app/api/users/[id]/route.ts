import { NextRequest, NextResponse } from "next/server";
import usersData from "@/../public/users.json"; // ✅ Import JSON
import { User, UserStatus } from "@/types";

// ✅ Ensure usersData is correctly typed
const users: User[] = usersData.users.map((user) => ({
  ...user,
  role: "user" as const,
  status: user.status as UserStatus,
}));

// ✅ GET User by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const user = users.find((user) => user.id === parseInt(id));

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
}

// ✅ PATCH: Update User Status
export async function PATCH(request: NextRequest, context: { params: { id: string } }) {
    const { id } = await context.params; // ✅ Await params before using

    const { status }: { status: UserStatus } = await request.json();

    const userIndex = users.findIndex((user) => user.id === parseInt(id));
    if (userIndex === -1) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // ✅ Update user status in-memory
    users[userIndex].status = status;

    return NextResponse.json({ message: "User status updated", user: users[userIndex] });
}