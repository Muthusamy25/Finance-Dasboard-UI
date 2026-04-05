import React from "react";
import { useApp } from "../../context/AppContext";
import { groupByMonth, getMonthLabel, formatCurrency } from "../../utils/helpers";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function BalanceTrend() {
  const { state } = useApp();
  const grouped = groupByMonth(state.transactions);

  const data = grouped.map(([key, val]) => ({
    month: getMonthLabel(key),
    Income: Math.round(val.income),
    Expenses: Math.round(val.expenses),
    Net: Math.round(val.net),
  }));

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <h3 className="chart-title">Balance Trend</h3>
        <span className="chart-sub">6-month overview</span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(1)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, color: "var(--text-muted)" }} />
          <Area type="monotone" dataKey="Income" stroke="#22c55e" strokeWidth={2} fill="url(#incomeGrad)" />
          <Area type="monotone" dataKey="Expenses" stroke="#f43f5e" strokeWidth={2} fill="url(#expGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
