import { NextRequest, NextResponse } from "next/server";
import modulesData from "@/../public/moduls.json";
import { Module, ModuleStatus } from "@/types";

// ✅ Ensure modulesData is correctly typed
const modules: Module[] = modulesData.modules.map((mod) => ({
  ...mod,
  status: mod.status as ModuleStatus, // ✅ Ensure "active" | "inactive"
}));

// ✅ Correct type for Next.js dynamic API route params
interface Context {
  params: { id: string };
}

// ✅ GET: Fetch Module by ID
export async function GET(request: NextRequest, context: { params: { id: string } }) {
    const { id } = await context.params; // ✅ CORRECT: Awaiting `params` destructuring

    if (!id) {
        return NextResponse.json({ message: "Module ID is required" }, { status: 400 });
    }

    const module = modules.find((mod) => mod.id === parseInt(id));
    if (!module) {
        return NextResponse.json({ message: "Module not found" }, { status: 404 });
    }

    return NextResponse.json(module);
}

// ✅ PATCH: Update Module Status
export async function PATCH(request: NextRequest, context: { params: { id: string } }) {
    const { id } = await context.params; // ✅ CORRECT: Awaiting `params` destructuring
    const { status }: { status: ModuleStatus } = await request.json();

    if (!id) {
        return NextResponse.json({ message: "Module ID is required" }, { status: 400 });
    }

    const moduleIndex = modules.findIndex((mod) => mod.id === parseInt(id));
    if (moduleIndex === -1) {
        return NextResponse.json({ message: "Module not found" }, { status: 404 });
    }

    // ✅ Update module status in-memory
    modules[moduleIndex].status = status;

    return NextResponse.json({ message: "Module status updated", module: modules[moduleIndex] });
}
