import {  NextResponse } from "next/server";
import { database } from "@/lib/mongodb"; // ✅ Import MongoDB connection


// ✅ GET: Fetch All Users
export async function GET() {
  try {
    const db = await database;
    const users = await db.collection("users").find().toArray(); // ✅ Fetch all users

    if (!users || users.length === 0) {
      return NextResponse.json({ message: "No users found" }, { status: 404 });
    }

    // ✅ Transform data: Convert ObjectId to string and enforce user role
    const formattedUsers = users.map((user) => ({
      _id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role || "user",
      status: user.status || "inactive", // ✅ Default to "inactive" if missing
      imageUrl: user.imageUrl || "https://image.pollinations.ai/prompt/image-placeholder-for-user",
      modules: user.modules || [], // ✅ Ensure modules is always an array
      lastActive: user.lastActive || null,
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
