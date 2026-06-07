import React, { useMemo } from 'react';
import { CHART_COLORS, EXPENSE_CATEGORIES, formatCurrency } from '../constants';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const Summary = ({ expenses = [], budgets = {}, dateRange = 'this-month' }) => {
  const stats = useMemo(() => {
    if (expenses.length === 0) {
      return {
        totalSpent: 0,
        byCategory: [],
        highest: null,
        totalBudgetLimit: 0,
        budgetPercent: 0,
        categorySpentMap: {},
      };
    }

    // Calculate total spent in currently filtered expenses
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Calculate by category in currently filtered expenses
    const categoryMap = {};
    expenses.forEach((exp) => {
      categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
    });

    // We want all categories to be listed, even if 0 spent
    const byCategory = EXPENSE_CATEGORIES.map((cat) => ({
      category: cat,
      amount: categoryMap[cat] || 0,
    }));

    // Find highest expense
    const highest = expenses.reduce((max, exp) => (exp.amount > max.amount ? exp : max), expenses[0]);

    // Calculate total budgets vs total spent
    const totalBudgetLimit = Object.values(budgets).reduce((sum, val) => sum + val, 0);
    const budgetPercent = totalBudgetLimit > 0 ? (totalSpent / totalBudgetLimit) * 100 : 0;

    return {
      totalSpent,
      byCategory,
      highest,
      totalBudgetLimit,
      budgetPercent,
      categorySpentMap: categoryMap,
    };
  }, [expenses, budgets]);

  const periodLabel = {
    'this-month': 'this month',
    'last-month': 'last month',
    'this-year': 'this year',
    custom: 'selected range',
    all: 'all time',
  }[dateRange] || 'selected filters';

  // Pre-calculated statuses for progress bars
  const getProgressColor = (percent) => {
    if (percent >= 100) return 'bg-rose-500';
    if (percent >= 80) return 'bg-amber-500';
    return 'bg-indigo-500';
  };

  const getProgressTextColor = (percent) => {
    if (percent >= 100) return 'text-rose-400';
    if (percent >= 80) return 'text-amber-400';
    return 'text-indigo-400';
  };

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Spent */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-300" />
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Total Spent</h3>
          <p className="text-2xl font-black text-white">{formatCurrency(stats.totalSpent)}</p>
          <div className="mt-2 text-[10px] text-slate-500">For {periodLabel}</div>
        </div>

        {/* Highest Expense */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all duration-300" />
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Highest Expense</h3>
          <p className="text-2xl font-black text-white">
            {stats.highest ? formatCurrency(stats.highest.amount) : formatCurrency(0)}
          </p>
          {stats.highest && (
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-[10px] bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded border border-rose-500/20 font-medium">
                {stats.highest.category}
              </span>
              <span className="text-[10px] text-slate-500 truncate max-w-[100px]" title={stats.highest.note}>
                {stats.highest.note || 'No note'}
              </span>
            </div>
          )}
        </div>

        {/* Total Budget Limit */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group col-span-1 md:col-span-2">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-300" />
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Budget ({periodLabel})</h3>
            <span className={`text-xs font-bold ${getProgressTextColor(stats.budgetPercent)}`}>
              {stats.budgetPercent.toFixed(1)}% Used
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-white">{formatCurrency(stats.totalSpent)}</p>
            <span className="text-xs text-slate-500">/ {formatCurrency(stats.totalBudgetLimit)}</span>
          </div>
          
          {/* Progress Bar */}
          <div
            className="w-full bg-slate-950 rounded-full h-2 mt-3 overflow-hidden border border-slate-800/50"
            role="progressbar"
            aria-valuenow={Math.min(stats.budgetPercent, 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Overall budget usage: ${stats.budgetPercent.toFixed(1)} percent`}
          >
            <div
              className={`h-full rounded-full transition-all duration-500 ${getProgressColor(stats.budgetPercent)}`}
              style={{ width: `${Math.min(stats.budgetPercent, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Breakdown: Budgets & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Category Budgets Progress */}
        <div className="lg:col-span-1 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <h3 className="text-base font-bold text-white">Category Budgets</h3>
            </div>

            <div className="space-y-4">
              {EXPENSE_CATEGORIES.map((cat) => {
                const limit = budgets[cat] || 0;
                const spent = stats.categorySpentMap[cat] || 0;
                const percent = limit > 0 ? (spent / limit) * 100 : 0;
                
                return (
                  <div key={cat} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[cat] }} />
                        {cat}
                      </span>
                      <span className="text-slate-400">
                        <span className="text-white font-bold">{formatCurrency(spent)}</span> / {formatCurrency(limit)}
                      </span>
                    </div>

                    {/* Category bar */}
                    <div
                      className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800/50"
                      role="progressbar"
                      aria-valuenow={Math.min(percent, 100)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${cat} budget: ${percent.toFixed(0)} percent used`}
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getProgressColor(percent)}`}
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      />
                    </div>

                    {/* Exceeded alert text */}
                    {percent >= 100 && (
                      <p className="text-[10px] text-rose-400 font-semibold flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Over budget by {formatCurrency(spent - limit)}!
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="mt-6 p-3 bg-slate-950/40 rounded-xl border border-slate-800/50 text-[11px] text-slate-400">
            Tip: Adjust your category limits in the <strong>Budget Settings</strong> panel to fine-tune your spending threshold.
          </div>
        </div>

        {/* Right Columns: Recharts Visualizations */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Bar Chart */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
            <h4 className="text-sm font-bold text-white mb-3">Expenses by Category</h4>
            <div className="w-full h-48 sm:h-60 min-w-0">
              {stats.totalSpent > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.byCategory.filter(d => d.amount > 0)} margin={{ bottom: 20, left: 0, right: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                  <XAxis
                    dataKey="category"
                    stroke="#64748b"
                    fontSize={9}
                    tickLine={false}
                    angle={-35}
                    textAnchor="end"
                    height={50}
                    interval={0}
                  />
                  <YAxis stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} width={36} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                    formatter={(value) => [formatCurrency(value), 'Spent']}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {stats.byCategory.filter(d => d.amount > 0).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[entry.category] || CHART_COLORS.Other}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              ) : (
                <p className="text-xs text-slate-500 italic flex items-center justify-center h-full">No chart data for current filters</p>
              )}
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl shadow-xl flex flex-col justify-between min-w-0">
            <h4 className="text-sm font-bold text-white mb-3">Distribution Share</h4>
            <div className="w-full h-48 sm:h-60 relative flex items-center justify-center min-w-0">
              {stats.totalSpent > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.byCategory.filter(d => d.amount > 0)}
                      dataKey="amount"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={3}
                    >
                      {stats.byCategory.filter(d => d.amount > 0).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[entry.category] || CHART_COLORS.Other}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '11px',
                      }}
                      formatter={(value) => [formatCurrency(value), 'Spent']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs text-slate-500 italic">No breakdown available</p>
              )}
              
              {/* Inner Label */}
              {stats.totalSpent > 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Share</span>
                  <span className="text-sm font-bold text-white">{formatCurrency(stats.totalSpent)}</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Summary;
