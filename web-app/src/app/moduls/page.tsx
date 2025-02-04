"use client";

import { useState, useEffect } from "react";
import { Module } from "@/types";

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

  if (loading) return <p>Loading modules...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Module Management</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Module Name</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Users</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {modules.map((mod) => (
            <tr key={mod.id} className="text-center">
              <td className="border p-2">{mod.name}</td>
              <td
                className={`border p-2 ${
                  mod.status === "active" ? "text-green-500" : "text-red-500"
                }`}
              >
                {mod.status}
              </td>
              <td className="border p-2">
                {mod.users.length > 0 ? mod.users.join(", ") : "No users assigned"}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => toggleStatus(mod.id, mod.status)}
                  className={`px-4 py-2 rounded ${
                    mod.status === "active"
                      ? "bg-red-500 text-white"
                      : "bg-green-500 text-white"
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
  );
};

export default Modules;
