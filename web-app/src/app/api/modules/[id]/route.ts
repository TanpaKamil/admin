import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { database } from "@/lib/mongodb";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// ✅ GET: Fetch a Module by ID
export async function GET(request: NextRequest, data: RouteParams) {
  try {
    const resolvedParams = await data.params;
    if (!resolvedParams.id) {
      return NextResponse.json({ message: "Module ID is required" }, { status: 400 });
    }

    const moduleId = resolvedParams.id;
    if (!ObjectId.isValid(moduleId)) {
      return NextResponse.json({ message: "Invalid Module ID" }, { status: 400 });
    }

    const db = await database;
    const moduleData = await db.collection("modulemasters").findOne({ _id: new ObjectId(moduleId) });

    if (!moduleData) {
      return NextResponse.json({ message: "Module not found" }, { status: 404 });
    }

    return NextResponse.json(moduleData);
  } catch (error) {
    console.error("Error fetching module:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ PATCH: Update Module Status
export async function PATCH(request: NextRequest, data: RouteParams) {
  try {
    const resolvedParams = await data.params;
    if (!resolvedParams.id) {
      return NextResponse.json({ message: "Module ID is required" }, { status: 400 });
    }

    const moduleId = resolvedParams.id;
    if (!ObjectId.isValid(moduleId)) {
      return NextResponse.json({ message: "Invalid Module ID" }, { status: 400 });
    }

    const { isActive }: { isActive: boolean } = await request.json();
    const db = await database;
    
    const result = await db
      .collection("modulemasters")
      .updateOne({ _id: new ObjectId(moduleId) }, { $set: { isActive } });

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Module not found" }, { status: 404 });
    }

    const updatedModule = await db.collection("modulemasters").findOne({ _id: new ObjectId(moduleId) });
    return NextResponse.json({
      message: "Module status updated",
      module: updatedModule,
    });
  } catch (error) {
    console.error("Error updating module:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}