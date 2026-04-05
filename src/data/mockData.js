export const CATEGORIES = [
  "Housing", "Food & Dining", "Transport", "Shopping",
  "Health", "Entertainment", "Utilities", "Education", "Travel", "Salary", "Freelance", "Investment"
];

export const CATEGORY_COLORS = {
  Housing: "#f43f5e",
  "Food & Dining": "#f97316",
  Transport: "#eab308",
  Shopping: "#84cc16",
  Health: "#06b6d4",
  Entertainment: "#8b5cf6",
  Utilities: "#64748b",
  Education: "#0ea5e9",
  Travel: "#ec4899",
  Salary: "#22c55e",
  Freelance: "#10b981",
  Investment: "#a3e635",
};

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateTransactions = () => {
  const txns = [];
  let id = 1;
  const now = new Date(2025, 2, 31);

  for (let m = 0; m < 6; m++) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    txns.push({ id: id++, date: new Date(year, month, 1).toISOString().split("T")[0], description: "Monthly Salary", amount: 5200, category: "Salary", type: "income" });
    txns.push({ id: id++, date: new Date(year, month, rand(5,15)).toISOString().split("T")[0], description: "Freelance Project", amount: rand(300, 1200), category: "Freelance", type: "income" });
    txns.push({ id: id++, date: new Date(year, month, rand(10,20)).toISOString().split("T")[0], description: "Dividend Payment", amount: rand(50, 250), category: "Investment", type: "income" });

    const expenseTemplates = [
      { desc: "Rent Payment", cat: "Housing", min: 1200, max: 1400 },
      { desc: "Grocery Store", cat: "Food & Dining", min: 80, max: 200 },
      { desc: "Restaurant Dinner", cat: "Food & Dining", min: 30, max: 90 },
      { desc: "Transport / Ride", cat: "Transport", min: 15, max: 60 },
      { desc: "Fuel", cat: "Transport", min: 40, max: 80 },
      { desc: "Online Shopping", cat: "Shopping", min: 30, max: 300 },
      { desc: "Electricity Bill", cat: "Utilities", min: 80, max: 150 },
      { desc: "Internet Bill", cat: "Utilities", min: 40, max: 60 },
      { desc: "Netflix", cat: "Entertainment", min: 15, max: 18 },
      { desc: "Gym Membership", cat: "Health", min: 40, max: 60 },
      { desc: "Pharmacy", cat: "Health", min: 10, max: 50 },
      { desc: "Online Course", cat: "Education", min: 20, max: 100 },
    ];

    expenseTemplates.forEach(t => {
      txns.push({
        id: id++,
        date: new Date(year, month, rand(1, 28)).toISOString().split("T")[0],
        description: t.desc,
        amount: rand(t.min, t.max),
        category: t.cat,
        type: "expense",
      });
    });
  }

  return txns.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const initialTransactions = generateTransactions();
export const MONTH_LABELS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
