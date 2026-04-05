import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { CATEGORIES } from "../../data/mockData";

const empty = { description: "", amount: "", category: "Food & Dining", type: "expense", date: new Date().toISOString().split("T")[0] };

export default function TransactionModal({ transaction, onClose }) {
  const { dispatch } = useApp();
  const [form, setForm] = useState(transaction || empty);
  const isEdit = !!transaction;

  useEffect(() => {
    const handle = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onClose]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.description || !form.amount || !form.date) return;
    const payload = { ...form, amount: parseFloat(form.amount), id: isEdit ? form.id : Date.now() };
    dispatch({ type: isEdit ? "UPDATE_TRANSACTION" : "ADD_TRANSACTION", payload });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEdit ? "Edit Transaction" : "Add Transaction"}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <label className="form-label">Description
            <input className="form-input" value={form.description} onChange={e => set("description", e.target.value)} placeholder="e.g. Grocery Store" />
          </label>
          <div className="form-row">
            <label className="form-label">Amount
              <input className="form-input" type="number" min="0" step="0.01" value={form.amount} onChange={e => set("amount", e.target.value)} placeholder="0.00" />
            </label>
            <label className="form-label">Date
              <input className="form-input" type="date" value={form.date} onChange={e => set("date", e.target.value)} />
            </label>
          </div>
          <div className="form-row">
            <label className="form-label">Type
              <select className="form-input" value={form.type} onChange={e => set("type", e.target.value)}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </label>
            <label className="form-label">Category
              <select className="form-input" value={form.category} onChange={e => set("category", e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </label>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={submit}>{isEdit ? "Save Changes" : "Add Transaction"}</button>
        </div>
      </div>
    </div>
  );
}
