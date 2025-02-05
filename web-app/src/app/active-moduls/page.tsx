"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Module } from "@/types";
import Logo from "@/../public/Logo_Adaptive.png";

const ActiveModules = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchModules();
  }, []);

  // ✅ Fetch only ACTIVE modules
  const fetchModules = async () => {
    try {
      const response = await fetch("/api/modules");
      if (!response.ok) throw new Error(`Failed to fetch modules: ${response.status}`);

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error(`Invalid API response: Expected an array of modules, got ${typeof data}`);
      }

      // ✅ Extract only required fields and filter active modules
      const updatedModules = data
        .map((mod) => ({
          _id: mod._id.toString(),
          title: mod.title,
          isActive: mod.isActive,
          recommended: mod.isFeatured,
          subscriberCount: mod.subscribedUsers.length || 0,
        }))
        .filter((mod) => mod.isActive); // ✅ Only get active modules

      setModules(updatedModules);
    } catch (err) {
      console.error("Error fetching modules:", err);
      setError("Failed to load modules");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle Module Status (Deactivate)
  const toggleStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/modules/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: false }), // ✅ Set inactive
      });

      if (!response.ok) throw new Error("Failed to update module status");

      // ✅ Update UI immediately
      setModules((prevModules) =>
        prevModules.filter((mod) => mod._id !== id) // ✅ Remove deactivated module from list
      );
    } catch (error) {
      console.error("Failed to update module status:", error);
      setError("Failed to deactivate module");
    }
  };

  if (loading) return <p className="text-white">Loading modules...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="flex-1 p-6 flex flex-col items-center">
        <Image src={Logo} alt="Adaptive AI Logo" width={200} height={60} className="mb-6" />
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Active Modules</h2>

        {/* ✅ Scrollable Table */}
        <div className="w-full max-w-5xl border border-gray-700 rounded-lg shadow-md">
          <div className="overflow-auto max-h-[60vh]">
            <table className="w-full border-collapse border border-gray-700">
              <thead className="sticky top-0 bg-gray-800 text-gray-300 z-10">
                <tr>
                  <th className="border border-gray-700 p-3">Module Name</th>
                  <th className="border border-gray-700 p-3">Status</th>
                  <th className="border border-gray-700 p-3">Subscribers</th>
                  <th className="border border-gray-700 p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800">
                {modules.map((mod) => (
                  <tr key={mod._id} className="text-center hover:bg-gray-700 transition">
                    <td className="border border-gray-700 p-3">{mod.title}</td>
                    <td className="border border-gray-700 p-3 text-green-400 font-semibold">
                      {mod.isActive ? "Active" : "Inactive"}
                    </td>
                    <td className="border border-gray-700 p-3">{mod.subscriberCount}</td>
                    <td className="border border-gray-700 p-3 flex justify-center">
                      <button
                        className="w-[130px] px-4 py-2 rounded text-white bg-red-500 hover:bg-red-700"
                        onClick={() => toggleStatus(mod._id)}
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
                {modules.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-400">
                      No active modules found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveModules;
