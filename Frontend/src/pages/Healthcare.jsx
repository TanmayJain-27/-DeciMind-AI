import { useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import XAIGraph from "../components/XAIGraph";

function Healthcare() {
  const [formData, setFormData] = useState({
    age: "",
    heartRate: "",
    bloodPressure: "",
    oxygenLevel: "",
    existingCondition: "no",
    hereditary: [],
    smoking: "no",
    alcohol: "no",
    bmi: "normal",
  });

  const [result, setResult] = useState(null);
  const [finalDecision, setFinalDecision] = useState(null);
  const [reason, setReason] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleHereditaryChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      hereditary: checked
        ? [...prev.hereditary, value]
        : prev.hereditary.filter((v) => v !== value),
    }));
  };

  const handleSubmit = async () => {
    const res = await fetch("https://decimind-ai-backend.onrender.com/api/health-risk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setResult(data);
    setFinalDecision(null);
    setReason("");
  };

  const submitHumanDecision = async (decision) => {
    if (decision !== result.decision && reason.trim() === "") {
      alert("Reason required for override");
      return;
    }

    await fetch("https://decimind-ai-backend.onrender.com/api/decision-log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        domain: "Healthcare",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <Navbar />

      <header className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white py-8 text-center">
        <h1 className="text-3xl font-bold">
          🏥 Healthcare – Clinical Risk Assessment
        </h1>
        <p className="text-blue-100 mt-2">
          AI risk prediction with human medical governance
        </p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto p-10 mt-10 bg-white/80 backdrop-blur rounded-2xl shadow-xl"
      >
        <div className="grid gap-6">

          {/* VITALS */}
          <Section title="Patient Vitals">
            <Input label="Age" name="age" placeholder="65" onChange={handleChange} />
            <Input label="Heart Rate (bpm)" name="heartRate" placeholder="110" onChange={handleChange} />
            <Input label="Blood Pressure (mmHg)" name="bloodPressure" placeholder="150" onChange={handleChange} />
            <Input label="Oxygen Level (%)" name="oxygenLevel" placeholder="90" onChange={handleChange} />
          </Section>

          {/* MEDICAL HISTORY */}
          <Section title="Medical History">
            <Select label="Existing Condition" name="existingCondition" onChange={handleChange}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </Select>

            <div>
              <label className="font-semibold">Family History</label>
              <div className="mt-2 border rounded p-3 bg-gray-50">
                {["Heart Disease", "Diabetes", "Cancer"].map((h) => (
                  <label key={h} className="block">
                    <input
                      type="checkbox"
                      value={h.toLowerCase()}
                      onChange={handleHereditaryChange}
                      className="mr-2"
                    />
                    {h}
                  </label>
                ))}
              </div>
            </div>
          </Section>

          {/* LIFESTYLE */}
          <Section title="Lifestyle Factors">
            <Select label="Smoking" name="smoking" onChange={handleChange}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </Select>

            <Select label="Alcohol" name="alcohol" onChange={handleChange}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </Select>

            <Select label="BMI" name="bmi" onChange={handleChange}>
              <option value="normal">Normal</option>
              <option value="overweight">Overweight</option>
              <option value="obese">Obese</option>
            </Select>
          </Section>

          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-semibold"
          >
            🧠 Analyze Health Risk
          </button>

          {/* AI RESULT */}
          {result && (
            <div className="p-4 bg-blue-50 border rounded-xl">
              <h3 className="font-bold text-blue-700">
                AI Decision: {result.decision}
              </h3>
              <p>Confidence: {result.confidence}%</p>

{/* 🤖 ML RESULT */}
<div className="mt-4 p-3 bg-purple-50 border rounded-lg">
  <h3 className="font-bold text-purple-700">
    ML Prediction: {result.mlDecision}
  </h3>
  <p>Confidence: {result.mlConfidence}%</p>
</div>

{/* 🔍 COMPARISON */}
<div className="mt-4 p-3 rounded-lg border">
  {result.decision === result.mlDecision ? (
    <p className="text-green-600 font-semibold">
      ✅ AI & ML agree
    </p>
  ) : (
    <p className="text-red-600 font-semibold">
      ⚠ Conflict — Doctor review required
    </p>
  )}
</div>

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

              {/* ML GOVERNANCE (AUTO-WORKS WHEN BACKEND ADDS IT) */}
              {result.overrideRisk !== undefined && (
                <div className={`mt-3 p-3 rounded-lg ${
                  result.riskLevel === "HIGH"
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}>
                  <strong>Governance Alert:</strong> {result.governanceMessage}
                </div>
              )}
            </div>
          )}

          {/* HUMAN DECISION */}
          {result && !finalDecision && (
            <div className="border p-4 rounded-xl bg-white">
              <textarea
                placeholder="Doctor override reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="border p-3 rounded w-full mb-3"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => submitHumanDecision("LOW RISK")}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Low Risk
                </button>
                <button
                  onClick={() => submitHumanDecision("HIGH RISK")}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  High Risk
                </button>
              </div>
            </div>
          )}

          {finalDecision && (
            <div className="p-4 bg-green-100 rounded-xl">
              Final Decision: {finalDecision}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ===== SMALL REUSABLE UI PARTS ===== */

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-blue-700 mb-3 border-b pb-1">
        {title}
      </h2>
      <div className="grid gap-4">{children}</div>
    </div>
  );
}

function Input({ label, name, placeholder, onChange }) {
  return (
    <div>
      <label className="font-semibold">{label}</label>
      <input
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        className="mt-1 border p-3 rounded w-full"
      />
    </div>
  );
}

function Select({ label, name, onChange, children }) {
  return (
    <div>
      <label className="font-semibold">{label}</label>
      <select
        name={name}
        onChange={onChange}
        className="mt-1 border p-3 rounded w-full"
      >
        {children}
      </select>
    </div>
  );
}

export default Healthcare;