"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function SidebarWrapper() {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) return null; // ✅ Hide sidebar on login/register

  return <Sidebar />;
}
