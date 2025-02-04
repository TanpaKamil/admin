"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // ✅ Import Next.js Image for logo
import logo from "@/../public/Logo_Adaptive.png"; // ✅ Import logo

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();

  // ✅ Prevent logged-in users from accessing login page
  useEffect(() => {
    if (document.cookie.includes("Authorization")) {
      router.push("/"); // Redirect if user is already logged in
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // ✅ Read response as text to handle errors correctly
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text); // Try parsing JSON
      } catch (error) {
        throw new Error("Unexpected server response. Please try again.");
      }

      if (!response.ok) {
        setMessage(data.message || "Login failed.");
        return;
      }

      console.log("✅ Login successful:", data);
      router.push("/"); // Redirect to home after successful login
    } catch (err) {
      setMessage("An error occurred. Please try again.");
      console.error("❌ Fetch Error:", err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 shadow-lg rounded-lg p-8">
        {/* ✅ Logo - Set dark background behind it */}
        <div className="flex justify-center mb-6 p-3  rounded-lg">
          <Image src={logo} alt="Adaptive AI Logo" width={180} height={60} />
        </div>

        {/* ✅ Title */}
        <h2 className="text-2xl font-bold text-center text-white">Admin Login</h2>
        {message && <p className="text-red-500 text-sm text-center">{message}</p>}

        {/* ✅ Login Form */}
        <form onSubmit={handleLogin} className="mt-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              className="w-full p-3 border rounded-lg text-gray-900 bg-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              className="w-full p-3 border rounded-lg text-gray-900 bg-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
