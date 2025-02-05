import { NextRequest, NextResponse } from "next/server";
import { database } from "@/lib/mongodb"; // Import MongoDB connection

export async function GET() {
  try {
    const db = await database;

    // ✅ Count Active & Inactive Modules
    const activeModules = await db.collection("modulemasters").countDocuments({ isActive: true });
    const inactiveModules = await db.collection("modulemasters").countDocuments({ isActive: false });

    // ✅ Count Total Users
    const totalUsers = await db.collection("users").countDocuments();

    // ✅ Count Total Modules (instead of summing documents)
    const totalModules = await db.collection("modulemasters").countDocuments(); // ✅ Get total modules count

    return NextResponse.json({
      totalUsers,
      activeModules,
      inactiveModules,
      totalModules, // ✅ Now returns the total number of modules
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

