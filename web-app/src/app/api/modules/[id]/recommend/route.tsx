import { NextRequest, NextResponse } from "next/server";
import modulesData from "@/../public/moduls.json"; // ✅ Import JSON file
import { Module } from "@/types";

// ✅ Ensure modulesData is correctly typed
let modules: Module[] = modulesData.modules.map((mod) => ({
  ...mod,
  status: mod.status as "active" | "unactive",
}));

// ✅ PATCH: Toggle Module Recommendation
export async function PATCH(request: NextRequest, context: any) {
  const params = await context.params; // ✅ Properly await params
  const moduleId = parseInt(params.id, 10);

  if (!moduleId) {
    return NextResponse.json({ message: "Module ID is required" }, { status: 400 });
  }

  const moduleIndex = modules.findIndex((mod) => mod.id === moduleId);
  if (moduleIndex === -1) {
    return NextResponse.json({ message: "Module not found" }, { status: 404 });
  }

  // ✅ Toggle the "recommended" status
  modules[moduleIndex].recommended = !modules[moduleIndex].recommended;

  return NextResponse.json({
    message: "Module recommendation updated",
    module: modules[moduleIndex],
  });
}
