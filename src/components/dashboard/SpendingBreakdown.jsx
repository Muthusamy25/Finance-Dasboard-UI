import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { groupByCategory, formatCurrency } from "../../utils/helpers";
import { CATEGORY_COLORS } from "../../data/mockData";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from "recharts";

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
  return (
    <g>
      <text x={cx} y={cy - 12} textAnchor="middle" fill="var(--text-primary)" style={{ fontSize: 14, fontWeight: 700 }}>
        {payload.name}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="var(--text-muted)" style={{ fontSize: 12 }}>
        {formatCurrency(value)}
      </text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 8} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} innerRadius={outerRadius + 12} outerRadius={outerRadius + 14} startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  );
};

export default function SpendingBreakdown() {
  const { state } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);
  const grouped = groupByCategory(state.transactions);
  const total = grouped.reduce((a, [, v]) => a + v, 0);

  const data = grouped.map(([name, value]) => ({
    name,
    value: Math.round(value),
    color: CATEGORY_COLORS[name] || "#888",
  }));

  if (!data.length) return (
    <div className="chart-card empty-state">
      <span>No expense data available</span>
    </div>
  );

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <h3 className="chart-title">Spending Breakdown</h3>
        <span className="chart-sub">By category</span>
      </div>
      <div className="breakdown-inner">
        <ResponsiveContainer width="55%" height={220}>
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data}
              cx="50%" cy="50%"
              innerRadius={65}
              outerRadius={90}
              dataKey="value"
              onMouseEnter={(_, i) => setActiveIndex(i)}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <ul className="breakdown-legend">
          {data.slice(0, 6).map((item, i) => (
            <li
              key={i}
              className={`legend-item ${i === activeIndex ? "legend-active" : ""}`}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <span className="legend-dot" style={{ background: item.color }} />
              <span className="legend-name">{item.name}</span>
              <span className="legend-pct">{((item.value / total) * 100).toFixed(1)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
