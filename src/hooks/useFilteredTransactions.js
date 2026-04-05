import { useMemo } from "react";
import { useApp } from "../context/AppContext";

export function useFilteredTransactions() {
  const { state } = useApp();
  const { transactions, filters, sortBy, sortDir } = state;

  return useMemo(() => {
    let result = [...transactions];

    if (filters.search)
      result = result.filter(t =>
        t.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.category.toLowerCase().includes(filters.search.toLowerCase())
      );
    if (filters.type !== "all")
      result = result.filter(t => t.type === filters.type);
    if (filters.category !== "all")
      result = result.filter(t => t.category === filters.category);
    if (filters.month !== "all")
      result = result.filter(t => t.date.startsWith(filters.month));

    result.sort((a, b) => {
      let aVal = a[sortBy], bVal = b[sortBy];
      if (sortBy === "amount") { aVal = parseFloat(aVal); bVal = parseFloat(bVal); }
      if (sortDir === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    return result;
  }, [transactions, filters, sortBy, sortDir]);
}
