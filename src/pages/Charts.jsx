import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ["#22C55E", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#6B7280"];

export default function Charts() {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "transactions"), where("uid", "==", currentUser.uid));
    const unsub = onSnapshot(q, (snap) => {
      setTransactions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [currentUser]);

  // Pie chart — expenses by category
  const expenseByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
  const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));

  // Bar chart — monthly income vs expense
  const monthlyData = transactions.reduce((acc, t) => {
    const month = t.date?.slice(0, 7);
    if (!month) return acc;
    if (!acc[month]) acc[month] = { month, income: 0, expense: 0 };
    if (t.type === "income") acc[month].income += t.amount;
    else acc[month].expense += t.amount;
    return acc;
  }, {});
  const barData = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);

  return (
    <div style={{ display: "flex", fontFamily: "sans-serif", background: "#F8FAFC", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ marginLeft: "220px", flex: 1, padding: "32px" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "600", color: "#0F172A", margin: "0 0 4px" }}>Analytics</h1>
          <p style={{ color: "#64748B", fontSize: "14px", margin: 0 }}>Visual breakdown of your finances</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {/* Bar Chart */}
          <div style={{ background: "#fff", borderRadius: "14px", border: "0.5px solid #E2E8F0", padding: "24px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#0F172A", margin: "0 0 20px" }}>Monthly Income vs Expenses</h2>
            {barData.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#94A3B8", fontSize: "14px" }}>Add transactions to see chart 📊</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} barGap={4}>
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94A3B8" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} />
                  <Tooltip formatter={(v) => `₹${v.toLocaleString("en-IN")}`} />
                  <Bar dataKey="income" fill="#22C55E" radius={[4, 4, 0, 0]} name="Income" />
                  <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Pie Chart */}
          <div style={{ background: "#fff", borderRadius: "14px", border: "0.5px solid #E2E8F0", padding: "24px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#0F172A", margin: "0 0 20px" }}>Expenses by Category</h2>
            {pieData.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#94A3B8", fontSize: "14px" }}>Add expenses to see breakdown 🥧</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => `₹${v.toLocaleString("en-IN")}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}