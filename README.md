# Expense Tracker — Full Stack Application

## Project Title & Brief Description

**Exercise chosen:** Full Stack Expense Tracker

Expense Tracker is a personal expense tracking web application that lets users record daily spending, filter transactions, and understand where their money goes. I built this as a monorepo with a React frontend and an Express REST API backend. Expenses are persisted to a JSON file on the server. The dashboard includes summary statistics, category budgets with visual progress indicators, bar/pie charts, and CSV export of filtered results.

---

## Live Demo

| Service | URL | Status |
|---------|-----|--------|
| **Frontend (Vercel)** | https://expense-tracker-rouge-eta-88.vercel.app | Deployed |
| **Backend API (Render)** | https://expense-tracker-api.onrender.com | Deployed |

**Health check:** `GET https://expense-tracker-api.onrender.com/api/health`

> Test the live app in an **incognito window** to confirm frontend ↔ backend communication.

---

## Screenshots

_Add screenshots here after deployment or local testing._

| View | Screenshot |
|------|------------|
| Dashboard (desktop) | `screenshots/desktop-dashboard.png` |
| Expense form | `screenshots/expense-form.png` |
| Charts & summary | `screenshots/charts-summary.png` |
| Mobile (375px) | `screenshots/mobile-view.png` |

> Tip: Use browser DevTools → Toggle device toolbar to capture mobile screenshots at 320px, 375px, and 425px.

---

## Mobile Responsiveness

The UI is built mobile-first with Tailwind CSS breakpoints (`sm` 640px, `md` 768px, `lg` 1024px):

| Breakpoint | Layout behaviour |
|------------|------------------|
| **320–425px (mobile)** | Single-column layout; stacked navbar; grid card view; horizontally scrollable table with swipe hint; charts stack vertically |
| **768px (tablet)** | Two-column expense grid; filter toolbar inline; charts side-by-side |
| **1024px+ (desktop)** | Three-column dashboard: form + budgets left, transactions right; full filter grid |

**Responsive features:**
- `min-w-0` and `overflow-x-hidden` prevent horizontal page scroll
- Tables use `overflow-x-auto` with `min-width` — no layout breaking on small screens
- Charts use `ResponsiveContainer` with angled X-axis labels on mobile
- Forms and inputs use full width with `min-w-0` to stay within viewport
- Budget inputs stack to one column on very small screens

---

## Assessment Checklist

### Must Have
| Feature | Status |
|---------|--------|
| Add expense | Done |
| Edit expense | Done |
| Delete expense | Done |
| Category filter | Done |
| Date range filter (this month, last month, this year, custom, all) | Done |
| Summary panel (total, per-category, highest expense) | Done |

### Should Have
| Feature | Status |
|---------|--------|
| Chart visualization (bar + pie) | Done |
| INR currency formatting | Done |
| Form validation (positive amount, no future dates) | Done |

### Nice to Have (Bonus)
| Feature | Status |
|---------|--------|
| CSV export (filtered data) | Done |
| Budget indicators with progress bars | Done |
| JSON file persistence (backend) | Done |

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
2. Connect your GitHub repo: `https://github.com/Shrishti0423/Expense-tracker`
3. Settings:

| Setting | Value |
|---------|--------|
| **Root Directory** | `backend` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Health Check Path** | `/api/health` |

4. Environment variables:

| Key | Value |
|-----|--------|
| `NODE_ENV` | `production` |
| `CLIENT_URL` | Your Vercel frontend URL (e.g. `https://your-app.vercel.app`) |
| `PORT` | `10000` (Render may override automatically) |

5. Add a **persistent disk** mounted at `/opt/render/project/src/backend/data` (1 GB) so expenses survive redeploys
6. Deploy and verify: `https://your-service.onrender.com/api/health`

Or use the included [`render.yaml`](render.yaml) blueprint at the repo root.

### Frontend — Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import repo and set **Root Directory** to `frontend`
3. Framework preset: **Vite** (auto-detected via [`vercel.json`](frontend/vercel.json))
4. Environment variable:

| Key | Value |
|-----|--------|
| `VITE_API_URL` | Your Render backend URL (no `/api` suffix) |
| `VITE_APP_NAME` | `Expense Tracker` (optional) |

5. Deploy and open the live URL in an **incognito window**
6. Test add / edit / delete to confirm frontend ↔ backend communication

### Deployment order

1. Deploy **backend** on Render first
2. Deploy **frontend** on Vercel with `VITE_API_URL` pointing to Render
3. Update Render `CLIENT_URL` with your Vercel URL
4. Update README Live Demo section with both URLs

---

## Environment Variables

### Frontend (`frontend/.env.local`)

```
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Expense Tracker
```

### Backend (`backend/.env.local`)

```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

For production, set `CLIENT_URL` to your Vercel URL. Multiple origins are supported (comma-separated).

### Production notes

- API URL is read from `VITE_API_URL` at build time — redeploy frontend after changing it
- CORS is configured via `CLIENT_URL` on the backend
- Console logging is disabled in production builds (dev-only in `api.js`)
- No hardcoded production URLs in source — only `.env.example` defaults for local dev

---

## Next Steps

**What I chose not to do (and why):**
- **SQLite/PostgreSQL** — JSON file was sufficient for the exercise scope and keeps setup simple
- **User authentication** — out of scope; single-user local-first design
- **Automated tests** — focused on delivering a complete working UI and API first

**What I would build next:**
- User accounts and multi-user expense tracking
- Migrate storage to SQLite or PostgreSQL
- Unit and integration tests for API routes and React components
- Recurring expenses and monthly budget reports
- Dark/light theme toggle and improved mobile table UX
- Email or push notifications when a category exceeds its budget
