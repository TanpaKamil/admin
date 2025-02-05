"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaBox,
  FaCheckCircle,
  FaTimesCircle,
  FaSignOutAlt,
  FaCogs,
  FaStar,
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
 

  const menuItems = [
    { name: "Dashboard", icon: <FaCogs />, path: "/" }, // ✅ Default page
    { name: "Moduls", icon: <FaBox />, path: "/moduls" },
    { name: "Users", icon: <FaUser />, path: "/users" },
    { name: "Active Moduls", icon: <FaCheckCircle />, path: "/active-moduls" },
    { name: "Unactive Moduls", icon: <FaTimesCircle />, path: "/unactive-moduls" },
    { name: "Recommended Modules", icon: <FaStar />, path: "/recommended-modules" }, // ✅ Added new page
  ];
  
  

  const handleLogout = async () => {
    console.log("Logout button clicked");

    try {
      await fetch("/api/logout", { method: "GET" });
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div>
      <div
        className={`h-screen ${isOpen ? "w-64" : "w-16"} 
        bg-gray-900 text-white transition-all duration-200 flex flex-col justify-between shadow-lg`}
      >
        <div>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-500 to-purple-600">
            <h1 className={`text-lg font-bold ${!isOpen && "hidden"}`}>Management</h1>
            <button onClick={() => setIsOpen(!isOpen)} className="text-white text-2xl">
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* ✅ Use Next.js Link for Instant Navigation */}
          <nav className="mt-4">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.path}
                prefetch={false} // ✅ Remove prefetch to avoid delays
                className="flex items-center w-full p-3 text-left hover:bg-gray-800 transition-all"
              >
                <span className="text-xl">{item.icon}</span>
                <span className={`ml-3 ${!isOpen && "hidden"}`}>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center w-full p-3 text-left bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 transition-all"
        >
          <span className="text-xl"><FaSignOutAlt /></span>
          <span className={`ml-3 ${!isOpen && "hidden"}`}>Logout</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center text-white">
            <h3 className="text-xl font-semibold mb-4">Are you sure you want to logout?</h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
