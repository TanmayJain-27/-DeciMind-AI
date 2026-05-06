import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleSignup = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Signup successful. Please login.");
      navigate("/login");
    } else {
      alert(data.error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500 via-cyan-500 to-sky-600">
      {/* Glass Card */}
      <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-2xl w-[450px] p-10">

        {/* Branding */}
        <h1 className="text-3xl font-extrabold text-white text-center mb-1">
          HDIS
        </h1>
        <p className="text-center text-white/90 mb-8">
          Create your HDIS account
        </p>

        {/* Full Name */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-white mb-1">
            Full Name
          </label>
          <input
            placeholder="Ram"
            className="w-full px-4 py-3 rounded-lg bg-white/95 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-white mb-1">
            Email Address
          </label>
          <input
            placeholder="ram@example.com"
            className="w-full px-4 py-3 rounded-lg bg-white/95 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-white mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-lg bg-white/95 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Role */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-white mb-1">
            Select Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/95 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Button */}
        <button
          onClick={handleSignup}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold hover:scale-[1.02] transition"
        >
          Create Account
        </button>

        {/* Footer */}
        <p className="text-sm text-center text-white/90 mt-6">
          Already have an account?{" "}
          <span
            className="font-semibold underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;