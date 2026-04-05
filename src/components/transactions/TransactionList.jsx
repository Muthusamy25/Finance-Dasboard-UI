import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useFilteredTransactions } from "../../hooks/useFilteredTransactions";
import { formatCurrency, formatDate, exportToCSV } from "../../utils/helpers";
import { CATEGORY_COLORS } from "../../data/mockData";
import TransactionFilters from "./TransactionFilters";
import TransactionModal from "./TransactionModal";

const SortIcon = ({ field, sortBy, sortDir }) =>
  sortBy === field ? (sortDir === "asc" ? " ↑" : " ↓") : " ·";

export default function TransactionList() {
  const { state, dispatch } = useApp();
  const { role, sortBy, sortDir } = state;
  const filtered = useFilteredTransactions();
  const [modal, setModal] = useState(null); // null | "add" | transaction object

  const sort = (field) => {
    const newDir = sortBy === field && sortDir === "desc" ? "asc" : "desc";
    dispatch({ type: "SET_SORT", sortBy: field, sortDir: newDir });
  };

  const del = (id) => {
    if (window.confirm("Delete this transaction?"))
      dispatch({ type: "DELETE_TRANSACTION", payload: id });
  };

  return (
    <div className="txn-page">
      <div className="txn-toolbar">
        <TransactionFilters />
        <div className="toolbar-actions">
          <button className="btn-outline" onClick={() => exportToCSV(filtered)}>⬇ Export CSV</button>
          {role === "admin" && (
            <button className="btn-primary" onClick={() => setModal("add")}>+ Add</button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">⬡</span>
          <p>No transactions match your filters.</p>
        </div>
      ) : (
        <div className="txn-table-wrap">
          <table className="txn-table">
            <thead>
              <tr>
                {[["date","Date"],["description","Description"],["category","Category"],["type","Type"],["amount","Amount"]].map(([f,l]) => (
                  <th key={f} onClick={() => sort(f)} className="sortable">
                    {l}<SortIcon field={f} sortBy={sortBy} sortDir={sortDir} />
                  </th>
                ))}
                {role === "admin" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} className="txn-row">
                  <td className="td-date">{formatDate(t.date)}</td>
                  <td className="td-desc">{t.description}</td>
                  <td>
                    <span className="cat-badge" style={{ "--cat-color": CATEGORY_COLORS[t.category] || "#888" }}>
                      {t.category}
                    </span>
                  </td>
                  <td>
                    <span className={`type-pill ${t.type}`}>{t.type}</span>
                  </td>
                  <td className={`td-amount ${t.type}`}>
                    {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                  </td>
                  {role === "admin" && (
                    <td className="td-actions">
                      <button className="action-btn edit" onClick={() => setModal(t)} title="Edit">✎</button>
                      <button className="action-btn del" onClick={() => del(t.id)} title="Delete">✕</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="txn-footer">
        Showing {filtered.length} transactions
      </div>

      {modal && (
        <TransactionModal
          transaction={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
