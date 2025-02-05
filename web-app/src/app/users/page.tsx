"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { User } from "@/types";
import Logo from "@/../public/Logo_Adaptive.png";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error(`Failed to fetch users: ${response.status}`);

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error(`Invalid API response: Expected an array of users, got ${typeof data}`);
      }

      // ✅ Format user data correctly
      const updatedUsers = data.map((user: any) => ({
        _id: user._id.toString(),
        email: user.email,
        username: user.username || "Unknown User",
        role: user.role || "user",
        imageUrl: user.imageUrl || "https://image.pollinations.ai/prompt/image-placeholder-for-user",
        modules: user.modules || [], // ✅ Ensure always an array
        lastActive: user.lastActive ? new Date(user.lastActive).toLocaleString() : "Never",
      }));

      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    const query = e.target.value.toLowerCase();
    setFilteredUsers(
      users.filter(
        (user) =>
          user.username.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
      )
    );
  };

  if (loading) return <p className="text-white">Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white flex flex-col items-center">
      <Image src={Logo} alt="Adaptive AI Logo" width={200} height={60} className="mb-6" />

      <h2 className="text-3xl font-bold mb-6 text-center text-white">User Management</h2>

      {/* ✅ Search Bar */}
      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchQuery}
        onChange={handleSearch}
        className="w-full max-w-md mb-4 p-3 border rounded-lg text-gray-900 bg-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-purple-500"
      />

      {/* ✅ Scrollable Table */}
      <div className="overflow-auto max-h-[70vh] border border-gray-700 rounded-lg shadow-md w-full">
        <table className="w-full border-collapse border border-gray-700">
          <thead className="sticky top-0 bg-gray-800 text-gray-300">
            <tr>
              <th className="border border-gray-700 p-3">Profile</th>
              <th className="border border-gray-700 p-3">Username</th>
              <th className="border border-gray-700 p-3">Email</th>
              <th className="border border-gray-700 p-3">Role</th>
              <th className="border border-gray-700 p-3">Modules</th>
              <th className="border border-gray-700 p-3">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="text-center bg-gray-800 hover:bg-gray-700 transition">
                <td className="border border-gray-700 p-3">
                  <Image
                    src={user.imageUrl}
                    alt={user.username}
                    width={40}
                    height={40}
                    className="rounded-full mx-auto"
                  />
                </td>
                <td className="border border-gray-700 p-3">{user.username}</td>
                <td className="border border-gray-700 p-3">{user.email}</td>
                <td className="border border-gray-700 p-3">{user.role}</td>
                <td className="border border-gray-700 p-3">
                  {user.modules.length > 0 ? user.modules.join(", ") : "None"}
                </td>
                <td className="border border-gray-700 p-3">{user.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;
