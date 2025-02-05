import { NextRequest, NextResponse } from "next/server";
import modulesData from "@/../public/moduls.json";
import { Module, ModuleStatus, DocumentData, DocumentStatus } from "@/types";

// ✅ Ensure modulesData is correctly typed
const modules: Module[] = modulesData.modules.map((mod) => ({
  ...mod,
  status: mod.status as ModuleStatus,
  documents: mod.documents.map((doc: any) => ({
    ...doc,
    status: doc.status as DocumentStatus,
  })) as DocumentData[],
}));

// ✅ Correct Type for API Route Parameters
interface Context {
  params?: { id?: string };
}

// ✅ GET: Fetch a Module by ID
export async function GET(request: NextRequest, context: Context) {
  const params = await context.params; // ✅ Ensure `params` is awaited correctly

  if (!params?.id) {
    return NextResponse.json({ message: "Module ID is required" }, { status: 400 });
  }

  const id = parseInt(params.id);
  const module = modules.find((mod) => mod.id === id);

  if (!module) {
    return NextResponse.json({ message: "Module not found" }, { status: 404 });
  }

  return NextResponse.json(module);
}

// ✅ PATCH: Update Module Status
export async function PATCH(request: NextRequest, context: Context) {
  const params = await context.params; // ✅ Ensure `params` is awaited correctly

  if (!params?.id) {
    return NextResponse.json({ message: "Module ID is required" }, { status: 400 });
  }

  const id = parseInt(params.id);
  const { status }: { status: ModuleStatus } = await request.json();

  const moduleIndex = modules.findIndex((mod) => mod.id === id);
  if (moduleIndex === -1) {
    return NextResponse.json({ message: "Module not found" }, { status: 404 });
  }

  if (!["active", "inactive"].includes(status)) {
    return NextResponse.json({ message: "Invalid status value" }, { status: 400 });
  }

  // ✅ Update module status in-memory
  modules[moduleIndex].status = status;

  return NextResponse.json({ message: "Module status updated", module: modules[moduleIndex] });
}
