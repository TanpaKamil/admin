import { NextResponse } from "next/server";
import { database } from "@/lib/mongodb";


export async function GET() {
  try {
    const db = await database;
    const modules = await db
      .collection("modulemasters")
      .find({})
      .project({
        _id: 1,
        title: 1,
        isActive: 1,
        isFeatured: 1,
        subscribedUsers: 1,
      })
      .toArray();

    

    return NextResponse.json(modules); // ✅ Ensure returning an array
  } catch (error) {
    console.error("Error fetching modules:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
