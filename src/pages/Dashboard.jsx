import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "transactions"), where("uid", "==", currentUser.uid));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTransactions(data);
    });
    return unsub;
  }, [currentUser]);

  const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;
  const recent = [...transactions].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);

  const categoryColors = { Food: "#F59E0B", Shopping: "#8B5CF6", Transport: "#3B82F6", Health: "#EF4444", Entertainment: "#EC4899", Salary: "#22C55E", Other: "#6B7280" };

  return (
    <div style={{ display: "flex", fontFamily: "sans-serif", background: "#F8FAFC", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ marginLeft: "220px", flex: 1, padding: "32px" }}>

        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "600", color: "#0F172A", margin: "0 0 4px" }}>Dashboard</h1>
          <p style={{ color: "#64748B", fontSize: "14px", margin: 0 }}>Welcome back! Here's your financial summary.</p>
        </div>

        {/* Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "28px" }}>
          {[
            { label: "Total Balance", value: balance, color: "#22C55E", bg: "#0F172A" },
            { label: "Total Income", value: income, color: "#22C55E", bg: "#F0FDF4" },
            { label: "Total Expenses", value: expense, color: "#EF4444", bg: "#FFF1F2" },
          ].map((card) => (
            <div key={card.label} style={{ background: card.bg, borderRadius: "14px", padding: "20px 24px", border: card.bg === "#0F172A" ? "none" : "0.5px solid #E2E8F0" }}>
              <div style={{ fontSize: "13px", color: card.bg === "#0F172A" ? "rgba(255,255,255,0.5)" : "#64748B", marginBottom: "8px" }}>{card.label}</div>
              <div style={{ fontSize: "26px", fontWeight: "700", color: card.bg === "#0F172A" ? "#22C55E" : card.color }}>
                ₹{card.value.toLocaleString("en-IN")}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Transactions */}
        <div style={{ background: "#fff", borderRadius: "14px", border: "0.5px solid #E2E8F0", padding: "20px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#0F172A", margin: 0 }}>Recent Transactions</h2>
          </div>
          {recent.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#94A3B8", fontSize: "14px" }}>
              No transactions yet. Add your first one! 💸
            </div>
          ) : (
            recent.map((t) => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 0", borderBottom: "0.5px solid #F1F5F9" }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: t.type === "income" ? "#DCFCE7" : "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
                  {t.type === "income" ? "💵" : "💸"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: "500", color: "#0F172A" }}>{t.description}</div>
                  <div style={{ fontSize: "12px", color: "#94A3B8" }}>{t.category} • {t.date}</div>
                </div>
                <div style={{ fontSize: "15px", fontWeight: "600", color: t.type === "income" ? "#22C55E" : "#EF4444" }}>
                  {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}