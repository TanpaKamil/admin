"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Module } from "@/types";
import Logo from "@/../public/Logo_Adaptive.png";

const RecommendedModules = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchModules();
  }, []);

  // ✅ Fetch only RECOMMENDED modules (isFeatured: true)
  const fetchModules = async () => {
    try {
      const response = await fetch("/api/modules");
      if (!response.ok) throw new Error(`Failed to fetch modules: ${response.status}`);
  
      const data = await response.json();
  
      if (!Array.isArray(data)) {
        throw new Error(`Invalid API response: Expected an array of modules, got ${typeof data}`);
      }
  
      // ✅ Extract and filter only recommended modules (Ensure recommended is included)
      const recommendedModules = data
        .filter((mod: any) => mod.isFeatured) // Only modules with `isFeatured: true`
        .map((mod: any) => ({
          _id: mod._id.toString(),
          title: mod.title,
          isActive: mod.isActive,
          recommended: mod.isFeatured, // ✅ Ensure recommended is explicitly included
          subscriberCount: mod.subscribedUsers.length || 0,
        }));
  
      setModules(recommendedModules);
    } catch (err) {
      console.error("Error fetching modules:", err);
      setError("Failed to load modules");
    } finally {
      setLoading(false);
    }
  };
  

  // ✅ Toggle Recommendation Status
  const toggleRecommendation = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/modules/${id}/recommend`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !currentStatus }),
      });

      if (!response.ok) throw new Error("Failed to update module recommendation");

      // ✅ Update UI instantly
      setModules((prevModules) =>
        prevModules.map((mod) =>
          mod._id === id ? { ...mod, recommended: !currentStatus } : mod
        )
      );
    } catch (error) {
      console.error("Failed to update module recommendation:", error);
      setError("Failed to update recommendation");
    }
  };

  if (loading) return <p className="text-white">Loading recommended modules...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white flex flex-col items-center">
      <Image src={Logo} alt="Adaptive AI Logo" width={200} height={60} className="mb-6" />

      <h2 className="text-3xl font-bold mb-6 text-center text-white">Recommended Modules</h2>

      {/* ✅ Scrollable Table */}
      <div className="overflow-auto max-h-[70vh] border border-gray-700 rounded-lg shadow-md w-full">
        <table className="w-full border-collapse border border-gray-700">
          <thead className="sticky top-0 bg-gray-800 text-gray-300">
            <tr>
              <th className="border border-gray-700 p-3">Title</th>
              <th className="border border-gray-700 p-3">Status</th>
              <th className="border border-gray-700 p-3">Subscribers</th>
              <th className="border border-gray-700 p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((mod) => (
              <tr key={mod._id} className="text-center bg-gray-800 hover:bg-gray-700 transition">
                <td className="border border-gray-700 p-3">{mod.title}</td>
                <td className={`border border-gray-700 p-3 font-semibold ${mod.isActive ? "text-green-400" : "text-red-400"}`}>
                  {mod.isActive ? "Active" : "Inactive"}
                </td>
                <td className="border border-gray-700 p-3">{mod.subscriberCount}</td>
                <td className="border border-gray-700 p-3 flex justify-center gap-2">
                  <button
                    className="w-[130px] px-4 py-2 rounded text-white bg-yellow-500 hover:bg-yellow-700"
                    onClick={() => toggleRecommendation(mod._id, mod.recommended)}
                  >
                    {mod.recommended ? "Unrecommend" : "Recommend"}
                  </button>
                </td>
              </tr>
            ))}
            {modules.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-400">
                  No recommended modules found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecommendedModules;
