"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Module } from "@/types";
import Logo from "@/../public/Logo_Adaptive.png";

const InactiveModules = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchModules();
  }, []);

  // ✅ Fetch only INACTIVE modules
  const fetchModules = async () => {
    try {
      const response = await fetch("/api/modules");
      if (!response.ok) throw new Error("Failed to fetch modules");
      const data = await response.json();
      setModules(data.modules.filter((mod: Module) => mod.status === "unactive"));
    } catch (err) {
      setError("Failed to load modules");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-white">Loading modules...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      

      <div className="flex-1 p-6 flex flex-col items-center">
        <Image src={Logo} alt="Adaptive AI Logo" width={200} height={60} className="mb-6" />
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Inactive Modules</h2>

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
                    <td className="border border-gray-700 p-3 text-red-400 font-semibold">{mod.status}</td>
                    <td className="border border-gray-700 p-3">{mod.users.length > 0 ? mod.users.join(", ") : "No users assigned"}</td>
                    <td className="border border-gray-700 p-3 flex justify-center">
                      <button
                        className="w-[130px] px-4 py-2 rounded text-white bg-green-500 hover:bg-green-700"
                        onClick={() => console.log(`Activate Module ${mod.id}`)}
                      >
                        Activate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InactiveModules;
