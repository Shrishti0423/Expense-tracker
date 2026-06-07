import React from 'react';
import { formatCurrency } from '../constants';
import { categoryMeta } from '../constants/categoryMeta';

const ExpenseTable = ({ expenses, onEdit, onDelete, loading = false }) => {
  const getFormattedDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden">
      <p className="sm:hidden text-[10px] text-slate-500 px-4 py-2 border-b border-slate-800/60">
        Swipe horizontally to view all columns
      </p>
      <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
        <table className="w-full min-w-[36rem] text-left border-collapse" aria-label="Expense transactions table">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/40">
              <th scope="col" className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
              <th scope="col" className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Note</th>
              <th scope="col" className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {expenses.map((expense) => {
              const meta = categoryMeta[expense.category] || categoryMeta.Other;
              return (
                <tr key={expense.id} className="hover:bg-slate-800/30 transition duration-200">
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-300 font-medium whitespace-nowrap">
                    {getFormattedDate(expense.date)}
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold text-white whitespace-nowrap">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <span className={`px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-semibold inline-flex items-center gap-1.5 ${meta.color}`}>
                      {meta.tableIcon}
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-400 max-w-[8rem] sm:max-w-xs truncate">
                    {expense.note ? expense.note : <span className="text-slate-600 italic">No description</span>}
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-right whitespace-nowrap">
                    <div className="flex justify-end gap-1.5 sm:gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(expense)}
                        disabled={loading}
                        aria-label={`Edit expense: ${expense.category}, ${formatCurrency(expense.amount)}`}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition duration-200 border border-slate-700/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(expense.id)}
                        disabled={loading}
                        aria-label={`Delete expense: ${expense.category}, ${formatCurrency(expense.amount)}`}
                        className="p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-lg transition duration-200 border border-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseTable;
