import { useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import XAIGraph from "../components/XAIGraph";
import {
  Landmark,
  IndianRupee,
  CreditCard,
  Briefcase,
  AlertTriangle,
} from "lucide-react";

function Finance() {
  const [formData, setFormData] = useState({
    age: "",
    income: "",
    creditScore: "",
    loanAmount: "",
    employment: "employed",
  });

  const [result, setResult] = useState(null);
  const [finalDecision, setFinalDecision] = useState(null);
  const [reason, setReason] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const response = await fetch("https://decimind-ai-backend.onrender.com/api/loan-predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setResult(await response.json());
    setFinalDecision(null);
    setReason("");
  };

  const submitHumanDecision = async (decision) => {
    if (decision !== result.decision && reason.trim() === "") {
      alert("Please provide a reason for overriding AI decision");
      return;
    }

    await fetch("https://decimind-ai-backend.onrender.com/api/decision-log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        domain: "Finance",
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-700 via-teal-700 to-yellow-600">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto p-10"
      >
        {/* HEADER */}
        <div className="text-center text-white mb-12">
          <Landmark size={56} className="mx-auto mb-4 text-yellow-300" />
          <h1 className="text-4xl font-extrabold tracking-wide">
            Finance – Loan Approval
          </h1>
          <p className="text-white/80 mt-2">
            AI-powered loan decisioning with human governance
          </p>
        </div>

        {/* GLASS CARD */}
        <div className="bg-white/15 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-2xl p-10 text-white">
          {/* INPUT GRID */}
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Age"
              icon={<Briefcase className="text-yellow-300" />}
              name="age"
              placeholder="28"
              onChange={handleChange}
            />

            <Input
              label="Annual Income (₹)"
              icon={<IndianRupee className="text-yellow-300" />}
              name="income"
              placeholder="600000"
              onChange={handleChange}
            />

            <Input
              label="Credit Score"
              icon={<CreditCard className="text-yellow-300" />}
              name="creditScore"
              placeholder="750"
              onChange={handleChange}
            />

            <Input
              label="Loan Amount"
              icon={<IndianRupee className="text-yellow-300" />}
              name="loanAmount"
              placeholder="800000"
              onChange={handleChange}
            />

            <div>
              <label className="block font-semibold mb-1">
                Employment Status
              </label>
              <select
                name="employment"
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-white/20 outline-none"
              >
                <option value="employed">Employed</option>
                <option value="self-employed">Self-Employed</option>
                <option value="unemployed">Unemployed</option>
              </select>
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            className="mt-10 w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-emerald-500 text-black font-bold hover:scale-[1.02] transition"
          >
            💰 Get AI Loan Decision
          </button>

          {/* ================= AI + ML OUTPUT ================= */}
{result && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="mt-6 space-y-6"
  >

    {/* 🧠 RULE-BASED AI */}
    <div className="p-6 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-emerald-500/20 border border-yellow-300">
      <h3 className="text-xl font-bold text-yellow-300 mb-3">
        🧠 Governance AI (Rule-Based)
      </h3>

      <p className="text-lg">
        <strong>Decision:</strong> {result.decision}
      </p>
      <p className="text-lg">
        <strong>Confidence:</strong> {result.confidence}%
      </p>
    </div>

    {/* 🤖 ML MODEL */}
    <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-300">
      <h3 className="text-xl font-bold text-purple-300 mb-3">
        🤖 Machine Learning Model
      </h3>

      <p className="text-lg">
        <strong>Prediction:</strong> {result.mlDecision}
      </p>
      <p className="text-lg">
        <strong>Confidence:</strong> {result.mlConfidence}%
      </p>

      <p className="text-sm opacity-70 mt-2">
        Model: Logistic Regression
      </p>
    </div>

    {/* 🔍 COMPARISON */}
    <div className="p-6 rounded-2xl bg-white/10 border border-white/30">
      <h3 className="text-xl font-bold text-white mb-3">
        🔍 Comparison Layer
      </h3>

      {result.decision === result.mlDecision ? (
        <div className="p-4 bg-green-500/20 text-green-300 rounded-xl font-semibold text-lg">
          ✅ Both AI and ML agree
        </div>
      ) : (
        <div className="p-4 bg-red-500/20 text-red-300 rounded-xl font-semibold text-lg">
          ⚠ AI and ML disagree — Human review required
        </div>
      )}
    </div>

  </motion.div>
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

          {/* 🧠 GOVERNANCE WARNING (ML FEATURE) */}
          {result?.overrideRisk !== undefined && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mt-4 p-5 rounded-xl border-l-8 ${
                result.riskLevel === "HIGH"
                  ? "bg-red-500/20 border-red-500"
                  : result.riskLevel === "MEDIUM"
                  ? "bg-yellow-500/20 border-yellow-400"
                  : "bg-green-500/20 border-green-400"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle />
                <h4 className="font-bold text-lg">
                  Human–AI Governance Alert
                </h4>
              </div>

              <p className="text-sm">{result.governanceMessage}</p>

              <p className="text-xs mt-2 opacity-80">
                Predicted Override Risk:{" "}
                {(result.overrideRisk * 100).toFixed(0)}%
              </p>
            </motion.div>
          )}

          {/* HUMAN DECISION */}
          {result && !finalDecision && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-5 border border-white/30 rounded-xl"
            >
              <label className="font-semibold mb-2 block">
                Human Override Reason
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-3 rounded bg-white/20 outline-none mb-4"
                placeholder="Explain if overriding AI decision"
              />

              <div className="flex gap-4">
                <button
                  onClick={() => submitHumanDecision("APPROVE")}
                  className="bg-green-600 px-6 py-2 rounded-xl font-semibold"
                >
                  Approve
                </button>
                <button
                  onClick={() => submitHumanDecision("REJECT")}
                  className="bg-red-600 px-6 py-2 rounded-xl font-semibold"
                >
                  Reject
                </button>
              </div>
            </motion.div>
          )}

          {/* FINAL */}
          {finalDecision && (
            <div className="mt-6 p-4 bg-green-500/20 border border-green-300 rounded-xl">
              Final Decision: {finalDecision}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* REUSABLE INPUT */
function Input({ label, icon, name, placeholder, onChange }) {
  return (
    <div>
      <label className="block font-semibold mb-1">{label}</label>
      <div className="flex items-center gap-3 bg-white/20 p-3 rounded-xl">
        {icon}
        <input
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          className="bg-transparent outline-none w-full placeholder-white/70"
        />
      </div>
      <p className="text-sm text-white/70 mt-1">
        Example: {placeholder}
      </p>
    </div>
  );
}

export default Finance;