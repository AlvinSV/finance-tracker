import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, deleteDoc, doc, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const CATEGORIES = ["Food", "Shopping", "Transport", "Health", "Entertainment", "Other"];

export default function Budget() {
  const { currentUser } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState("Food");
  const [limit, setLimit] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q1 = query(collection(db, "budgets"), where("uid", "==", currentUser.uid));
    const unsub1 = onSnapshot(q1, (snap) => {
      setBudgets(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    const q2 = query(collection(db, "transactions"), where("uid", "==", currentUser.uid));
    const unsub2 = onSnapshot(q2, (snap) => {
      setTransactions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => { unsub1(); unsub2(); };
  }, [currentUser]);

  async function handleAdd(e) {
    e.preventDefault();
    setLoading(true);
    await addDoc(collection(db, "budgets"), {
      uid: currentUser.uid,
      category,
      limit: parseFloat(limit),
    });
    setLimit(""); setShowForm(false); setLoading(false);
  }

  async function handleDelete(id) {
    await deleteDoc(doc(db, "budgets", id));
  }

  function getSpent(cat) {
    return transactions
      .filter((t) => t.type === "expense" && t.category === cat)
      .reduce((s, t) => s + t.amount, 0);
  }

  function getBarColor(spent, limit) {
    const pct = (spent / limit) * 100;
    if (pct >= 100) return "#EF4444";
    if (pct >= 80) return "#F59E0B";
    return "#22C55E";
  }

  return (
    <div style={{ display: "flex", fontFamily: "sans-serif", background: "#F8FAFC", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ marginLeft: "220px", flex: 1, padding: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "600", color: "#0F172A", margin: "0 0 4px" }}>Budget Goals</h1>
            <p style={{ color: "#64748B", fontSize: "14px", margin: 0 }}>Set limits and track your spending</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            style={{ background: "#22C55E", color: "#0F172A", border: "none", borderRadius: "10px", padding: "10px 18px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
            + Add Budget
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div style={{ background: "#fff", borderRadius: "14px", border: "0.5px solid #E2E8F0", padding: "24px", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#0F172A", margin: "0 0 20px" }}>New Budget Goal</h2>
            <form onSubmit={handleAdd}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#64748B", marginBottom: "6px" }}>Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", border: "0.5px solid #E2E8F0", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#64748B", marginBottom: "6px" }}>Monthly Limit (₹)</label>
                  <input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} placeholder="e.g. 5000" required
                    style={{ width: "100%", padding: "10px 12px", border: "0.5px solid #E2E8F0", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" disabled={loading}
                  style={{ flex: 1, padding: "12px", background: "#22C55E", color: "#0F172A", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                  {loading ? "Saving..." : "Save Budget"}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ padding: "12px 20px", background: "#F1F5F9", color: "#64748B", border: "none", borderRadius: "10px", fontSize: "14px", cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Budget Cards */}
        {budgets.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: "14px", border: "0.5px solid #E2E8F0", padding: "60px", textAlign: "center", color: "#94A3B8", fontSize: "14px" }}>
            No budgets yet. Set your first budget goal! 🎯
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {budgets.map((b) => {
              const spent = getSpent(b.category);
              const pct = Math.min((spent / b.limit) * 100, 100);
              const color = getBarColor(spent, b.limit);
              const remaining = b.limit - spent;
              return (
                <div key={b.id} style={{ background: "#fff", borderRadius: "14px", border: "0.5px solid #E2E8F0", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                    <div>
                      <div style={{ fontSize: "15px", fontWeight: "600", color: "#0F172A", marginBottom: "2px" }}>{b.category}</div>
                      <div style={{ fontSize: "12px", color: "#94A3B8" }}>Monthly Budget</div>
                    </div>
                    <button onClick={() => handleDelete(b.id)}
                      style={{ background: "#FEE2E2", color: "#EF4444", border: "none", borderRadius: "8px", padding: "5px 8px", cursor: "pointer", fontSize: "13px" }}>
                      🗑️
                    </button>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px" }}>
                    <span style={{ color: "#64748B" }}>Spent: <strong style={{ color: "#0F172A" }}>₹{spent.toLocaleString("en-IN")}</strong></span>
                    <span style={{ color: "#64748B" }}>Limit: <strong style={{ color: "#0F172A" }}>₹{b.limit.toLocaleString("en-IN")}</strong></span>
                  </div>
                  <div style={{ height: "8px", background: "#F1F5F9", borderRadius: "99px", overflow: "hidden", marginBottom: "10px" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "99px", transition: "width 0.4s ease" }} />
                  </div>
                  <div style={{ fontSize: "12px", color: remaining >= 0 ? "#22C55E" : "#EF4444", fontWeight: "500" }}>
                    {remaining >= 0 ? `₹${remaining.toLocaleString("en-IN")} remaining` : `₹${Math.abs(remaining).toLocaleString("en-IN")} over budget!`}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}