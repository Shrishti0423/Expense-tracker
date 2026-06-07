import React from 'react';
import { formatCurrency } from '../constants';
import { categoryMeta } from '../constants/categoryMeta';

const ExpenseCard = ({ expense, onEdit, onDelete, loading = false }) => {
  const date = new Date(expense.date);
  const formattedDate = date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const meta = categoryMeta[expense.category] || categoryMeta.Other;

  return (
    <div className={`bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border ${meta.border} hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between h-full group`}>
      <div>
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
              {formatCurrency(expense.amount)}
            </h3>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formattedDate}
            </p>
          </div>

          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${meta.color}`}>
            {meta.icon}
            {expense.category}
          </span>
        </div>

        {expense.note ? (
          <p className="text-slate-300 text-sm bg-slate-950/40 border border-slate-900/50 p-2.5 rounded-xl mb-4 italic line-clamp-3">
            "{expense.note}"
          </p>
        ) : (
          <p className="text-slate-500 text-sm bg-slate-950/20 border border-slate-900/10 p-2.5 rounded-xl mb-4 italic text-center">
            No description
          </p>
        )}
      </div>

      <div className="flex gap-2.5 mt-auto pt-2 border-t border-slate-800/40">
        <button
          onClick={() => onEdit(expense)}
          disabled={loading}
          aria-label={`Edit expense: ${expense.category}, ${formatCurrency(expense.amount)}`}
          className="flex-1 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-medium py-2 px-3 rounded-xl text-xs transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 border border-slate-700/30"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit
        </button>

        <button
          onClick={() => onDelete(expense.id)}
          disabled={loading}
          aria-label={`Delete expense: ${expense.category}, ${formatCurrency(expense.amount)}`}
          className="flex-1 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white font-medium py-2 px-3 rounded-xl text-xs transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 border border-rose-500/20"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ExpenseCard;
