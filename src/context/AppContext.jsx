import React, { createContext, useContext, useReducer, useEffect } from "react";
import { initialTransactions } from "../data/mockData";

const AppContext = createContext();

const loadFromStorage = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch { return fallback; }
};

const initialState = {
  transactions: loadFromStorage("fd_transactions", initialTransactions),
  role: loadFromStorage("fd_role", "viewer"),
  darkMode: loadFromStorage("fd_dark", false),
  filters: { search: "", type: "all", category: "all", month: "all" },
  sortBy: "date",
  sortDir: "desc",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_ROLE": return { ...state, role: action.payload };
    case "TOGGLE_DARK": return { ...state, darkMode: !state.darkMode };
    case "SET_FILTER": return { ...state, filters: { ...state.filters, [action.key]: action.value } };
    case "SET_SORT": return { ...state, sortBy: action.sortBy, sortDir: action.sortDir };
    case "ADD_TRANSACTION": return { ...state, transactions: [action.payload, ...state.transactions] };
    case "UPDATE_TRANSACTION": return {
      ...state,
      transactions: state.transactions.map(t => t.id === action.payload.id ? action.payload : t),
    };
    case "DELETE_TRANSACTION": return {
      ...state,
      transactions: state.transactions.filter(t => t.id !== action.payload),
    };
    default: return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    localStorage.setItem("fd_transactions", JSON.stringify(state.transactions));
  }, [state.transactions]);
  useEffect(() => {
    localStorage.setItem("fd_role", state.role);
  }, [state.role]);
  useEffect(() => {
    localStorage.setItem("fd_dark", JSON.stringify(state.darkMode));
    document.documentElement.setAttribute("data-theme", state.darkMode ? "dark" : "light");
  }, [state.darkMode]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
