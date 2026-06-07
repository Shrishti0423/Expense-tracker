import React from 'react';
import ExpenseCard from './ExpenseCard';
import ExpenseTable from './ExpenseTable';

const ExpenseList = ({
  expenses,
  onEdit,
  onDelete,
  loading = false,
  viewMode = 'grid',
  setViewMode
}) => {
  return (
    <div className="space-y-4">
      {/* List Header */}
      <div className="flex justify-between items-center bg-slate-900/40 border border-slate-800/60 px-5 py-3.5 rounded-2xl">
        <div className="flex items-center gap-2.5">
          <h2 className="text-lg font-bold text-white">Transactions</h2>
          <span className="bg-indigo-500/15 text-indigo-400 text-xs px-2.5 py-0.5 rounded-full font-semibold">
            {expenses.length}
          </span>
        </div>

        {/* View Switcher Toggle */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800/80">
          {/* Grid Button */}
          <button
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
            aria-pressed={viewMode === 'grid'}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'grid'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
            title="Grid View"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>

          {/* Table Button */}
          <button
            onClick={() => setViewMode('table')}
            aria-label="Table view"
            aria-pressed={viewMode === 'table'}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'table'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
            title="Table View"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Render List Content */}
      {loading && expenses.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-16 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
          <svg className="animate-spin h-8 w-8 text-indigo-500 mb-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-slate-400 text-sm">Syncing transactions...</p>
        </div>
      ) : expenses.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 p-12 rounded-2xl text-center flex flex-col items-center justify-center">
          <div className="p-4 bg-slate-950 rounded-2xl mb-4 border border-slate-800">
            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-300">No transactions found</h3>
          <p className="text-slate-500 text-xs mt-1 max-w-xs mx-auto">
            Try adjusting your filters or category search, or add a new expense above to get started!
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {expenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onEdit={onEdit}
              onDelete={onDelete}
              loading={loading}
            />
          ))}
        </div>
      ) : (
        <ExpenseTable
          expenses={expenses}
          onEdit={onEdit}
          onDelete={onDelete}
          loading={loading}
        />
      )}
    </div>
  );
};

export default ExpenseList;
