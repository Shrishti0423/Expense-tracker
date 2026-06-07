import React, { useState, useEffect, useMemo } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Summary from './components/Summary';
import { fetchExpenses, createExpense, updateExpense, deleteExpense } from './services/api';
import { DEFAULT_BUDGETS, EXPENSE_CATEGORIES } from './constants';
import './App.css';

function App() {
  // State
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);

  // View Mode: 'grid' or 'table'
  const [viewMode, setViewMode] = useState('grid');

  // Budgets state per category (auto-saved to localStorage)
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('expense_tracker_budgets') || localStorage.getItem('spendwise_budgets') || localStorage.getItem('sleekspend_budgets');
    return saved ? JSON.parse(saved) : DEFAULT_BUDGETS;
  });

  // Filter States
  const [filters, setFilters] = useState({
    category: 'All',
    dateRange: 'this-month', // default to 'this-month' for focused view, user can toggle to 'all', 'last-month', 'custom'
    startDate: '',
    endDate: '',
    searchQuery: '',
  });

  // Sync budgets to localStorage
  useEffect(() => {
    localStorage.setItem('expense_tracker_budgets', JSON.stringify(budgets));
  }, [budgets]);

  // Fetch expenses on mount
  useEffect(() => {
    loadExpenses();
  }, []);

  // Load expenses from API
  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchExpenses();
      setExpenses(response.data || []);
    } catch (err) {
      setError('Could not establish connection to the backend API. Please make sure the server is running on port 5000.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle add/update expense
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      if (editingId) {
        // Update existing expense
        const response = await updateExpense(editingId, formData);
        setExpenses((prev) =>
          prev.map((exp) =>
            exp.id === editingId ? response.data : exp
          )
        );
        setEditingId(null);
        setEditingExpense(null);
      } else {
        // Create new expense
        const response = await createExpense(formData);
        setExpenses((prev) => [response.data, ...prev]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save expense');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit selection
  const handleEdit = (expense) => {
    setEditingId(expense.id);
    setEditingExpense({
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      note: expense.note,
    });
    // Smooth scroll to top form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    } catch (err) {
      setError('Failed to delete expense');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingExpense(null);
  };

  // Handle budget input change
  const handleBudgetChange = (category, value) => {
    const val = parseFloat(value) || 0;
    setBudgets((prev) => ({
      ...prev,
      [category]: val,
    }));
  };

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      category: 'All',
      dateRange: 'all',
      startDate: '',
      endDate: '',
      searchQuery: '',
    });
  };

  // Filtered Expenses computation
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      // 1. Category Filter
      if (filters.category !== 'All' && exp.category !== filters.category) {
        return false;
      }

      // 2. Date Range Filter
      const expDate = new Date(exp.date);
      const now = new Date();
      
      // Zero out hours for date comparison
      expDate.setHours(0, 0, 0, 0);

      if (filters.dateRange === 'this-month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        if (expDate < startOfMonth || expDate > endOfMonth) return false;
      } else if (filters.dateRange === 'last-month') {
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        if (expDate < startOfLastMonth || expDate > endOfLastMonth) return false;
      } else if (filters.dateRange === 'this-year') {
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        if (expDate < startOfYear) return false;
      } else if (filters.dateRange === 'custom') {
        if (filters.startDate) {
          const start = new Date(filters.startDate);
          start.setHours(0, 0, 0, 0);
          if (expDate < start) return false;
        }
        if (filters.endDate) {
          const end = new Date(filters.endDate);
          end.setHours(0, 0, 0, 0);
          if (expDate > end) return false;
        }
      }

      // 3. Search Query Filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const noteMatch = exp.note && exp.note.toLowerCase().includes(query);
        const catMatch = exp.category.toLowerCase().includes(query);
        const amountMatch = exp.amount.toString().includes(query);
        if (!noteMatch && !catMatch && !amountMatch) return false;
      }

      return true;
    });
  }, [expenses, filters]);

  // Export filtered expenses to CSV file
  const handleExportCSV = () => {
    if (filteredExpenses.length === 0) {
      alert('No expenses available to export.');
      return;
    }

    const headers = ['Date', 'Category', 'Amount (INR)', 'Note'];
    const rows = filteredExpenses.map((exp) => [
      exp.date,
      exp.category,
      exp.amount,
      exp.note ? exp.note.replace(/"/g, '""') : '',
    ]);

    // Prepend UTF-8 BOM so Excel opens it with correct encoding and doesn't mess up symbols/characters
    const csvContent = '\uFEFF' + [
      headers.join(','),
      ...rows.map((e) => e.map((val) => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `expense_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#070b13] text-[#f3f4f6] pb-16 font-sans">
      
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[#090f19]/85 backdrop-blur-md border-b border-slate-900/60 shadow-lg px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-500 to-violet-500 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-white via-slate-100 to-indigo-400 bg-clip-text text-transparent">
                Expense Tracker
              </h1>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mt-0.5">
                Track your spending
              </p>
            </div>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              disabled={filteredExpenses.length === 0}
              aria-label="Export visible expenses to CSV"
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold py-2 px-4 rounded-xl text-xs transition border border-slate-800 hover:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              title="Export visible data to CSV"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </button>
            <button
              onClick={loadExpenses}
              aria-label="Refresh expenses from server"
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition"
              title="Refresh Data"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 3v5H16.24" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
        
        {/* Error Alert Display */}
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-2xl flex items-start gap-3 relative animate-pulse">
            <svg className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1 text-sm font-medium">
              {error}
            </div>
            <button
              onClick={() => setError(null)}
              aria-label="Dismiss error message"
              className="text-rose-400 hover:text-white transition font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Filter Toolbar Panel */}
        <section className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter Transactions
            </h3>
            {Object.values(filters).some(x => x !== 'All' && x !== 'all' && x !== '') && (
              <button
                onClick={resetFilters}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition flex items-center gap-1"
              >
                Clear all filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* Search Bar Input */}
            <div className="relative">
              <svg className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search note/amount..."
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#090f19] border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs text-white placeholder-slate-600 transition-all"
              />
            </div>

            {/* Category Dropdown Filter */}
            <div>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-2 bg-[#090f19] border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs text-white transition-all"
              >
                <option value="All">All Categories</option>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Date Range Selector Dropdown */}
            <div>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="w-full px-4 py-2 bg-[#090f19] border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs text-white transition-all"
              >
                <option value="all">All Time</option>
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="this-year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {/* Custom Range: Start Date */}
            <div className={`${filters.dateRange === 'custom' ? 'block' : 'hidden md:block opacity-30 pointer-events-none'}`}>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                disabled={filters.dateRange !== 'custom'}
                className="w-full px-4 py-2 bg-[#090f19] border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs text-white transition-all"
              />
            </div>

            {/* Custom Range: End Date */}
            <div className={`${filters.dateRange === 'custom' ? 'block' : 'hidden md:block opacity-30 pointer-events-none'}`}>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                disabled={filters.dateRange !== 'custom'}
                className="w-full px-4 py-2 bg-[#090f19] border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs text-white transition-all"
              />
            </div>
          </div>
        </section>

        {/* Dashboard Insights / Charts Section */}
        <section className="p-0.5 rounded-2xl bg-gradient-to-b from-slate-900/30 to-slate-950/30">
          <Summary expenses={filteredExpenses} budgets={budgets} dateRange={filters.dateRange} />
        </section>

        {/* Action Panel Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column Workspace: Form Entry & Budgets */}
          <div className="lg:col-span-1 space-y-6">
            <div className="space-y-2">
              <ExpenseForm
                onSubmit={handleSubmit}
                loading={loading}
                initialData={editingExpense}
              />
              {editingId && (
                <button
                  onClick={handleCancelEdit}
                  className="w-full bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold py-2.5 px-4 rounded-xl text-xs transition duration-200 border border-slate-700/20 shadow-md flex items-center justify-center gap-1.5"
                >
                  Cancel Editing
                </button>
              )}
            </div>

            {/* Budget Configuration Form */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-white">Budget Settings</h3>
              </div>
              <p className="text-[11px] text-slate-500">
                Configure monthly targets per category. Budgets are autosaved to localStorage.
              </p>

              <div className="grid grid-cols-2 gap-3.5">
                {Object.keys(budgets).map((cat) => (
                  <div key={cat} className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{cat}</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600 text-xs">₹</span>
                      <input
                        type="number"
                        value={budgets[cat]}
                        onChange={(e) => handleBudgetChange(cat, e.target.value)}
                        className="w-full pl-6 pr-2 py-1.5 bg-[#090f19]/80 border border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500 text-xs text-white placeholder-slate-700 transition-all font-semibold"
                        min="0"
                        placeholder="Limit"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column Workspace: Expense List Details */}
          <div className="lg:col-span-2">
            <ExpenseList
              expenses={filteredExpenses}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={loading}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
