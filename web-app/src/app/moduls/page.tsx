"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Module } from "@/types"; // Ensure this is updated with the correct types
import Logo from "@/../public/Logo_Adaptive.png";

const ModulesPage = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [filteredModules, setFilteredModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetchModules();
  }, []);

  // ✅ Fetch modules from MongoDB API
  const fetchModules = async () => {
    try {
      const response = await fetch("/api/modules");
      if (!response.ok) throw new Error(`Failed to fetch modules: ${response.status}`);
  
      const data = await response.json();
    
      if (!Array.isArray(data)) {
        throw new Error(`Invalid API response: Expected an array of modules, got ${typeof data}`);
      }
  
      // ✅ Extract only required fields
      const updatedModules = data.map((mod) => ({
        _id: mod._id.toString(),
        title: mod.title,
        isActive: mod.isActive,
        recommended: mod.isFeatured,
        subscriberCount: mod.subscribedUsers.length || 0,
      }));
  
      setModules(updatedModules);
      setFilteredModules(updatedModules);
    } catch (err) {
      console.error("Error fetching modules:", err);
      setError("Failed to load modules");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Search for Modules
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    const query = e.target.value.toLowerCase();
    setFilteredModules(
      modules.filter((mod) => mod.title.toLowerCase().includes(query))
    );
  };

  // ✅ Toggle Module Status (Active <-> Inactive)
  const toggleStatus = async (id: string, isActive: boolean) => {
    const newStatus = !isActive;

    try {
      const response = await fetch(`/api/modules/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update module status");

      setModules((prevModules) =>
        prevModules.map((mod) =>
          mod._id === id ? { ...mod, isActive: newStatus } : mod
        )
      );
      setFilteredModules((prevModules) =>
        prevModules.map((mod) =>
          mod._id === id ? { ...mod, isActive: newStatus } : mod
        )
      );
    } catch (error) {
      console.log(error);
      
      setError("Failed to update module status");
    }
  };

  // ✅ Toggle Module Recommendation (Featured <-> Not Featured)
  const toggleRecommendation = async (id: string, recommended: boolean) => {
    try {
      const response = await fetch(`/api/modules/${id}/recommend`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to update recommendation status");

      setModules((prevModules) =>
        prevModules.map((mod) =>
          mod._id === id ? { ...mod, recommended: !recommended } : mod
        )
      );
      setFilteredModules((prevModules) =>
        prevModules.map((mod) =>
          mod._id === id ? { ...mod, recommended: !recommended } : mod
        )
      );
    } catch (error) {
      console.log(error);
      
      setError("Failed to update recommendation status");
    }
  };

  if (loading) return <p className="text-white">Loading modules...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white flex flex-col items-center">
      <Image src={Logo} alt="Adaptive AI Logo" width={200} height={60} className="mb-6" />

      <h2 className="text-3xl font-bold mb-6 text-center text-white">Module Management</h2>

      {/* ✅ Search Bar */}
      <input
        type="text"
        placeholder="Search module by name..."
        value={searchQuery}
        onChange={handleSearch}
        className="w-full max-w-md mb-4 p-3 border rounded-lg text-gray-900 bg-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-purple-500"
      />

      {/* ✅ Scrollable Table */}
      <div className="overflow-auto max-h-[70vh] border border-gray-700 rounded-lg shadow-md w-full">
        <table className="w-full border-collapse border border-gray-700">
          <thead className="sticky top-0 bg-gray-800 text-gray-300">
            <tr>
              <th className="border border-gray-700 p-3">Title</th>
              <th className="border border-gray-700 p-3">Status</th>
              <th className="border border-gray-700 p-3">Subscribers</th>
              <th className="border border-gray-700 p-3">Recommended</th>
              <th className="border border-gray-700 p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredModules.map((mod) => (
              <tr key={mod._id} className="text-center bg-gray-800 hover:bg-gray-700 transition">
                <td className="border border-gray-700 p-3">{mod.title}</td>
                <td className={`border border-gray-700 p-3 font-semibold ${mod.isActive ? "text-green-400" : "text-red-400"}`}>
                  {mod.isActive ? "Active" : "Inactive"}
                </td>
                <td className="border border-gray-700 p-3">{mod.subscriberCount}</td>
                <td className="border border-gray-700 p-3">{mod.recommended ? "✅ Yes" : "❌ No"}</td>
                <td className="border border-gray-700 p-3 flex justify-center gap-2">
                  {/* ✅ Activate / Deactivate Button */}
                  <button
                    onClick={() => toggleStatus(mod._id, mod.isActive)}
                    className={`w-[130px] px-4 py-2 rounded text-white ${mod.isActive ? "bg-red-500 hover:bg-red-700" : "bg-green-500 hover:bg-green-700"}`}
                  >
                    {mod.isActive ? "Deactivate" : "Activate"}
                  </button>

                  {/* ✅ Recommend / Unrecommend Button */}
                  <button
                    onClick={() => toggleRecommendation(mod._id, mod.recommended)}
                    className="w-[130px] px-4 py-2 rounded text-white bg-yellow-500 hover:bg-yellow-700"
                  >
                    {mod.recommended ? "Unrecommend" : "Recommend"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModulesPage;
