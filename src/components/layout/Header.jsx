import React from "react";
import { useApp } from "../../context/AppContext";
import { formatCurrency } from "../../utils/helpers";

export default function Header({ activeTab, onMenuToggle }) {
  const { state } = useApp();
  const { transactions, role } = state;

  const totalBalance = transactions.reduce((acc, t) =>
    t.type === "income" ? acc + t.amount : acc - t.amount, 0);

  const tabTitles = {
    dashboard: "Financial Overview",
    transactions: "Transactions",
    insights: "Spending Insights",
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="hamburger-btn" onClick={onMenuToggle} title="Open menu">
          <span /><span /><span />
        </button>
        <div>
          <h1 className="page-title">{tabTitles[activeTab]}</h1>
          <span className="page-subtitle">March 2025</span>
        </div>
      </div>
      <div className="topbar-right">
        <div className="balance-chip">
          <span className="chip-label">Net Balance</span>
          <span className={`chip-value ${totalBalance >= 0 ? "positive" : "negative"}`}>
            {formatCurrency(totalBalance)}
          </span>
        </div>
        <div className="role-badge" data-role={role}>
          {role === "admin" ? "⚡ Admin" : "👁 Viewer"}
        </div>
      </div>
    </header>
  );
}