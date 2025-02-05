import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { database } from "@/lib/mongodb"; // ✅ Import MongoDB connection

export async function PATCH(request: NextRequest, { params }: { params: { id?: string } }) {
  try {
    if (!params?.id || !ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: "Invalid Module ID" }, { status: 400 });
    }

    const moduleId = new ObjectId(params.id);
    const db = await database;

    // ✅ Find the current recommendation status
    const module = await db.collection("modulemasters").findOne({ _id: moduleId });
    if (!module) {
      return NextResponse.json({ message: "Module not found" }, { status: 404 });
    }

    // ✅ Toggle recommendation status (isFeatured field)
    const updatedResult = await db.collection("modulemasters").updateOne(
      { _id: moduleId },
      { $set: { isFeatured: !module.isFeatured } }
    );

    if (updatedResult.matchedCount === 0) {
      return NextResponse.json({ message: "Module update failed" }, { status: 500 });
    }

    // ✅ Fetch the updated module
    const updatedModule = await db.collection("modulemasters").findOne({ _id: moduleId });

    return NextResponse.json({
      message: "Module recommendation updated",
      module: updatedModule,
    });
  } catch (error) {
    console.error("Error updating module recommendation:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
