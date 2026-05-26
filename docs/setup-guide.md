# AI Discoverability Platform - Setup & Installation Guide

Welcome to the Setup Guide for Phase 1 of the **AI Discoverability Platform**. This document describes how to configure, run, and test both the frontend and backend of the application on your local machine.

---

## 1. Project Directory Layout

Ensure your root workspace is organized as follows:
```text
project-root/
│
├── frontend/             # Next.js App Router Web UI
├── backend/              # Node.js + Express + Playwright Server
├── database/             # PostgreSQL / Supabase connection mapping
└── docs/                 # Documentation manuals
```

---

## 2. Setting Up the Backend

The Express backend manages web scraping using Playwright, computes visibility scoring indices, and acts as the bridge to the database.

### Step A: Configure Environment Variables
1. Navigate to the `backend/` directory.
2. Duplicate the `.env.example` file and rename it to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and review the configurations (default `PORT` is `5000`).

### Step B: Install Core Node Dependencies
Inside `/backend`, run:
```bash
npm install
```

### Step C: Download Playwright Browser Drivers
Playwright runs isolated browsers to crawl site search rankings. To download the necessary headless Chromium browser binaries, run the custom npm script:
```bash
npm run playwright:install
```

### Step D: Launch Backend Server in Development Mode
To start the backend with `nodemon` (auto-restarts on code modification):
```bash
npm run dev
```
The server will boot up and bind to: `http://localhost:5000`

### Step E: Verify Backend Connectivity
Visit the health API route in your browser or command terminal:
- **URL**: `http://localhost:5000/api/health`
- **Expected JSON Response**:
  ```json
  {
    "success": true,
    "message": "Backend working"
  }
  ```

---

## 3. Setting Up the Frontend

The Next.js frontend delivers a premium dashboard UI optimized using Tailwind CSS.

### Step A: Configure Environment Variables
1. Navigate to the `frontend/` directory.
2. Duplicate the `.env.example` file and rename it to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Set the backend connection URL:
   ```text
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   ```

### Step B: Install Node Dependencies
Inside `/frontend`, run:
```bash
npm install
```

### Step C: Install UI libraries
Ensure you have standard Axios and React Icons installed for dashboard operations:
```bash
npm install axios react-icons
```

### Step D: Launch Frontend Server
To run Next.js in development mode:
```bash
npm run dev
```
The client dashboard will launch at: `http://localhost:3000`

---

## 4. Run Playwright Scraper Test

To verify Playwright runs and queries web assets successfully in your current OS sandbox, run:
```bash
npm run test-playwright
```
This triggers the standalone script located in `/backend/playwright/test-google.js` which spins up a headless Chromium instance, visits Google, extracts the site header title, and prints it in the terminal console.

---

## 5. Deployment Strategies

### Backend → Railway
1. **Repository Layout**: Commit the code to GitHub.
2. **Railway Project**: Link your GitHub repository in Railway.
3. **Subfolder deployment**: Specify `/backend` as the Root Directory in Railway's Service settings.
4. **Environment settings**: Inject your custom Environment Variables (like `PORT`, `FRONTEND_URL`, `DATABASE_URL`) inside Railway's dashboard.
5. **Playwright Support**: Railway automatically supports Playwright container engines if using standard Node environments or docker configurations.

### Frontend → Vercel
1. **scaffold project**: Connect the repo to Vercel.
2. **Root Directory**: Select `/frontend` as the root path.
3. **Framework**: Choose `Next.js` (detected automatically).
4. **Env Config**: Add `NEXT_PUBLIC_BACKEND_URL` pointing to your deployed Railway backend URL.
5. **Deploy**: Select Deploy and your client is live.
