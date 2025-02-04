import { NextResponse } from "next/server";
import modulesData from "@/../public/moduls.json"; // ✅ Import JSON
import { Module, ModuleStatus } from "@/types";

// ✅ Ensure modulesData is correctly typed
const modules: Module[] = modulesData.modules.map((mod) => ({
  ...mod,
  status: mod.status as ModuleStatus, // ✅ Ensure "active" | "inactive"
}));

export async function GET() {
  return NextResponse.json({ modules });
}
