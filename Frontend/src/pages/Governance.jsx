import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function Governance() {
  const [score, setScore] = useState(null);
  const [drift, setDrift] = useState(null);

  useEffect(() => {
    fetch("https://decimind-ai-backend.onrender.com/api/admin/governance-score", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(setScore);

    fetch("https://decimind-ai-backend.onrender.com/api/admin/drift-radar", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(setDrift);
  }, []);

  if (!score || !drift) {
    return <div className="p-10">Loading Governance Engine…</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto p-10 space-y-8">

        {/* GOVERNANCE SCORE */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-2xl font-bold mb-3">
            🛡 Enterprise Governance Score
          </h2>

          <div className="flex items-center gap-6">
            <div className="text-6xl font-extrabold">
              {score.governanceScore}
            </div>

            <span
              className={`px-4 py-2 rounded-full font-semibold ${
                score.status === "Healthy"
                  ? "bg-green-100 text-green-700"
                  : score.status === "Warning"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {score.status}
            </span>
          </div>
        </div>

        {/* DOMAIN BREAKDOWN */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-xl font-bold mb-4">📊 Domain Governance</h2>

          {Object.entries(score.domains).map(([domain, d]) => (
            <div key={domain} className="mb-3">
              <p className="font-semibold">{domain}</p>
              <p className="text-sm text-gray-600">
                Overrides: {d.overrides} / {d.total}
              </p>
            </div>
          ))}
        </div>

        {/* DRIFT RADAR */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-xl font-bold mb-2">📡 Drift Radar</h2>

          <p className="font-semibold mb-2">
            Status:{" "}
            <span
              className={`${
                drift.status === "Stable"
                  ? "text-green-600"
                  : drift.status === "Warning"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {drift.status}
            </span>
          </p>

          {drift.signals.length === 0 ? (
            <p className="text-gray-600">No drift detected.</p>
          ) : (
            <ul className="list-disc pl-6 text-red-600">
              {drift.signals.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

export default Governance;