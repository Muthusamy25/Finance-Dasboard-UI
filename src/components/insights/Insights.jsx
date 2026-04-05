import React from "react";
import { useApp } from "../../context/AppContext";
import { groupByCategory, groupByMonth, formatCurrency, getMonthLabel } from "../../utils/helpers";
import { CATEGORY_COLORS } from "../../data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function Insights() {
  const { state } = useApp();
  const { transactions } = state;

  const byCategory = groupByCategory(transactions);
  const byMonth = groupByMonth(transactions);

  const topCategory = byCategory[0];
  const totalExpenses = byCategory.reduce((a, [, v]) => a + v, 0);

  const monthlyData = byMonth.map(([key, val]) => ({
    month: getMonthLabel(key),
    Expenses: Math.round(val.expenses),
    Income: Math.round(val.income),
  }));

  const avgExpense = byMonth.length ? byMonth.reduce((a, [, v]) => a + v.expenses, 0) / byMonth.length : 0;
  const lastMonth = byMonth[byMonth.length - 1];
  const prevMonth = byMonth[byMonth.length - 2];
  const trend = lastMonth && prevMonth
    ? (((lastMonth[1].expenses - prevMonth[1].expenses) / prevMonth[1].expenses) * 100).toFixed(1)
    : null;

  const incomeMonths = byMonth.map(([, v]) => v.income);
  const bestIncomeMonth = byMonth[incomeMonths.indexOf(Math.max(...incomeMonths))];

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="chart-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map((p, i) => <p key={i} style={{ color: p.fill || p.color }}>{p.name}: {formatCurrency(p.value)}</p>)}
      </div>
    );
  };

  return (
    <div className="insights-grid">
      {/* Insight Cards */}
      <div className="insight-cards">
        {topCategory && (
          <div className="insight-card" style={{ "--accent": CATEGORY_COLORS[topCategory[0]] }}>
            <div className="insight-icon">🔥</div>
            <div className="insight-body">
              <h4>Top Spending Category</h4>
              <p className="insight-value">{topCategory[0]}</p>
              <p className="insight-sub">{formatCurrency(topCategory[1])} · {((topCategory[1]/totalExpenses)*100).toFixed(1)}% of total</p>
            </div>
          </div>
        )}
        {trend !== null && (
          <div className="insight-card" style={{ "--accent": parseFloat(trend) > 0 ? "#f43f5e" : "#22c55e" }}>
            <div className="insight-icon">{parseFloat(trend) > 0 ? "📈" : "📉"}</div>
            <div className="insight-body">
              <h4>Monthly Expense Trend</h4>
              <p className="insight-value">{trend > 0 ? "+" : ""}{trend}%</p>
              <p className="insight-sub">Compared to previous month</p>
            </div>
          </div>
        )}
        <div className="insight-card" style={{ "--accent": "#6366f1" }}>
          <div className="insight-icon">📊</div>
          <div className="insight-body">
            <h4>Avg Monthly Spend</h4>
            <p className="insight-value">{formatCurrency(avgExpense)}</p>
            <p className="insight-sub">Over {byMonth.length} months</p>
          </div>
        </div>
        {bestIncomeMonth && (
          <div className="insight-card" style={{ "--accent": "#22c55e" }}>
            <div className="insight-icon">💰</div>
            <div className="insight-body">
              <h4>Best Income Month</h4>
              <p className="insight-value">{getMonthLabel(bestIncomeMonth[0])}</p>
              <p className="insight-sub">{formatCurrency(bestIncomeMonth[1].income)} earned</p>
            </div>
          </div>
        )}
      </div>

      {/* Monthly Comparison Chart */}
      <div className="chart-card">
        <div className="chart-card-header">
          <h3 className="chart-title">Monthly Income vs Expenses</h3>
          <span className="chart-sub">Side-by-side comparison</span>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(1)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="Income" fill="#22c55e" radius={[4,4,0,0]} barSize={20} />
            <Bar dataKey="Expenses" fill="#f43f5e" radius={[4,4,0,0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown Bar */}
      <div className="chart-card">
        <div className="chart-card-header">
          <h3 className="chart-title">Spending by Category</h3>
          <span className="chart-sub">All time</span>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={byCategory.map(([name, value]) => ({ name, value: Math.round(value), color: CATEGORY_COLORS[name] || "#888" }))} layout="vertical" margin={{ top: 0, right: 20, left: 80, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
            <XAxis type="number" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
            <YAxis type="category" dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} width={75} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[0,4,4,0]} barSize={14}>
              {byCategory.map(([name], i) => (
                <Cell key={i} fill={CATEGORY_COLORS[name] || "#888"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
