# Expense Tracker

## Project Title & Brief Description

**Exercise Chosen:** Mini Expense Tracker

Expense Tracker is a full-stack web application that allows users to add, edit, delete, and filter expenses. Users can track spending by category, view summary statistics, visualize expenses through charts, set category budgets, and export filtered data as CSV. The application is built using React for the frontend and Node.js/Express for the backend, with expenses persisted in a JSON file.

---

## Live Demo Links

* Live Application: https://expense-tracker-rouge-eta-88.vercel.app
* GitHub Repository: https://github.com/Shrishti0423/Expense-tracker

---

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* Recharts

### Backend

* Node.js
* Express

### Storage

* JSON File

### Deployment

* Vercel (Frontend)
* Render (Backend)

---

## How to Run Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

Backend runs on:

```
http://localhost:5000
```

---

## API Documentation

### GET /api/expenses

Returns all expenses.

Response:

```json
{
  "success": true,
  "data": []
}
```

### POST /api/expenses

Creates a new expense.

Request Body:

```json
{
  "amount": 250,
  "category": "Food",
  "date": "2026-06-05",
  "note": "Lunch"
}
```

### PUT /api/expenses/:id

Updates an existing expense.

### DELETE /api/expenses/:id

Deletes an expense.

---

## Project Structure

```text
Expense-tracker/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── utils/
│   ├── data/
│   └── server.js
│
├── package.json
└── README.md
```

---

## Next Steps

* Add user authentication
* Add database support (SQLite/PostgreSQL)
* Add automated testing
* Add recurring expenses and reports
* Improve mobile experience
* Add notifications for budget limits
