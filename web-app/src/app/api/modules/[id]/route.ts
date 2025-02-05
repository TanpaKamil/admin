import { NextRequest, NextResponse } from "next/server";
import modulesData from "@/../public/moduls.json";
import { Module, ModuleStatus, DocumentData, DocumentStatus } from "@/types";

// ✅ Ensure modulesData is correctly typed
let modules: Module[] = modulesData.modules.map((mod) => ({
  ...mod,
  status: mod.status as ModuleStatus,
  documents: mod.documents.map((doc: any) => ({
    ...doc,
    status: doc.status as DocumentStatus,
  })) as DocumentData[],
}));

// ✅ Correct Type for API Route Parameters
interface Context {
  params: { id: string };
}

// ✅ GET: Fetch a Module by ID
export async function GET(
  request: NextRequest,
  context: { params: { id?: string } }
) {
  const { params } = context;
  if (!params || !params.id) {
    return NextResponse.json(
      { message: "Module ID is required" },
      { status: 400 }
    );
  }

  const moduleId = parseInt(params.id, 10);
  if (isNaN(moduleId)) {
    return NextResponse.json(
      { message: "Invalid Module ID" },
      { status: 400 }
    );
  }

  const module = modules.find((mod) => mod.id === moduleId);
  if (!module) {
    return NextResponse.json(
      { message: "Module not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(module);
}

// ✅ PATCH: Update Module Status - FIXED
export async function PATCH(
  request: NextRequest,
  context: { params: { id?: string } }
) {
  // ✅ Await Next.js params correctly
  const params = await context.params;

  if (!params || !params.id) {
    return NextResponse.json(
      { message: "Module ID is required" },
      { status: 400 }
    );
  }

  const moduleId = parseInt(params.id, 10);
  if (isNaN(moduleId)) {
    return NextResponse.json(
      { message: "Invalid Module ID" },
      { status: 400 }
    );
  }

  const { status }: { status: ModuleStatus } = await request.json();

  if (!["active", "unactive"].includes(status)) {
    return NextResponse.json(
      { message: "Invalid status value" },
      { status: 400 }
    );
  }

  const moduleIndex = modules.findIndex((mod) => mod.id === moduleId);
  if (moduleIndex === -1) {
    return NextResponse.json(
      { message: "Module not found" },
      { status: 404 }
    );
  }

  // ✅ Update module status
  modules[moduleIndex].status = status;

  return NextResponse.json({
    message: "Module status updated",
    module: modules[moduleIndex],
  });
}
