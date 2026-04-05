import React, { useState } from "react";
import { AppProvider } from "./context/AppContext";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Dashboard from "./components/dashboard/Dashboard";
import TransactionList from "./components/transactions/TransactionList";
import Insights from "./components/insights/Insights";
import "./index.css";

function AppInner() {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <Sidebar
        active={active}
        setActive={(id) => { setActive(id); setSidebarOpen(false); }}
        open={sidebarOpen}
      />
      <div className="main-area">
        <Header
          activeTab={active}
          onMenuToggle={() => setSidebarOpen(prev => !prev)}
        />
        <main className="content">
          {active === "dashboard" && <Dashboard onNavigate={setActive} />}
          {active === "transactions" && <TransactionList />}
          {active === "insights" && <Insights />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}