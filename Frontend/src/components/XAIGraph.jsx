import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = {
  positive: ["#34d399", "#10b981"], // emerald gradient
  negative: ["#fb7185", "#e11d48"], // rose gradient
};

function XAIGraph({ factors }) {
  if (!factors || factors.length === 0) return null;

  const data = factors.map((f) => ({
    feature: f.feature,
    score: f.weight ?? (f.impact === "Positive" ? 12 : -12),
    impact: f.impact,
    reason: f.reason,
  }));

  return (
    <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 shadow-xl">
      <h3 className="text-xl font-bold text-indigo-800 mb-1">
        📊 Explainable AI – Feature Impact Graph
      </h3>
      <p className="text-sm text-indigo-500 mb-5">
        Visual breakdown of how each factor influenced the AI decision
      </p>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 30, right: 20 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="feature"
            width={140}
            tick={{ fill: "#4f46e5", fontSize: 12 }}
          />

          <Tooltip
            cursor={{ fill: "rgba(99,102,241,0.08)" }}
            content={({ payload }) => {
              if (!payload || !payload.length) return null;
              const p = payload[0].payload;
              return (
                <div className="bg-white p-3 rounded-xl shadow-lg border">
                  <p className="font-semibold">{p.feature}</p>
                  <p className="text-sm text-gray-600">{p.reason}</p>
                  <p
                    className={`text-sm font-bold mt-1 ${
                      p.impact === "Positive"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    Impact: {p.impact}
                  </p>
                </div>
              );
            }}
          />

          <Bar dataKey="score" radius={[10, 10, 10, 10]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.impact === "Positive"
                    ? COLORS.positive[index % 2]
                    : COLORS.negative[index % 2]
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          Supports AI decision
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500" />
          Opposes AI decision
        </div>
      </div>
    </div>
  );
}

export default XAIGraph;