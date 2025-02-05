"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FaUsers,
  FaCogs,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import Logo from "@/../public/Logo_Adaptive.png";
import dynamic from "next/dynamic";

// ✅ Lazy-load Chart.js for performance
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Dashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeModules: 0,
    unactiveModules: 0,
    totalDocuments: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  // ✅ Fetch Dashboard Stats
  const fetchStats = async () => {
    try {
      const response = await fetch("/api/dashboard");
      if (!response.ok) throw new Error("Failed to fetch dashboard data");
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-white">Loading dashboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* ✅ Sidebar */}
    

      {/* ✅ Main Content */}
      <div className="flex-1 p-6 flex flex-col items-center">
        <Image src={Logo} alt="Adaptive AI Logo" width={200} height={60} className="mb-6" />
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Admin Dashboard</h2>

        {/* ✅ Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
          {/* Total Users */}
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg flex items-center justify-between">
            <FaUsers className="text-3xl text-blue-500" />
            <div>
              <h3 className="text-lg font-semibold">Total Users</h3>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
          </div>

          {/* Active Modules */}
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg flex items-center justify-between">
            <FaCheckCircle className="text-3xl text-green-500" />
            <div>
              <h3 className="text-lg font-semibold">Active Modules</h3>
              <p className="text-2xl font-bold">{stats.activeModules}</p>
            </div>
          </div>

          {/* Inactive Modules */}
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg flex items-center justify-between">
            <FaTimesCircle className="text-3xl text-red-500" />
            <div>
              <h3 className="text-lg font-semibold">Unactive Modules</h3>
              <p className="text-2xl font-bold">{stats.unactiveModules}</p>
            </div>
          </div>

          {/* Total Documents */}
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg flex items-center justify-between">
            <FaFileAlt className="text-3xl text-yellow-500" />
            <div>
              <h3 className="text-lg font-semibold">Total Documents</h3>
              <p className="text-2xl font-bold">{stats.totalDocuments}</p>
            </div>
          </div>
        </div>

        {/* ✅ Recent Activity Log */}
        <div className="w-full max-w-6xl mt-8">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
            <p className="text-gray-400">No recent activity yet...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
