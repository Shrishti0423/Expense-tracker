import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EXPENSES_FILE = path.join(__dirname, '../data/expenses.json');

/**
 * Read all expenses from JSON file
 * @returns {Promise<Array>} Array of expense objects
 */
export const readExpenses = async () => {
  try {
    const data = await fs.readFile(EXPENSES_FILE, 'utf-8');
    return JSON.parse(data) || [];
  } catch (error) {
    console.error('Error reading expenses:', error);
    return [];
  }
};

/**
 * Write expenses to JSON file
 * @param {Array} expenses - Array of expense objects to save
 * @returns {Promise<void>}
 */
export const writeExpenses = async (expenses) => {
  try {
    await fs.writeFile(EXPENSES_FILE, JSON.stringify(expenses, null, 2));
  } catch (error) {
    console.error('Error writing expenses:', error);
    throw new Error('Failed to save expenses');
  }
};

/**
 * Generate unique ID for new expense
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
