"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Module } from "@/types";
import Logo from "@/../public/Logo_Adaptive.png"; // ✅ Import Adaptive AI logo

const Modules = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchModules();
  }, []);

  // ✅ Fetch modules from API
  const fetchModules = async () => {
    try {
      const response = await fetch("/api/modules");
      if (!response.ok) throw new Error("Failed to fetch modules");
      const data = await response.json();
      setModules(data.modules);
    } catch (err) {
      setError("Failed to load modules");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle module status (Active <-> Inactive)
  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      const response = await fetch(`/api/modules/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update module status");

      // ✅ Update UI immediately
      setModules((prevModules) =>
        prevModules.map((mod) =>
          mod.id === id ? { ...mod, status: newStatus } : mod
        )
      );
    } catch (error) {
      setError("Failed to update module status");
    }
  };

  if (loading) return <p className="text-white">Loading modules...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white flex flex-col items-center">
      {/* ✅ Adaptive AI Logo */}
      <Image src={Logo} alt="Adaptive AI Logo" width={200} height={60} className="mb-6" />

      <h2 className="text-3xl font-bold mb-6 text-center text-white">Module Management</h2>

      {/* ✅ Scrollable Table Container (Like Users Table) */}
      <div className="w-full max-w-5xl border border-gray-700 rounded-lg shadow-md">
        <div className="overflow-auto max-h-[60vh]"> {/* ✅ Table is scrollable */}
          <table className="w-full border-collapse border border-gray-700">
            <thead className="sticky top-0 bg-gray-800 text-gray-300 z-10">
              <tr>
                <th className="border border-gray-700 p-3">Module Name</th>
                <th className="border border-gray-700 p-3">Status</th>
                <th className="border border-gray-700 p-3">Users</th>
                <th className="border border-gray-700 p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800">
              {modules.map((mod) => (
                <tr key={mod.id} className="text-center hover:bg-gray-700 transition">
                  <td className="border border-gray-700 p-3">{mod.name}</td>
                  <td
                    className={`border border-gray-700 p-3 font-semibold ${
                      mod.status === "active" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {mod.status}
                  </td>
                  <td className="border border-gray-700 p-3">
                    {mod.users.length > 0 ? mod.users.join(", ") : "No users assigned"}
                  </td>
                  <td className="border border-gray-700 p-3">
                    <button
                      onClick={() => toggleStatus(mod.id, mod.status)}
                      className={`px-4 py-2 rounded text-white transition-all ${
                        mod.status === "active"
                          ? "bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800"
                          : "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
                      }`}
                    >
                      {mod.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Modules;
