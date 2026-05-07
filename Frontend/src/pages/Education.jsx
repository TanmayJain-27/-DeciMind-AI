import { useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import XAIGraph from "../components/XAIGraph";

function Education() {
  const [formData, setFormData] = useState({
    attendance: "",
    internalMarks: "",
    assignmentCompletion: "",
    familySupport: "yes",
  });

  const [result, setResult] = useState(null);
  const [finalDecision, setFinalDecision] = useState(null);
  const [reason, setReason] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ================= AI PREDICTION =================
  const handleSubmit = async () => {
    const response = await fetch("https://decimind-ai-backend.onrender.com/api/student-risk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    setResult(data);
    setFinalDecision(null);
    setReason("");
  };

  // ================= HUMAN DECISION LOG =================
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
        domain: "Education",
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Navbar />

      {/* HEADER */}
      <header className="bg-gradient-to-r from-amber-500 to-orange-600 py-8 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-white">
          🎓 Education – Student Performance Risk
        </h1>
        <p className="text-amber-100 mt-2">
          AI-assisted academic risk analysis with educator validation
        </p>
      </header>

      {/* MAIN CARD */}
      <div className="max-w-3xl mx-auto p-10 bg-white mt-10 rounded-2xl shadow-xl border border-orange-200">
        <div className="grid gap-6">

          {/* ACADEMIC METRICS */}
          <h2 className="text-xl font-semibold text-orange-600 border-b border-orange-300 pb-2">
            Academic Metrics
          </h2>

          <div>
            <label className="block font-semibold text-gray-800 mb-1">
              Attendance (%)
            </label>
            <input
              name="attendance"
              placeholder="Example: 68"
              onChange={handleChange}
              className="w-full border border-orange-300 p-3 rounded focus:ring-2 focus:ring-orange-400 outline-none"
            />
            <p className="text-sm text-gray-400">
              Percentage of classes attended
            </p>
          </div>

          <div>
            <label className="block font-semibold text-gray-800 mb-1">
              Internal Marks (%)
            </label>
            <input
              name="internalMarks"
              placeholder="Example: 35"
              onChange={handleChange}
              className="w-full border border-orange-300 p-3 rounded focus:ring-2 focus:ring-orange-400 outline-none"
            />
            <p className="text-sm text-gray-400">
              Average internal assessment score
            </p>
          </div>

          <div>
            <label className="block font-semibold text-gray-800 mb-1">
              Assignment Completion (%)
            </label>
            <input
              name="assignmentCompletion"
              placeholder="Example: 55"
              onChange={handleChange}
              className="w-full border border-orange-300 p-3 rounded focus:ring-2 focus:ring-orange-400 outline-none"
            />
            <p className="text-sm text-gray-400">
              Percentage of assignments submitted
            </p>
          </div>

          {/* SUPPORT SYSTEM */}
          <h2 className="text-xl font-semibold text-orange-600 border-b border-orange-300 pb-2 mt-6">
            Support System
          </h2>

          <div>
            <label className="block font-semibold text-gray-800 mb-1">
              Family / Academic Support
            </label>
            <select
              name="familySupport"
              onChange={handleChange}
              className="w-full border border-orange-300 p-3 rounded"
            >
              <option value="yes">Has Support System</option>
              <option value="no">Lacks Support System</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 rounded-xl shadow hover:scale-[1.02] transition"
          >
            📊 Predict Academic Risk
          </button>

          {result && (
  <div className="mt-6 space-y-6">

    <div className="p-6 bg-yellow-500/20 border border-yellow-300 rounded-2xl">
      <h3 className="text-xl font-bold text-yellow-300">
        🧠 AI Student Risk
      </h3>
      <p>{result.decision}</p>
      <p>Confidence: {result.confidence}%</p>
    </div>

    <div className="p-6 bg-orange-500/20 border border-orange-300 rounded-2xl">
      <h3 className="text-xl font-bold text-orange-300">
        🤖 ML Prediction
      </h3>
      <p>{result.mlDecision}</p>
      <p>Confidence: {result.mlConfidence}%</p>
    </div>

    <div className="p-6 bg-white/10 border border-white/30 rounded-2xl">
      {result.decision === result.mlDecision ? (
        <p className="text-green-300">✅ Match</p>
      ) : (
        <p className="text-red-300">⚠ Teacher intervention needed</p>
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
            <div className="p-5 border border-orange-200 rounded-xl bg-orange-50">
              <label className="block font-semibold text-gray-800 mb-2">
                Educator Override Reason
              </label>
              <textarea
                placeholder="Example: Student shows improvement trend despite low attendance."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border border-orange-300 p-3 rounded mb-4"
              />

              <div className="flex gap-4">
                <button
                  onClick={() => submitHumanDecision("LOW RISK")}
                  className="bg-green-600 text-white px-5 py-2 rounded-lg"
                >
                  Low Risk
                </button>
                <button
                  onClick={() => submitHumanDecision("HIGH RISK")}
                  className="bg-red-600 text-white px-5 py-2 rounded-lg"
                >
                  High Risk
                </button>
              </div>
            </div>
          )}

          {/* FINAL DECISION */}
          {finalDecision && (
            <div className="p-4 bg-green-100 border border-green-300 rounded-xl">
              Final Decision: {finalDecision}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Education;