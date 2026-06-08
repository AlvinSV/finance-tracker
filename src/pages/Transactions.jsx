import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, deleteDoc, doc, query, where, onSnapshot, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const CATEGORIES = ["Food", "Shopping", "Transport", "Health", "Entertainment", "Salary", "Other"];

export default function Transactions() {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "transactions"), where("uid", "==", currentUser.uid));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => b.createdAt - a.createdAt);
      setTransactions(data);
    });
    return unsub;
  }, [currentUser]);

  async function handleAdd(e) {
    e.preventDefault();
    setLoading(true);
    await addDoc(collection(db, "transactions"), {
      uid: currentUser.uid,
      type,
      amount: parseFloat(amount),
      description,
      category,
      date,
      createdAt: Date.now(),
    });
    setAmount(""); setDescription(""); setShowForm(false);
    setLoading(false);
  }

  async function handleDelete(id) {
    await deleteDoc(doc(db, "transactions", id));
  }

  return (
    <div style={{ display: "flex", fontFamily: "sans-serif", background: "#F8FAFC", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ marginLeft: "220px", flex: 1, padding: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "600", color: "#0F172A", margin: "0 0 4px" }}>Transactions</h1>
            <p style={{ color: "#64748B", fontSize: "14px", margin: 0 }}>Manage your income and expenses</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            style={{ background: "#22C55E", color: "#0F172A", border: "none", borderRadius: "10px", padding: "10px 18px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
            + Add Transaction
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div style={{ background: "#fff", borderRadius: "14px", border: "0.5px solid #E2E8F0", padding: "24px", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#0F172A", margin: "0 0 20px" }}>New Transaction</h2>
            <form onSubmit={handleAdd}>
              {/* Type Toggle */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                {["expense", "income"].map((t) => (
                  <button type="button" key={t} onClick={() => setType(t)}
                    style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "0.5px solid", borderColor: type === t ? (t === "income" ? "#22C55E" : "#EF4444") : "#E2E8F0", background: type === t ? (t === "income" ? "#DCFCE7" : "#FEE2E2") : "#fff", color: type === t ? (t === "income" ? "#166534" : "#991B1B") : "#64748B", fontWeight: "500", fontSize: "14px", cursor: "pointer" }}>
                    {t === "income" ? "💵 Income" : "💸 Expense"}
                  </button>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#64748B", marginBottom: "6px" }}>Amount (₹)</label>
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required
                    style={{ width: "100%", padding: "10px 12px", border: "0.5px solid #E2E8F0", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#64748B", marginBottom: "6px" }}>Date</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required
                    style={{ width: "100%", padding: "10px 12px", border: "0.5px solid #E2E8F0", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#64748B", marginBottom: "6px" }}>Description</label>
                  <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Grocery shopping" required
                    style={{ width: "100%", padding: "10px 12px", border: "0.5px solid #E2E8F0", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#64748B", marginBottom: "6px" }}>Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", border: "0.5px solid #E2E8F0", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" disabled={loading}
                  style={{ flex: 1, padding: "12px", background: "#22C55E", color: "#0F172A", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                  {loading ? "Saving..." : "Save Transaction"}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ padding: "12px 20px", background: "#F1F5F9", color: "#64748B", border: "none", borderRadius: "10px", fontSize: "14px", cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Transactions List */}
        <div style={{ background: "#fff", borderRadius: "14px", border: "0.5px solid #E2E8F0", padding: "20px 24px" }}>
          {transactions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#94A3B8", fontSize: "14px" }}>No transactions yet. Add one above! 💸</div>
          ) : (
            transactions.map((t) => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 0", borderBottom: "0.5px solid #F1F5F9" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: t.type === "income" ? "#DCFCE7" : "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
                  {t.type === "income" ? "💵" : "💸"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: "500", color: "#0F172A" }}>{t.description}</div>
                  <div style={{ fontSize: "12px", color: "#94A3B8" }}>{t.category} • {t.date}</div>
                </div>
                <div style={{ fontSize: "15px", fontWeight: "600", color: t.type === "income" ? "#22C55E" : "#EF4444", marginRight: "12px" }}>
                  {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
                </div>
                <button onClick={() => handleDelete(t.id)}
                  style={{ background: "#FEE2E2", color: "#EF4444", border: "none", borderRadius: "8px", padding: "6px 10px", cursor: "pointer", fontSize: "13px" }}>
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}