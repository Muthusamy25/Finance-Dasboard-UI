import React from "react";
import { useApp } from "../../context/AppContext";
import { formatCurrency, getMonthKey } from "../../utils/helpers";

export default function SummaryCards() {
  const { state } = useApp();
  const currentMonth = "2025-03";

  const allTxns = state.transactions;
  const monthTxns = allTxns.filter(t => getMonthKey(t.date) === currentMonth);
  const prevMonthTxns = allTxns.filter(t => getMonthKey(t.date) === "2025-02");

  const totalBalance = allTxns.reduce((a, t) => t.type === "income" ? a + t.amount : a - t.amount, 0);
  const monthIncome = monthTxns.filter(t => t.type === "income").reduce((a, t) => a + t.amount, 0);
  const monthExpenses = monthTxns.filter(t => t.type === "expense").reduce((a, t) => a + t.amount, 0);
  const prevExpenses = prevMonthTxns.filter(t => t.type === "expense").reduce((a, t) => a + t.amount, 0);
  const savings = monthIncome - monthExpenses;
  const savingsRate = monthIncome ? ((savings / monthIncome) * 100).toFixed(1) : 0;
  const expenseDelta = prevExpenses ? (((monthExpenses - prevExpenses) / prevExpenses) * 100).toFixed(1) : 0;

  const cards = [
    {
      label: "Total Balance",
      value: formatCurrency(totalBalance),
      sub: "All time net",
      icon: "◈",
      accent: "#6366f1",
      positive: totalBalance >= 0,
    },
    {
      label: "Monthly Income",
      value: formatCurrency(monthIncome),
      sub: "March 2025",
      icon: "↑",
      accent: "#22c55e",
      positive: true,
    },
    {
      label: "Monthly Expenses",
      value: formatCurrency(monthExpenses),
      sub: `${expenseDelta > 0 ? "+" : ""}${expenseDelta}% vs last month`,
      icon: "↓",
      accent: "#f43f5e",
      positive: expenseDelta <= 0,
    },
    {
      label: "Savings Rate",
      value: `${savingsRate}%`,
      sub: formatCurrency(savings) + " saved",
      icon: "⬡",
      accent: "#0ea5e9",
      positive: savingsRate > 20,
    },
  ];

  return (
    <div className="summary-cards">
      {cards.map((card, i) => (
        <div key={i} className="summary-card" style={{ "--card-accent": card.accent }}>
          <div className="card-header">
            <span className="card-icon">{card.icon}</span>
            <span className="card-label">{card.label}</span>
          </div>
          <div className="card-value">{card.value}</div>
          <div className={`card-sub ${card.positive ? "sub-positive" : "sub-negative"}`}>
            {card.sub}
          </div>
          <div className="card-glow" />
        </div>
      ))}
    </div>
  );
}
