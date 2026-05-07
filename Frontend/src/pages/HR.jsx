import { useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import XAIGraph from "../components/XAIGraph";

// 🔹 PDF support
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

function HR() {
  const [formData, setFormData] = useState({
    resumeText: "",
    experience: "",
    education: "bachelor",
    skillMatch: "",
    companyTier: "low",
  });

  const [result, setResult] = useState(null);
  const [finalDecision, setFinalDecision] = useState(null);
  const [reason, setReason] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // 🔹 PDF → resumeText (NO logic change)
  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = async () => {
      const pdf = await pdfjsLib.getDocument(reader.result).promise;
      let text = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        content.items.forEach((item) => {
          text += item.str + " ";
        });
      }

      setFormData((prev) => ({
        ...prev,
        resumeText: text,
      }));
    };
  };

  const handleSubmit = async () => {
    const res = await fetch("https://decimind-ai-backend.onrender.com/api/hr-evaluate", {
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
      alert("Reason required");
      return;
    }

    await fetch("https://decimind-ai-backend.onrender.com/api/decision-log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        domain: "HR",
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <Navbar />

      <header className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white py-8 text-center shadow">
        <h1 className="text-3xl font-bold">💼 HR – Hiring Decision Support</h1>
        <p className="text-indigo-100 mt-2">
          AI-powered candidate evaluation with recruiter validation
        </p>
      </header>

      <div className="max-w-3xl mx-auto p-10 mt-10 bg-white/80 backdrop-blur rounded-2xl shadow-xl">
        <div className="grid gap-6">

          {/* RESUME */}
          <h2 className="text-xl font-semibold text-indigo-700 border-b pb-2">
            Candidate Resume
          </h2>

          <input
            type="file"
            accept=".pdf"
            onChange={handlePDFUpload}
            className="border p-2 rounded w-full"
          />

          <textarea
            name="resumeText"
            value={formData.resumeText}
            onChange={handleChange}
            placeholder="Paste resume text or upload PDF"
            className="border p-3 rounded w-full h-32"
          />

          {/* PROFILE */}
          <h2 className="text-xl font-semibold text-indigo-700 border-b pb-2 mt-6">
            Candidate Profile
          </h2>

          <input name="experience" placeholder="Experience (Years)" onChange={handleChange} className="border p-3 rounded w-full" />

          <select name="education" onChange={handleChange} className="border p-3 rounded w-full">
            <option value="bachelor">Bachelor</option>
            <option value="master">Master</option>
            <option value="phd">PhD</option>
          </select>

          <input name="skillMatch" placeholder="Skill Match (%)" onChange={handleChange} className="border p-3 rounded w-full" />

          <select name="companyTier" onChange={handleChange} className="border p-3 rounded w-full">
            <option value="low">Startup / Small Company</option>
            <option value="high">Top Tech / MNC</option>
          </select>

          <button onClick={handleSubmit} className="bg-indigo-600 text-white py-3 rounded-xl font-semibold">
            🤖 Evaluate Candidate
          </button>

          {result && (
  <div className="mt-6 space-y-6">

    <div className="p-6 bg-blue-500/20 border border-blue-300 rounded-2xl">
      <h3 className="text-xl font-bold text-blue-300">
        🧠 HR AI Decision
      </h3>
      <p>{result.decision}</p>
      <p>Confidence: {result.confidence}%</p>
    </div>

    <div className="p-6 bg-indigo-500/20 border border-indigo-300 rounded-2xl">
      <h3 className="text-xl font-bold text-indigo-300">
        🤖 ML Hiring Prediction
      </h3>
      <p>{result.mlDecision}</p>
      <p>Confidence: {result.mlConfidence}%</p>
    </div>

    <div className="p-6 bg-white/10 border border-white/30 rounded-2xl">
      {result.decision === result.mlDecision ? (
        <p className="text-green-300">✅ Match</p>
      ) : (
        <p className="text-red-300">⚠ Recruiter validation needed</p>
      )}
    </div>

  </div>
)}

          {/* 🔥 XAI – DETAILED REASONS */}
          {result?.xai && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-5 bg-purple-50 border rounded-xl"
            >
              <h3 className="font-bold text-purple-700 mb-2">
                🧠 Why did AI decide this?
              </h3>

              <p className="text-sm text-gray-700 mb-4">
                {result.xai.summary}
              </p>

              <div className="space-y-3">
                {result.xai.factors.map((f, i) => (
                  <div key={i} className="flex justify-between bg-white p-3 rounded border">
                    <div>
                      <p className="font-semibold">{f.feature}</p>
                      <p className="text-sm text-gray-600">{f.reason}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        f.impact === "Positive"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {f.impact === "Positive" ? "✅ Boosted" : "❌ Penalized"}
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

          {/* HUMAN OVERRIDE */}
          {result && !finalDecision && (
            <div className="border p-5 rounded-xl bg-white">
              <textarea
                placeholder="Recruiter override reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="border p-3 rounded w-full mb-4"
              />
              <div className="flex gap-4">
                <button onClick={() => submitHumanDecision("SHORTLIST")} className="bg-green-600 text-white px-5 py-2 rounded">
                  Shortlist
                </button>
                <button onClick={() => submitHumanDecision("REJECT")} className="bg-red-600 text-white px-5 py-2 rounded">
                  Reject
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
      </div>
    </div>
  );
}

export default HR;