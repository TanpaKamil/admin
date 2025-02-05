import modulesData from "@/../public/moduls.json";
import { Module, ModuleStatus, DocumentData, DocumentStatus } from "@/types";
import { NextResponse } from "next/server";

// ✅ Ensure modulesData is correctly typed
const modules: Module[] = modulesData.modules.map((mod) => ({
  ...mod,
  status: mod.status as ModuleStatus, // ✅ Ensure "active" | "inactive"
  documents: mod.documents.map((doc: any) => ({
    ...doc,
    status: doc.status as DocumentStatus, // ✅ Ensure "processing" | "completed" | "failed"
  })) as DocumentData[], // ✅ Ensure correct DocumentData typing
}));

export async function GET() {
  return NextResponse.json({ modules });
}
