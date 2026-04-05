import React from "react";
import SummaryCards from "./SummaryCards";
import BalanceTrend from "./BalanceTrend";
import SpendingBreakdown from "./SpendingBreakdown";
import RecentTransactions from "./RecentTransactions";

export default function Dashboard({ onNavigate }) {
  return (
    <div className="dashboard-grid">
      <section className="full-width">
        <SummaryCards />
      </section>
      <section className="charts-row">
        <BalanceTrend />
        <SpendingBreakdown />
      </section>
      <section className="full-width">
        <RecentTransactions onNavigate={onNavigate} />
      </section>
    </div>
  );
}
