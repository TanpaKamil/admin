import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { database } from "@/lib/mongodb";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, data : RouteParams) {
  try {
    // ✅ Await params and validate `id`
    const resolvedParams = await data.params;
    if (!resolvedParams.id || !ObjectId.isValid(resolvedParams.id)) {
      return NextResponse.json({ message: "Invalid Module ID" }, { status: 400 });
    }

    const moduleId = new ObjectId(resolvedParams.id);
    const db = await database;

    // ✅ Find the module
    const moduleData = await db.collection("modulemasters").findOne({ _id: moduleId });
    if (!moduleData) {
      return NextResponse.json({ message: "Module not found" }, { status: 404 });
    }

    // ✅ Toggle `isFeatured` (Recommended Status)
    const updatedRecommendation = !moduleData.isFeatured;
    const result = await db.collection("modulemasters").updateOne(
      { _id: moduleId },
      { $set: { isFeatured: updatedRecommendation } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Failed to update module recommendation" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Module recommendation status updated",
      module: { ...moduleData, isFeatured: updatedRecommendation },
    });
  } catch (error) {
    console.error("Error updating module recommendation:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}