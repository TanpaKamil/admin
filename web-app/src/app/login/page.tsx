"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


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
    <>
  
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-center text-black">Admin Login</h2>
          {message && <p className="text-red-500 text-sm text-center">{message}</p>}
          <form onSubmit={handleLogin} className="mt-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                className="w-full p-2 border rounded-lg text-black placeholder-gray-400"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                className="w-full p-2 border rounded-lg text-black placeholder-gray-400"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
