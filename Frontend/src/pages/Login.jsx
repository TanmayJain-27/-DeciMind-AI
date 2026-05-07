import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch("https://decimind-ai-backend.onrender.com/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok && data.token) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role);
  localStorage.setItem("userName", data.name);

  data.role === "admin" ? navigate("/admin") : navigate("/home");
}
    else {
      alert(data.error || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700 flex flex-col items-center justify-center">

      {/* 🌈 Background blobs */}
      <div className="absolute w-[500px] h-[500px] bg-pink-400 rounded-full blur-3xl opacity-30 top-[-100px] left-[-100px]" />
      <div className="absolute w-[500px] h-[500px] bg-blue-400 rounded-full blur-3xl opacity-30 bottom-[-100px] right-[-100px]" />

      {/* 🔥 PLATFORM HEADING (OUTSIDE CARD) */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center mb-10 px-6"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-wide text-white">
          DeciMind AI
        </h1>
        <p className="mt-4 text-lg md:text-xl text-white/80">
          AI Governance • Human Oversight • Responsible Decisions
        </p>
        <p className="mt-2 text-sm text-white/60 uppercase tracking-widest">
          Secure Platform Access
        </p>
      </motion.div>

      {/* 🧊 GLASS LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-10 w-96 text-white"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Welcome Back
        </h2>

        {/* Email */}
        <div className="mb-4 relative">
          <Mail className="absolute left-3 top-3 text-white/70" />
          <input
            placeholder="Email"
            className="pl-10 w-full p-3 rounded-lg bg-white/20 placeholder-white/70 outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-6 relative">
          <Lock className="absolute left-3 top-3 text-white/70" />
          <input
            type="password"
            placeholder="Password"
            className="pl-10 w-full p-3 rounded-lg bg-white/20 placeholder-white/70 outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-lg bg-black/80 hover:bg-black transition font-semibold"
        >
          Login
        </button>

        <p className="text-sm text-center mt-6 text-white/80">
          Don’t have an account?{" "}
          <span
            className="underline cursor-pointer font-semibold"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;