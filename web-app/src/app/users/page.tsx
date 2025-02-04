"use client";

import { useState, useEffect } from "react";
import { User } from "@/types";

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
    const newStatus = currentStatus === "active" ? "inactive" : "active";

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

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Modules</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="text-center">
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td
                className={`border p-2 ${
                  user.status === "active" ? "text-green-500" : "text-red-500"
                }`}
              >
                {user.status}
              </td>
              <td className="border p-2">
                {user.modules.length > 0 ? user.modules.join(", ") : "None"}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => toggleStatus(user.id, user.status)}
                  className={`px-4 py-2 rounded ${
                    user.status === "active"
                      ? "bg-red-500 text-white"
                      : "bg-green-500 text-white"
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
  );
};

export default Users;
