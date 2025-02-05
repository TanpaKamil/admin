import { NextResponse } from "next/server";
import modulesData from "@/../public/moduls.json"; // ✅ Load modules data
import usersData from "@/../public/users.json"; // ✅ Load users data

export async function GET() {
  // ✅ Count active & inactive modules
  const activeModules = modulesData.modules.filter(m => m.status === "active").length;
  const inactiveModules = modulesData.modules.filter(m => m.status === "inactive").length;

  // ✅ Count total users
  const totalUsers = usersData.users.length;

  // ✅ Count total documents
  const totalDocuments = modulesData.modules.reduce((sum, mod) => sum + mod.documents.length, 0);

  return NextResponse.json({ totalUsers, activeModules, inactiveModules, totalDocuments });
}
