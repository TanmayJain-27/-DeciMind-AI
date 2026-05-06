import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  HeartPulse,
  Briefcase,
  GraduationCap,
  Landmark,
} from "lucide-react";

function Home() {
  const navigate = useNavigate();

  const domains = [
    {
      title: "Finance",
      desc: "Explainable loan approvals with confidence scoring, override governance, and auditability.",
      icon: <Landmark size={40} />,
      color: "from-emerald-400 to-cyan-500",
      path: "/finance",
    },
    {
      title: "Healthcare",
      desc: "Clinical risk intelligence with doctor-in-the-loop validation and transparent AI reasoning.",
      icon: <HeartPulse size={40} />,
      color: "from-rose-400 to-pink-500",
      path: "/healthcare",
    },
    {
      title: "Human Resources",
      desc: "Bias-aware hiring decisions with explainability, recruiter control, and accountability.",
      icon: <Briefcase size={40} />,
      color: "from-indigo-400 to-sky-500",
      path: "/hr",
    },
    {
      title: "Cybersecurity",
      desc: "Fraud & threat detection with drift monitoring and analyst-driven overrides.",
      icon: <ShieldCheck size={40} />,
      color: "from-purple-400 to-fuchsia-500",
      path: "/cybersecurity",
    },
    {
      title: "Education",
      desc: "Student risk analysis with educator oversight and explainable predictions.",
      icon: <GraduationCap size={40} />,
      color: "from-amber-400 to-orange-500",
      path: "/education",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 relative overflow-hidden">
      {/* ✅ NAVBAR MUST STAY ON TOP */}
      <Navbar />

      {/* ✅ BACKGROUND GRID — DOES NOT BLOCK CLICKS */}
      <div
        className="absolute inset-0
        bg-[radial-gradient(circle_at_1px_1px,rgba(99,102,241,0.12)_1px,transparent_0)]
        bg-[size:28px_28px]
        pointer-events-none"
      />

      {/* ================= ABOUT ================= */}
      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-24 text-center">
        <h1 className="text-6xl font-extrabold text-gray-900 mb-5 tracking-tight">
          DeciMind AI : An AI-Powered Decision Intelligence System
        </h1>

        <p className="text-xl text-gray-600 mb-10">
          AI Decisions with Mandatory Human Governance
        </p>

        <p className="text-lg text-gray-700 max-w-5xl mx-auto leading-relaxed">
          Human-Driven Intelligent Systems (HDIS) is a governance-first AI platform
          built for high-risk decision environments where accountability matters.
          Every AI output is explainable, confidence-scored, auditable, and
          explicitly subject to human override. The system continuously measures
          trust, divergence, and drift to ensure AI remains aligned with human
          judgment across critical domains.
        </p>
      </div>

      {/* ================= DOMAINS ================= */}
      <div className="relative max-w-7xl mx-auto px-6 pb-32 space-y-24">
        {domains.map((d, i) => {
          const isLeft = i % 2 === 0;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className={`flex ${isLeft ? "justify-start" : "justify-end"}`}
            >
              <div
                onClick={() => navigate(d.path)}
                className="w-full md:w-[75%]
                  cursor-pointer
                  bg-white/80 backdrop-blur
                  border border-gray-200
                  rounded-3xl p-8
                  transition-all duration-300
                  hover:scale-[1.025]
                  hover:shadow-[0_25px_70px_-20px_rgba(99,102,241,0.4)]"
              >
                <div className="flex items-center gap-8">
                  <div
                    className={`w-20 h-20 flex items-center justify-center
                    rounded-2xl bg-gradient-to-br ${d.color}
                    text-white shadow-lg`}
                  >
                    {d.icon}
                  </div>

                  <div>
                    <h3 className="text-2xl font-extrabold mb-2 text-gray-900">
                      {d.title}
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      {d.desc}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;