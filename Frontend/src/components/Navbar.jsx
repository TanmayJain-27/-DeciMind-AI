import { useNavigate } from "react-router-dom";
import {
  Home,
  ShieldCheck,
  HeartPulse,
  Briefcase,
  GraduationCap,
  Landmark,
  LogOut,
  User
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const name = localStorage.getItem("userName");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-4 shadow-lg flex justify-between items-center">

      {/* LOGO */}
      <div
        className="text-2xl font-extrabold cursor-pointer tracking-wide"
        onClick={() => navigate("/home")}
      >
        DeciMind AI
      </div>

      {/* NAV LINKS */}
      <div className="flex gap-6 items-center text-sm font-semibold">
        <NavItem icon={<Home size={18} />} label="Home" onClick={() => navigate("/home")} />
        <NavItem icon={<Landmark size={18} />} label="Finance" onClick={() => navigate("/finance")} />
        <NavItem icon={<HeartPulse size={18} />} label="Healthcare" onClick={() => navigate("/healthcare")} />
        <NavItem icon={<Briefcase size={18} />} label="HR" onClick={() => navigate("/hr")} />
        <NavItem icon={<ShieldCheck size={18} />} label="Cybersecurity" onClick={() => navigate("/cybersecurity")} />
        <NavItem icon={<GraduationCap size={18} />} label="Education" onClick={() => navigate("/education")} />

        {role === "admin" && (
          <NavItem
            icon={<User size={18} />}
            label="Admin"
            onClick={() => navigate("/admin")}
          />
        )}
      </div>

      {/* USER INFO */}
      <div className="flex items-center gap-4">
        <div className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
           {name}
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-full text-sm"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  );
}

/* Small reusable nav button */
function NavItem({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 hover:bg-white/20 px-4 py-2 rounded-full transition-all"
    >
      {icon}
      {label}
    </button>
  );
}

export default Navbar;