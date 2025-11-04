// frontend/src/components/StudentRegister.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function StudentRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    prn: "",
  });
  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ PRN validation (exactly 16 digits)
    if (!/^\d{16}$/.test(form.prn)) {
      setMsg("❌ PRN Number must be exactly 16 digits.");
      return;
    }

    setMsg("⏳ Registering...");
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Registration failed");

      setMsg("✅ Registration successful! Please login now.");
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    // 🌙 Same dark background as login
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#1e40af]">
      {/* subtle glow accents */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-96 w-96 rounded-full bg-indigo-400/30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-sky-300/20 blur-2xl" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="relative w-[92%] md:w-[880px] lg:w-[980px] rounded-2xl bg-white/95 shadow-2xl backdrop-blur-md"
      >
        <div className="grid md:grid-cols-2">
          {/* LEFT: Title + Illustration (same as login for consistency) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="px-8 md:px-10 py-10 flex items-center justify-center"
          >
            <div className="w-full max-w-sm">
              <div className="text-[28px] font-semibold text-gray-900">
                Create Your Account
              </div>
              <div className="text-sm text-gray-500 mb-6">
                register to access the student portal
              </div>

              {/* Illustration */}
              <div className="mt-2">
                <svg
                  viewBox="0 0 420 220"
                  className="w-full h-auto drop-shadow-sm"
                >
                  {/* table */}
                  <rect x="40" y="170" width="340" height="10" fill="#1f2542" rx="5" />
                  {/* books */}
                  <rect x="80" y="140" width="16" height="30" fill="#3b82f6" rx="2" />
                  <rect x="100" y="132" width="16" height="38" fill="#22c55e" rx="2" />
                  <rect x="120" y="138" width="16" height="32" fill="#ef4444" rx="2" />
                  {/* cup */}
                  <rect x="320" y="148" width="16" height="22" fill="#f59e0b" rx="4" />
                  <rect x="317" y="144" width="22" height="5" fill="#9ca3af" rx="3" />
                  {/* character */}
                  <circle cx="210" cy="90" r="30" fill="#fde68a" />
                  <path d="M185,95 q25-32 50,0 v-6 q-25-18-50,0 z" fill="#0f172a" />
                  <rect x="194" y="92" width="18" height="10" rx="5" fill="#ffffff" />
                  <rect x="218" y="92" width="18" height="10" rx="5" fill="#ffffff" />
                  <rect x="192" y="95" width="22" height="2" fill="#0f172a" />
                  <rect x="216" y="95" width="22" height="2" fill="#0f172a" />
                  {/* body + laptop */}
                  <rect x="178" y="118" width="64" height="40" rx="10" fill="#3b82f6" />
                  <rect x="188" y="136" width="44" height="24" rx="8" fill="#e5e7eb" />
                  <circle cx="210" cy="148" r="3" fill="#9ca3af" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Registration Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="px-8 md:px-10 py-10 bg-white/95"
          >
            {msg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-4 rounded-md px-3 py-2 text-sm border ${
                  msg.startsWith("✅")
                    ? "bg-green-50 text-green-700 border-green-200"
                    : msg.startsWith("⏳")
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {msg}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75H4.5v-.75z"
                    />
                  </svg>
                </span>
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-full border border-blue-100 bg-[#edf3ff] text-gray-900 pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                />
              </div>

              {/* Email */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 7.5l-9.75 6-9.75-6m19.5 0v9a2.25 2.25 0 01-2.25 2.25h-15A2.25 2.25 0 013 16.5v-9m18.75 0L12 13.5 3.75 7.5"
                    />
                  </svg>
                </span>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-full border border-blue-100 bg-[#edf3ff] text-gray-900 pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                />
              </div>

              {/* PRN */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5v-3a4.5 4.5 0 00-9 0v3M6.75 10.5h10.5v9.75H6.75V10.5z"
                    />
                  </svg>
                </span>
                <input
                  name="prn"
                  type="text"
                  placeholder="PRN Number (16 digits)"
                  value={form.prn}
                  onChange={handleChange}
                  className="w-full rounded-full border border-blue-100 bg-[#edf3ff] text-gray-900 pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                  maxLength="16"
                  minLength="16"
                  pattern="\d{16}"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V7.5a4.5 4.5 0 00-9 0v3M6.75 10.5h10.5v9.75H6.75V10.5z"
                    />
                  </svg>
                </span>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-full border border-blue-100 bg-[#edf3ff] text-gray-900 pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                />
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold py-3 shadow-md"
              >
                REGISTER
              </motion.button>
            </form>

            <div className="text-sm mt-4 text-center text-gray-600">
              Already have an account?{" "}
              <a href="/student" className="text-blue-600 hover:underline font-medium">
                Login Here
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
