"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaBox,
  FaCheckCircle,
  FaTimesCircle,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showModal, setShowModal] = useState(false); // State for logout confirmation modal
  const router = useRouter();

  const menuItems = [
    { name: "Moduls", icon: <FaBox />, path: "/moduls" },
    { name: "Users", icon: <FaUser />, path: "/users" },
    { name: "Active Moduls", icon: <FaCheckCircle />, path: "/active-moduls" },
    { name: "Unactive Moduls", icon: <FaTimesCircle />, path: "/unactive-moduls" },
  ];

  const handleLogout = async () => {
    console.log("Logout button clicked"); // Debugging log
  
    try {
      await fetch("/api/logout", { method: "GET" }); // Call the logout API
      window.location.href = "/login"; // Ensure full redirect
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className={`h-screen w-64 bg-gray-900 text-white transition-all ${isOpen ? "w-64" : "w-16"} duration-300 flex flex-col justify-between`}>
        <div>
          <div className="flex items-center justify-between p-4">
            <h1 className={`text-lg font-bold ${!isOpen && "hidden"}`}>Management</h1>
            <button onClick={() => setIsOpen(!isOpen)} className="text-white text-2xl">
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          <nav className="mt-4">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className="flex items-center w-full p-3 text-left hover:bg-gray-700 transition"
                onClick={() => router.push(item.path)}
              >
                <span className="text-xl">{item.icon}</span>
                <span className={`ml-3 ${!isOpen && "hidden"}`}>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => setShowModal(true)} // Show modal when logout is clicked
          className="flex items-center w-full p-3 text-left hover:bg-red-700 bg-red-600 transition"
        >
          <span className="text-xl"><FaSignOutAlt /></span>
          <span className={`ml-3 ${!isOpen && "hidden"}`}>Logout</span>
        </button>
      </div>

      {/* Page Content */}
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-semibold">Dashboard Content</h2>
        <p>Welcome to the Management section.</p>
      </div>

      {/* Logout Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
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
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
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
