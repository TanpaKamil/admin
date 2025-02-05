"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { User } from "@/types";
import Logo from "@/../public/Logo_Adaptive.png"; // ✅ Import the logo

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle user status (Active <-> Inactive)
  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "unactive" : "active";

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update user status");

      // ✅ Update state immediately
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, status: newStatus } : user
        )
      );
    } catch (error) {
      setError("Failed to update user status");
    }
  };

  if (loading) return <p className="text-white">Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white flex flex-col items-center">
      {/* ✅ Adaptive AI Logo */}
      <Image src={Logo} alt="Adaptive AI Logo" width={200} height={60} className="mb-6" />

      <h2 className="text-3xl font-bold mb-6 text-center text-white">User Management</h2>

      {/* ✅ Wrap Table Inside a Scrollable Container */}
      <div className="overflow-auto max-h-[70vh] border border-gray-700 rounded-lg shadow-md w-full">
        <table className="w-full border-collapse border border-gray-700">
          <thead className="sticky top-0 bg-gray-800 text-gray-300">
            <tr>
              <th className="border border-gray-700 p-3">Name</th>
              <th className="border border-gray-700 p-3">Email</th>
              <th className="border border-gray-700 p-3">Status</th>
              <th className="border border-gray-700 p-3">Modules</th>
              <th className="border border-gray-700 p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="text-center bg-gray-800 hover:bg-gray-700 transition">
                <td className="border border-gray-700 p-3">{user.name}</td>
                <td className="border border-gray-700 p-3">{user.email}</td>
                <td
                  className={`border border-gray-700 p-3 font-semibold ${
                    user.status === "active" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {user.status}
                </td>
                <td className="border border-gray-700 p-3">
                  {user.modules.length > 0 ? user.modules.join(", ") : "None"}
                </td>
                <td className="border border-gray-700 p-3">
                  <button
                    onClick={() => toggleStatus(user.id, user.status)}
                    className={`px-4 py-2 rounded text-white transition-all ${
                      user.status === "active"
                        ? "bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800"
                        : "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
                    }`}
                  >
                    {user.status === "active" ? "Deactivate" : "Activate"}
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

export default Users;
