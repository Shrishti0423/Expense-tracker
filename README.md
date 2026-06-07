# SpendWise — Full Stack Expense Tracker

## Project Title & Brief Description

**Exercise chosen:** Full Stack Expense Tracker

SpendWise is a personal expense tracking web application that lets users record daily spending, filter transactions, and understand where their money goes. I built this as a monorepo with a React frontend and an Express REST API backend. Expenses are persisted to a JSON file on the server. The dashboard includes summary statistics, category budgets with visual progress indicators, bar/pie charts, and CSV export of filtered results.

---

## Live Demo Links

| Service | URL | Status |
|---------|-----|--------|
| **Frontend (Vercel)** | https://expense-tracker-frontend.vercel.app | Deployed |
| **Backend API (Render)** | https://expense-tracker-api.onrender.com | Deploy after following [Deployment](#deployment) below |

**Health check:** `GET https://expense-tracker-api.onrender.com/api/health`

> **Note:** The frontend only works end-to-end once the backend is deployed on Render and `VITE_API_URL` is set in Vercel. Test in an incognito window after deploying both services.

---

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| **Frontend** | React 19 | Component-based UI for forms, lists, and dashboards |
| **Build** | Vite 8 | Fast dev server and production builds |
| **Styling** | Tailwind CSS 4 | Utility-first CSS for responsive, modern UI |
| **HTTP** | Axios | Clean API client with interceptors |
| **Charts** | Recharts | Simple bar and pie charts for category breakdown |
| **Backend** | Node.js + Express 5 | Lightweight REST API |
| **Storage** | JSON file (`backend/data/expenses.json`) | Simple persistence without a database |
| **Config** | dotenv | Environment-based configuration |
| **CORS** | cors middleware | Allows frontend ↔ backend communication |
| **Hosting** | Vercel (frontend) + Render (backend) | Free tiers, easy deployment |

---

## How to Run Locally

**Prerequisites:** Node.js 18+ and npm only.

### Option A — Two terminals (recommended)

**Terminal 1 — Backend**
```bash
cd backend
npm install
cp .env.example .env.local    # Windows: copy .env.example .env.local
npm run dev
```
Server runs at **http://localhost:5000**

**Terminal 2 — Frontend**
```bash
cd frontend
npm install
cp .env.example .env.local    # Windows: copy .env.example .env.local
npm run dev
```
App opens at **http://localhost:5173**

### Option B — From project root

```bash
npm run install:all
```

Then start backend and frontend in separate terminals:
```bash
npm run dev:backend
npm run dev:frontend
```

### Verify it works

1. Open http://localhost:5173 — expenses load (defaults to **This Month** filter)
2. Add a new expense — it appears in the list
3. Edit or delete an expense — changes persist after refresh
4. Change filters — summary and charts update
5. Click **Export CSV** — downloads filtered data
6. Stop the backend — an error banner appears with a clear message

---

## API Documentation

Base URL (local): `http://localhost:5000/api`  
Base URL (production): `https://expense-tracker-api.onrender.com/api`

All responses use JSON. Successful responses include `"success": true`.

### `GET /api/health`

Health check for the API.

**Response `200`**
```json
{
  "status": "OK",
  "message": "Expense Tracker API is running",
  "timestamp": "2026-06-06T18:22:37.435Z"
}
```

---

### `GET /api/expenses`

Fetch all expenses, sorted by date (newest first).

