import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Admin Credentials
    if (username === "admin" && password === "1234") {
      localStorage.setItem("isAdmin", "true");
      if (typeof onLogin === "function") onLogin();
      navigate("/admin", { replace: true });
    } else {
      setError("❌ Invalid ID or Password");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/Login_image.png')" }} // ✅ Correct path from public folder
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Glassmorphism Login Box with ONLY border neon glow */}
      <div className="relative z-10 w-full max-w-md p-10 rounded-3xl 
                      bg-white/10 backdrop-blur-xl border border-cyan-400/40 shadow-2xl 
                      animate-fade-in-up neon-border">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-4 text-white">
          Blockchain-Based Academic Certificate Verification and Credit Transfer System
        </h1>
        <p className="text-gray-200 text-center mb-8 animate-fade-in">
          Secure • Transparent • Decentralized
        </p>

        {/* Error Message */}
        {error && (
          <p className="text-red-400 text-center font-medium mb-4 animate-shake">
            {error}
          </p>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Admin ID"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 
                       focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 
                       focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-300"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 text-white font-semibold 
                       hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/40 transition duration-300"
          >
            🚀 Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-gray-300 text-center mt-6 text-sm animate-fade-in">
          © 2025 Blockchain Certificate System
        </p>
      </div>

      {/* Animations & Effects */}
      <style>{`
        /* Fade In */
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 1s ease forwards; }
        .animate-fade-in-up { animation: fade-in 1.2s ease forwards; }

        /* Shake for error */
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.3s ease; }

        /* Neon Border Animation (only border glows, not text) */
        @keyframes border-glow {
          0%, 100% { box-shadow: 0 0 10px #0ff, 0 0 20px #0ff inset; }
          50% { box-shadow: 0 0 20px #0ff, 0 0 40px #0ff inset; }
        }
        .neon-border { animation: border-glow 3s infinite alternate; }
      `}</style>
    </div>
  );
}
