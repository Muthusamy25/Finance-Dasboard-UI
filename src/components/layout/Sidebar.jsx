import React from "react";
import { useApp } from "../../context/AppContext";

const NAV = [
  { id: "dashboard", label: "Overview", icon: "⬡" },
  { id: "transactions", label: "Transactions", icon: "⇄" },
  { id: "insights", label: "Insights", icon: "◈" },
];

export default function Sidebar({ active, setActive, open }) {
  const { state, dispatch } = useApp();
  const { role, darkMode } = state;

  return (
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="sidebar-brand">
        <span className="brand-icon">◈</span>
        <span className="brand-name">FinTrack</span>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(item => (
          <button
            key={item.id}
            className={`nav-item ${active === item.id ? "active" : ""}`}
            onClick={() => setActive(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {active === item.id && <span className="nav-indicator" />}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="role-switcher">
          <label className="control-label">Role</label>
          <select
            value={role}
            onChange={e => dispatch({ type: "SET_ROLE", payload: e.target.value })}
            className="role-select"
          >
            <option value="viewer">👁 Viewer</option>
            <option value="admin">⚡ Admin</option>
          </select>
        </div>
        <button
          className="theme-toggle"
          onClick={() => dispatch({ type: "TOGGLE_DARK" })}
          title={darkMode ? "Light mode" : "Dark mode"}
        >
          {darkMode ? "☀ Light" : "◑ Dark"}
        </button>
      </div>
    </aside>
  );
}