import React, { useState, useEffect } from 'react';
import { EXPENSE_CATEGORIES } from '../constants';

const ExpenseForm = ({ onSubmit, loading = false, initialData = null }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        note: '',
      });
    }
    setErrors({});
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else if (new Date(formData.date) > new Date()) {
      newErrors.date = 'Date cannot be in the future';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
    });

    if (!initialData) {
      setFormData({
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        note: '',
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-4 sm:p-6 rounded-2xl shadow-xl space-y-5"
      noValidate
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
          {initialData ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-white">
          {initialData ? 'Edit Expense' : 'Add Expense'}
        </h2>
      </div>

      <div>
        <label htmlFor="expense-amount" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Amount (INR)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium" aria-hidden="true">₹</span>
          <input
            id="expense-amount"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0.01"
            aria-invalid={Boolean(errors.amount)}
            aria-describedby={errors.amount ? 'expense-amount-error' : undefined}
            className={`w-full min-w-0 pl-8 pr-4 py-2.5 bg-slate-950/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-slate-600 transition-all ${
              errors.amount ? 'border-rose-500/80 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500'
            }`}
          />
        </div>
        {errors.amount && (
          <p id="expense-amount-error" className="text-rose-400 text-xs mt-1.5 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.amount}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="expense-category" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Category
        </label>
        <select
          id="expense-category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          aria-invalid={Boolean(errors.category)}
          aria-describedby={errors.category ? 'expense-category-error' : undefined}
          className={`w-full min-w-0 px-4 py-2.5 bg-slate-950/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-white focus:border-indigo-500 transition-all ${
            errors.category ? 'border-rose-500/80' : 'border-slate-800'
          }`}
        >
          {EXPENSE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat} className="bg-slate-950 text-white">
              {cat}
            </option>
          ))}
        </select>
        {errors.category && (
          <p id="expense-category-error" className="text-rose-400 text-xs mt-1.5">
            {errors.category}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="expense-date" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Date
        </label>
        <input
          id="expense-date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          max={new Date().toISOString().split('T')[0]}
          aria-invalid={Boolean(errors.date)}
          aria-describedby={errors.date ? 'expense-date-error' : undefined}
          className={`w-full min-w-0 px-4 py-2.5 bg-slate-950/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-slate-600 transition-all ${
            errors.date ? 'border-rose-500/80 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500'
          }`}
        />
        {errors.date && (
          <p id="expense-date-error" className="text-rose-400 text-xs mt-1.5 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.date}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="expense-note" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Note (Optional)
        </label>
        <textarea
          id="expense-note"
          name="note"
          value={formData.note}
          onChange={handleChange}
          placeholder="What did you buy?"
          rows="3"
          className="w-full min-w-0 px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-slate-600 focus:border-indigo-500 transition-all resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all active:scale-[0.98] disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Saving...
          </>
        ) : initialData ? (
          'Update Expense'
        ) : (
          'Save Expense'
        )}
      </button>
    </form>
  );
};

export default ExpenseForm;
