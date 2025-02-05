"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Module } from "@/types";
import Logo from "@/../public/Logo_Adaptive.png";

const ModulesPage = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [filteredModules, setFilteredModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchModules();
  }, []);

  // ✅ Fetch modules from API
  const fetchModules = async () => {
    try {
      const response = await fetch("/api/modules");
      if (!response.ok) throw new Error("Failed to fetch modules");
      const data = await response.json();

      // ✅ Automatically mark modules with more than 3 users as recommended
      const updatedModules = data.modules.map((mod: Module) => ({
        ...mod,
        recommended: mod.users.length > 3, // Auto-recommend if users > 3
      }));

      setModules(updatedModules);
      setFilteredModules(updatedModules);
    } catch (err) {
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
      modules.filter((mod) => mod.name.toLowerCase().includes(query))
    );
  };

  // ✅ Toggle Module Status (Active <-> Inactive)
  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "unactive" : "active";

    try {
      const response = await fetch(`/api/modules/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update module status");

      setModules((prevModules) =>
        prevModules.map((mod) =>
          mod.id === id ? { ...mod, status: newStatus } : mod
        )
      );
      setFilteredModules((prevModules) =>
        prevModules.map((mod) =>
          mod.id === id ? { ...mod, status: newStatus } : mod
        )
      );
    } catch (error) {
      setError("Failed to update module status");
    }
  };

  // ✅ Toggle Manual Recommendation
  const toggleRecommendation = (id: number) => {
    setModules((prevModules) =>
      prevModules.map((mod) =>
        mod.id === id ? { ...mod, recommended: !mod.recommended } : mod
      )
    );
    setFilteredModules((prevModules) =>
      prevModules.map((mod) =>
        mod.id === id ? { ...mod, recommended: !mod.recommended } : mod
      )
    );
  };

  // ✅ Open modal and set selected module
  const openModal = (module: Module) => {
    setSelectedModule(module);
    setIsModalOpen(true);
  };

  // ✅ Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedModule(null);
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
              <th className="border border-gray-700 p-3">Module Name</th>
              <th className="border border-gray-700 p-3">Status</th>
              <th className="border border-gray-700 p-3">Users</th>
              <th className="border border-gray-700 p-3">Recommended</th>
              <th className="border border-gray-700 p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredModules.map((mod) => (
              <tr key={mod.id} className="text-center bg-gray-800 hover:bg-gray-700 transition">
                <td className="border border-gray-700 p-3">{mod.name}</td>
                <td className={`border border-gray-700 p-3 font-semibold ${mod.status === "active" ? "text-green-400" : "text-red-400"}`}>
                  {mod.status}
                </td>
                <td className="border border-gray-700 p-3">
                  {mod.users.length > 0 ? mod.users.join(", ") : "No users assigned"}
                </td>
                <td className="border border-gray-700 p-3">{mod.recommended ? "✅ Yes" : "❌ No"}</td>
                <td className="border border-gray-700 p-3 flex justify-center gap-2">
                  <button onClick={() => toggleStatus(mod.id, mod.status)} className={`w-[130px] px-4 py-2 rounded text-white ${mod.status === "active" ? "bg-red-500 hover:bg-red-700" : "bg-green-500 hover:bg-green-700"}`}>
                    {mod.status === "active" ? "Deactivate" : "Activate"}
                  </button>

                  <button onClick={() => toggleRecommendation(mod.id)} className="w-[130px] px-4 py-2 rounded text-white bg-yellow-500 hover:bg-yellow-700">
                    {mod.recommended ? "Unrecommend" : "Recommend"}
                  </button>

                  <button onClick={() => openModal(mod)} disabled={mod.documents?.length === 0} className={`w-[130px] px-4 py-2 rounded text-white bg-blue-500 ${mod.documents?.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}>
                    See Doc
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Modal for Viewing Documents */}
      {isModalOpen && selectedModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-white w-full max-w-lg">
            <h3 className="text-2xl font-bold mb-4">{selectedModule.name} - Documents</h3>
            <ul>
              {selectedModule.documents.map((doc, index) => (
                <li key={index} className="mb-3 p-3 bg-gray-800 rounded">
                  <p><strong>{doc.fileName}</strong></p>
                  <p>Size: {(doc.fileSize / 1024).toFixed(2)} KB</p>
                  <p>Status: {doc.status}</p>
                </li>
              ))}
            </ul>
            <button onClick={closeModal} className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModulesPage;