**Response `200`**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "exp_1780683131741_ekj5o87je",
      "amount": 499.98,
      "category": "Transport",
      "date": "2026-06-05",
      "note": "rapido",
      "createdAt": "2026-06-05T18:12:11.741Z"
    }
  ]
}
```

---

### `POST /api/expenses`

Create a new expense.

**Request body**
```json
{
  "amount": 250.50,
  "category": "Food",
  "date": "2026-06-05",
  "note": "Lunch"
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `amount` | number | Yes | Must be > 0 |
| `category` | string | Yes | One of: Food, Transport, Bills, Entertainment, Other |
| `date` | string | Yes | ISO date (`YYYY-MM-DD`), cannot be in the future |
| `note` | string | No | Optional description |

**Response `201`**
```json
{
  "success": true,
  "message": "Expense created successfully",
  "data": { "id": "...", "amount": 250.5, "category": "Food", "date": "2026-06-05", "note": "Lunch", "createdAt": "..." }
}
```

**Response `400`** — validation error
```json
{ "success": false, "message": "Amount must be positive" }
```

---

### `PUT /api/expenses/:id`

Update an existing expense. Send only fields you want to change.

**Request body** (all fields optional)
```json
{
  "amount": 300,
  "category": "Bills",
  "date": "2026-06-04",
  "note": "Updated note"
}
```

**Response `200`**
```json
{
  "success": true,
  "message": "Expense updated successfully",
  "data": { "id": "...", "amount": 300, "category": "Bills", "date": "2026-06-04", "note": "Updated note", "updatedAt": "..." }
}
```

**Response `404`**
```json
{ "success": false, "message": "Expense not found" }
```

---

### `DELETE /api/expenses/:id`

Delete an expense by ID.

**Response `200`**
```json
{ "success": true, "message": "Expense deleted successfully" }
```

**Response `404`**
```json
{ "success": false, "message": "Expense not found" }
```

---

## Project Structure

```
FULLSTACK/
├── frontend/                    # React + Vite client
│   ├── src/
│   │   ├── components/          # UI components (Form, List, Summary, etc.)
│   │   ├── constants/           # Shared categories, colors, formatters
│   │   ├── services/api.js      # Axios API client
│   │   ├── App.jsx              # Main app state and layout
│   │   └── main.jsx             # React entry point
│   ├── vercel.json              # Vercel deployment config
│   ├── .env.example             # Environment variable template
│   └── package.json
│
├── backend/                     # Express API server
│   ├── routes/expenses.js       # CRUD route handlers
│   ├── utils/
│   │   ├── fileOps.js           # JSON file read/write helpers
│   │   └── constants.js         # Category list
│   ├── data/expenses.json       # Persistent expense storage
│   ├── server.js                # Express app entry point
│   ├── .env.example             # Environment variable template
│   └── package.json
│
├── render.yaml                  # Render deployment blueprint
├── package.json                 # Root scripts (install all, dev helpers)
└── README.md
```

---

## Features Implemented

### Must Have
- Add expense with amount, category, date, optional note
- View expenses in grid or table, sorted newest first
- Edit and delete expenses
- Filter by category and date range (this month, last month, this year, custom)
- Summary panel: total spent, per-category totals, highest single expense

### Should Have
- Bar and pie charts (Recharts)
- INR currency formatting (`₹1,234.50`)
- Form validation (no negative amounts, no future dates, category required)

### Nice to Have (Bonus)
- CSV export of visible/filtered expenses
- Per-category budget settings with progress bars and over-budget warnings
- JSON file persistence on the backend

---

## Deployment

### Backend — Render

1. Go to [render.com](https://render.com) → **New** → **Blueprint** (or **Web Service**)
2. Set **Root Directory** to `backend`
3. **Build command:** `npm install`
4. **Start command:** `npm start`
5. Add environment variables:
   - `NODE_ENV` = `production`
   - `CLIENT_URL` = `https://expense-tracker-frontend.vercel.app`
   - `PORT` = `10000` (Render sets this automatically; fallback is fine)
6. Add a **persistent disk** mounted at `/opt/render/project/src/backend/data` (1 GB) so expenses survive redeploys
7. Deploy and verify: `https://your-service.onrender.com/api/health`

Or use the included `render.yaml` blueprint at the repo root.

### Frontend — Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Set **Root Directory** to `frontend`
3. Add environment variable:
   - `VITE_API_URL` = `https://expense-tracker-api.onrender.com` (your Render URL)
4. Deploy and open the live URL in an incognito window
5. Test add/edit/delete to confirm frontend ↔ backend communication

---

## Environment Variables

### Frontend (`frontend/.env.local`)

```
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=SpendWise Expense Tracker
```

### Backend (`backend/.env.local`)

```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

For production, set `CLIENT_URL` to your Vercel URL. Multiple origins are supported (comma-separated).

---

## Next Steps

**What I chose not to do (and why):**
- **SQLite/PostgreSQL** — JSON file was sufficient for the exercise scope and keeps setup simple
- **User authentication** — out of scope; single-user local-first design
- **Automated tests** — focused on delivering a complete working UI and API first
- **GitHub repo setup** — deferred per current workflow

**What I would build next:**
- User accounts and multi-user expense tracking
- Migrate storage to SQLite or PostgreSQL
- Unit and integration tests for API routes and React components
- Recurring expenses and monthly budget reports
- Dark/light theme toggle and improved mobile table UX
- Email or push notifications when a category exceeds its budget
