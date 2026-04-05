import React from "react";
import { useApp } from "../../context/AppContext";
import { formatCurrency, formatDate } from "../../utils/helpers";
import { CATEGORY_COLORS } from "../../data/mockData";

export default function RecentTransactions({ onNavigate }) {
  const { state } = useApp();
  const recent = state.transactions.slice(0, 5);

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <h3 className="chart-title">Recent Activity</h3>
        <button className="link-btn" onClick={() => onNavigate("transactions")}>View all →</button>
      </div>
      {recent.length === 0 ? (
        <p className="empty-msg">No transactions yet.</p>
      ) : (
        <ul className="mini-txn-list">
          {recent.map(t => (
            <li key={t.id} className="mini-txn">
              <span className="mini-dot" style={{ background: CATEGORY_COLORS[t.category] || "#888" }} />
              <div className="mini-info">
                <span className="mini-desc">{t.description}</span>
                <span className="mini-cat">{t.category} · {formatDate(t.date)}</span>
              </div>
              <span className={`mini-amount ${t.type}`}>
                {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
