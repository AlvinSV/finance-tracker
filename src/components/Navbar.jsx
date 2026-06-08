import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "🏠" },
    { path: "/transactions", label: "Transactions", icon: "💳" },
    { path: "/budget", label: "Budgets", icon: "🎯" },
    { path: "/charts", label: "Analytics", icon: "📊" },
  ];

  return (
    <div style={{ width: "220px", minHeight: "100vh", background: "#0F172A", display: "flex", flexDirection: "column", padding: "20px 0", position: "fixed", top: 0, left: 0 }}>
      {/* Logo */}
      <div style={{ padding: "0 20px 24px", borderBottom: "0.5px solid rgba(255,255,255,0.08)", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", background: "#22C55E", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>💰</div>
          <div>
            <div style={{ color: "#fff", fontSize: "16px", fontWeight: "600" }}>FinTrack</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px" }}>Personal Finance</div>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <div style={{ padding: "0 12px", flex: 1 }}>
        <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", padding: "0 8px 8px", letterSpacing: "0.08em" }}>MAIN MENU</div>
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <div key={item.path} onClick={() => navigate(item.path)}
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", marginBottom: "4px", cursor: "pointer", background: active ? "rgba(34,197,94,0.15)" : "transparent", borderLeft: active ? "2px solid #22C55E" : "2px solid transparent", color: active ? "#fff" : "rgba(255,255,255,0.5)", fontSize: "14px", transition: "all 0.15s" }}>
              <span style={{ fontSize: "16px" }}>{item.icon}</span>
              {item.label}
            </div>
          );
        })}
      </div>

      {/* User + Logout */}
      <div style={{ padding: "16px 20px", borderTop: "0.5px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#22C55E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "600", color: "#0F172A" }}>
            {currentUser?.email?.[0].toUpperCase()}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ color: "#fff", fontSize: "13px", fontWeight: "500" }}>My Account</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentUser?.email}</div>
          </div>
        </div>
        <button onClick={handleLogout}
          style={{ width: "100%", padding: "8px", background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "0.5px solid rgba(239,68,68,0.2)", borderRadius: "8px", fontSize: "13px", cursor: "pointer" }}>
          Logout
        </button>
      </div>
    </div>
  );
}