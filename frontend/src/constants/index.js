export const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Bills',
  'Entertainment',
  'Other',
];

export const DEFAULT_BUDGETS = {
  Food: 5000,
  Transport: 2000,
  Bills: 15000,
  Entertainment: 3000,
  Other: 2000,
};

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);

export const CHART_COLORS = {
  Food: '#F97316',
  Transport: '#3B82F6',
  Bills: '#EF4444',
  Entertainment: '#A855F7',
  Other: '#6B7280',
};
