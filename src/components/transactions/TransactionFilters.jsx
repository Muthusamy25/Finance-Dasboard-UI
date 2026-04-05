import React from "react";
import { useApp } from "../../context/AppContext";
import { CATEGORIES } from "../../data/mockData";

const MONTHS = [
  { value: "all", label: "All Months" },
  { value: "2025-03", label: "Mar 2025" },
  { value: "2025-02", label: "Feb 2025" },
  { value: "2025-01", label: "Jan 2025" },
  { value: "2024-12", label: "Dec 2024" },
  { value: "2024-11", label: "Nov 2024" },
  { value: "2024-10", label: "Oct 2024" },
];

export default function TransactionFilters() {
  const { state, dispatch } = useApp();
  const { filters } = state;

  const set = (key, value) => dispatch({ type: "SET_FILTER", key, value });

  return (
    <div className="filters-bar">
      <div className="search-wrap">
        <span className="search-icon">⌕</span>
        <input
          className="search-input"
          placeholder="Search transactions..."
          value={filters.search}
          onChange={e => set("search", e.target.value)}
        />
      </div>
      <select className="filter-select" value={filters.type} onChange={e => set("type", e.target.value)}>
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <select className="filter-select" value={filters.category} onChange={e => set("category", e.target.value)}>
        <option value="all">All Categories</option>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select className="filter-select" value={filters.month} onChange={e => set("month", e.target.value)}>
        {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
      </select>
      <button
        className="reset-btn"
        onClick={() => ["search","type","category","month"].forEach(k => set(k, k === "type" || k === "category" || k === "month" ? "all" : ""))}
      >
        Reset
      </button>
    </div>
  );
}
