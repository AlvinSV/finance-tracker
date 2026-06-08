import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "420px", padding: "0 20px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: "52px", height: "52px", background: "#22C55E", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <span style={{ fontSize: "26px" }}>💰</span>
          </div>
          <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: "600", margin: "0 0 4px" }}>FinTrack</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", margin: 0 }}>Your personal finance tracker</p>
        </div>

        {/* Card */}
        <div style={{ background: "#1E293B", borderRadius: "16px", padding: "32px", border: "0.5px solid rgba(255,255,255,0.08)" }}>

          {/* Tabs */}
          <div style={{ display: "flex", background: "#0F172A", borderRadius: "10px", padding: "4px", marginBottom: "24px" }}>
            <button onClick={() => setIsLogin(true)} style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "500", background: isLogin ? "#22C55E" : "transparent", color: isLogin ? "#0F172A" : "rgba(255,255,255,0.4)", transition: "all 0.2s" }}>
              Login
            </button>
            <button onClick={() => setIsLogin(false)} style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "500", background: !isLogin ? "#22C55E" : "transparent", color: !isLogin ? "#0F172A" : "rgba(255,255,255,0.4)", transition: "all 0.2s" }}>
              Sign Up
            </button>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: "#FEE2E2", color: "#991B1B", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px" }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "13px", marginBottom: "6px" }}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alvin Jose"
                  required={!isLogin}
                  style={{ width: "100%", padding: "10px 14px", background: "#0F172A", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", fontSize: "14px", outline: "none" }}
                />
              </div>
            )}

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "13px", marginBottom: "6px" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                style={{ width: "100%", padding: "10px 14px", background: "#0F172A", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", fontSize: "14px", outline: "none" }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "13px", marginBottom: "6px" }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ width: "100%", padding: "10px 14px", background: "#0F172A", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", fontSize: "14px", outline: "none" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: "12px", background: "#22C55E", color: "#0F172A", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Please wait..." : isLogin ? "Login →" : "Create Account →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}