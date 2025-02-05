"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Module } from "@/types";
import Logo from "@/../public/Logo_Adaptive.png"; // ✅ Adaptive AI Logo

const Modules = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
      setModules(data.modules);
    } catch (err) {
      setError("Failed to load modules");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle module status (Active <-> Inactive)
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
    } catch (error) {
      setError("Failed to update module status");
    }
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
      {/* ✅ Adaptive AI Logo */}
      <Image src={Logo} alt="Adaptive AI Logo" width={200} height={60} className="mb-6" />

      <h2 className="text-3xl font-bold mb-6 text-center text-white">Module Management</h2>

      {/* ✅ Scrollable Table */}
      <div className="w-full max-w-5xl border border-gray-700 rounded-lg shadow-md">
        <div className="overflow-auto max-h-[60vh]">
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
                  <td className="border border-gray-700 p-3 flex justify-center gap-2">
                    {/* ✅ Fixed Button Sizes */}
                    <button
                      onClick={() => toggleStatus(mod.id, mod.status)}
                      className={`w-[130px] px-4 py-2 rounded text-white transition-all ${
                        mod.status === "active"
                          ? "bg-red-500 hover:bg-red-700"
                          : "bg-green-500 hover:bg-green-700"
                      }`}
                    >
                      {mod.status === "active" ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      onClick={() => openModal(mod)}
                      disabled={mod.documents?.length === 0}
                      className={`w-[130px] px-4 py-2 rounded text-white transition-all bg-blue-500 ${
                        mod.documents?.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                      }`}
                    >
                      See Doc
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Modal for Viewing Documents */}
      {isModalOpen && selectedModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-white w-full max-w-lg">
            <h3 className="text-2xl font-bold mb-4">{selectedModule.name} - Documents</h3>
            {selectedModule.documents.length > 0 ? (
              <ul className="space-y-3">
                {selectedModule.documents.map((doc, index) => (
                  <li key={index} className="p-3 bg-gray-800 rounded-lg shadow">
                    <p className="font-semibold">{doc.fileName}</p>
                    <p className="text-gray-400 text-sm">Size: {(doc.fileSize / 1024).toFixed(2)} KB</p>
                    <p
                      className={`text-sm ${
                        doc.status === "completed"
                          ? "text-green-400"
                          : doc.status === "processing"
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      Status: {doc.status}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No documents available.</p>
            )}
            <button
              onClick={closeModal}
              className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modules;
