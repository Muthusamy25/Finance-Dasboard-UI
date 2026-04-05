export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const getMonthKey = (dateStr) => dateStr.slice(0, 7);

export const getMonthLabel = (dateStr) =>
  new Date(dateStr + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" });

export const groupByMonth = (transactions) => {
  const map = {};
  transactions.forEach(t => {
    const key = getMonthKey(t.date);
    if (!map[key]) map[key] = { income: 0, expenses: 0, net: 0 };
    if (t.type === "income") { map[key].income += t.amount; map[key].net += t.amount; }
    else { map[key].expenses += t.amount; map[key].net -= t.amount; }
  });
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
};

export const groupByCategory = (transactions) => {
  const map = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    if (!map[t.category]) map[t.category] = 0;
    map[t.category] += t.amount;
  });
  return Object.entries(map).sort(([, a], [, b]) => b - a);
};

export const exportToCSV = (transactions) => {
  const header = "Date,Description,Category,Type,Amount";
  const rows = transactions.map(t =>
    `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`
  );
  const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "transactions.csv"; a.click();
  URL.revokeObjectURL(url);
};
