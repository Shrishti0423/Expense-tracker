import express from 'express';
import { readExpenses, writeExpenses, generateId } from '../utils/fileOps.js';
import { EXPENSE_CATEGORIES } from '../utils/constants.js';

const router = express.Router();

/**
 * GET /api/expenses
 * Fetch all expenses sorted by date (newest first)
 */
router.get('/', async (req, res) => {
  try {
    const expenses = await readExpenses();
    
    // Sort by date (newest first)
    const sorted = expenses.sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    res.json({
      success: true,
      count: sorted.length,
      data: sorted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expenses',
      error: error.message,
    });
  }
});

/**
 * POST /api/expenses
 * Create a new expense
 * Body: { amount, category, date, note }
 */
router.post('/', async (req, res) => {
  try {
    const { amount, category, date, note } = req.body;
    
    // Validation
    if (!amount || !category || !date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: amount, category, date',
      });
    }
    
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be positive',
      });
    }
    
    if (!EXPENSE_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Category must be one of: ${EXPENSE_CATEGORIES.join(', ')}`,
      });
    }
    
    // Check for future date
    if (new Date(date) > new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Date cannot be in the future',
      });
    }
    
    // Create new expense object
    const newExpense = {
      id: generateId(),
      amount: parseFloat(amount),
      category,
      date,
      note: note || '',
      createdAt: new Date().toISOString(),
    };
    
    // Read existing, add new, write back
    const expenses = await readExpenses();
    expenses.push(newExpense);
    await writeExpenses(expenses);
    
    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: newExpense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create expense',
      error: error.message,
    });
  }
});

/**
 * PUT /api/expenses/:id
 * Update an existing expense
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category, date, note } = req.body;
    
    // Validation (same as POST)
    if (amount !== undefined && amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be positive',
      });
    }
    
    if (category && !EXPENSE_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Category must be one of: ${EXPENSE_CATEGORIES.join(', ')}`,
      });
    }
    
    if (date && new Date(date) > new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Date cannot be in the future',
      });
    }
    
    // Read, find, update, write
    const expenses = await readExpenses();
    const expenseIndex = expenses.findIndex(exp => exp.id === id);
    
    if (expenseIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }
    
    // Update only provided fields
    if (amount !== undefined) expenses[expenseIndex].amount = parseFloat(amount);
    if (category) expenses[expenseIndex].category = category;
    if (date) expenses[expenseIndex].date = date;
    if (note !== undefined) expenses[expenseIndex].note = note;
    expenses[expenseIndex].updatedAt = new Date().toISOString();
    
    await writeExpenses(expenses);
    
    res.json({
      success: true,
      message: 'Expense updated successfully',
      data: expenses[expenseIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update expense',
      error: error.message,
    });
  }
});

/**
 * DELETE /api/expenses/:id
 * Delete an expense
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Read, filter, write
    const expenses = await readExpenses();
    const filteredExpenses = expenses.filter(exp => exp.id !== id);
    
    if (filteredExpenses.length === expenses.length) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }
    
    await writeExpenses(filteredExpenses);
    
    res.json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete expense',
      error: error.message,
    });
  }
});

export default router;
