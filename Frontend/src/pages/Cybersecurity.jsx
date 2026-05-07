import { useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import XAIGraph from "../components/XAIGraph";

function Cybersecurity() {
  const [formData, setFormData] = useState({
    amount: "",
    loginAttempts: "",
    ipRisk: "low",
    deviceTrust: "trusted",
  });

  const [result, setResult] = useState(null);
  const [finalDecision, setFinalDecision] = useState(null);
  const [reason, setReason] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const res = await fetch("https://decimind-ai-backend.onrender.com//api/fraud-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setResult(await res.json());
    setFinalDecision(null);
    setReason("");
  };

  const submitHumanDecision = async (decision) => {
    if (decision !== result.decision && reason.trim() === "") {
      alert("Reason required for overriding AI decision");
      return;
    }
    await fetch("https://decimind-ai-backend.onrender.com/api/decision-log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        domain: "Cybersecurity – Fraud Risk",
        aiDecision: result.decision,
        confidence: result.confidence,
        humanDecision: decision,
        reason,
        timestamp: new Date().toISOString(),
      }),
    });

    setFinalDecision(decision);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-gray-200">
      <Navbar />

      {/* HEADER */}
      <header className="bg-gradient-to-r from-cyan-700 to-blue-800 py-8 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-white">
          🔐 Cybersecurity – Fraud Risk Detection
        </h1>
        <p className="text-cyan-200 mt-2">
          AI-powered transaction security with human override
        </p>
      </header>

      {/* MAIN CARD */}
      <div className="max-w-3xl mx-auto p-10 mt-10 bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10">
        <div className="grid gap-6">

          {/* TRANSACTION DETAILS */}
          <h2 className="text-xl font-semibold text-cyan-400 border-b border-cyan-500/30 pb-2">
            Transaction Details
          </h2>

          <div>
            <label className="block font-semibold text-gray-300 mb-1">
              Transaction Amount (INR)
            </label>
            <input
              name="amount"
              placeholder="Example: 75000"
              onChange={handleChange}
              className="w-full bg-black/40 border border-cyan-500/40 p-3 rounded focus:ring-2 focus:ring-cyan-400 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-300 mb-1">
              Failed Login Attempts
            </label>
            <input
              name="loginAttempts"
              placeholder="Example: 4"
              onChange={handleChange}
              className="w-full bg-black/40 border border-cyan-500/40 p-3 rounded focus:ring-2 focus:ring-cyan-400 outline-none"
            />
          </div>

          {/* SECURITY SIGNALS */}
          <h2 className="text-xl font-semibold text-cyan-400 border-b border-cyan-500/30 pb-2 mt-6">
            Security Signals
          </h2>

          <div>
            <label className="block font-semibold text-gray-300 mb-1">
              IP Risk Level
            </label>
            <select
              name="ipRisk"
              onChange={handleChange}
              className="w-full bg-black/40 border border-cyan-500/40 p-3 rounded"
            >
              <option value="low">Low Risk IP</option>
              <option value="high">High Risk IP</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-300 mb-1">
              Device Trust Status
            </label>
            <select
              name="deviceTrust"
              onChange={handleChange}
              className="w-full bg-black/40 border border-cyan-500/40 p-3 rounded"
            >
              <option value="trusted">Trusted Device</option>
              <option value="untrusted">Untrusted / New Device</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-semibold py-3 rounded-xl shadow hover:scale-[1.02] transition"
          >
            🧠 Analyze Fraud Risk
          </button>

          {result && (
  <div className="mt-6 space-y-6">

    <div className="p-6 bg-purple-500/20 border border-purple-300 rounded-2xl">
      <h3 className="text-xl font-bold text-purple-300">
        🧠 AI Threat Detection
      </h3>
      <p>{result.decision}</p>
      <p>Confidence: {result.confidence}%</p>
    </div>

    <div className="p-6 bg-fuchsia-500/20 border border-fuchsia-300 rounded-2xl">
      <h3 className="text-xl font-bold text-fuchsia-300">
        🤖 ML Fraud Detection
      </h3>
      <p>{result.mlDecision}</p>
      <p>Confidence: {result.mlConfidence}%</p>
    </div>

    <div className="p-6 bg-white/10 border border-white/30 rounded-2xl">
      {result.decision === result.mlDecision ? (
        <p className="text-green-300">✅ System aligned</p>
      ) : (
        <p className="text-red-300">⚠ Analyst review required</p>
      )}
    </div>

  </div>
)}
          {/* ================= XAI EXPLANATION ================= */}
{result?.xai && (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="mt-6 p-6 rounded-2xl bg-black/30 border border-yellow-300"
  >
    <h3 className="text-xl font-bold text-yellow-300 mb-2">
      🧠 Why did AI decide this?
    </h3>

    <p className="text-white/80 mb-4">
      {result.xai.summary}
    </p>

    <div className="space-y-3">
      {result.xai.factors.map((f, idx) => (
        <div
          key={idx}
          className="flex justify-between items-start p-3 rounded-xl bg-white/10"
        >
          <div>
            <p className="font-semibold">{f.feature}</p>
            <p className="text-sm text-white/70">{f.reason}</p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              f.impact === "Positive"
                ? "bg-green-500/20 text-green-300"
                : "bg-red-500/20 text-red-300"
            }`}
          >
            {f.impact}
          </span>
        </div>
      ))}
    </div>
  </motion.div>
)}

{/* 📊 XAI GRAPH (ADD BELOW TEXT EXPLANATION) */}
{result?.xai?.factors && (
  <XAIGraph factors={result.xai.factors} />
)}

          {/* HUMAN DECISION */}
          {result && !finalDecision && (
            <div className="p-5 border border-white/10 rounded-xl bg-black/30">
              <label className="block font-semibold text-gray-300 mb-2">
                Security Analyst Override Reason
              </label>
              <textarea
                placeholder="Example: Transaction from new geo-location but verified user behavior."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-black/40 border border-cyan-500/40 p-3 rounded mb-4"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => submitHumanDecision("SAFE")}
                  className="bg-green-600 text-white px-5 py-2 rounded-lg"
                >
                  Mark Safe
                </button>
                <button
                  onClick={() => submitHumanDecision("FRAUD")}
                  className="bg-red-600 text-white px-5 py-2 rounded-lg"
                >
                  Mark Fraud
                </button>
              </div>
            </div>
          )}

          {/* FINAL DECISION */}
          {finalDecision && (
            <div className="p-4 bg-green-900/30 border border-green-500/40 rounded-xl">
              Final Decision: {finalDecision}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Cybersecurity;