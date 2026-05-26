# AI Discoverability Platform - Dashboard UI & Frontend Handbook

Welcome to the technical handbook for the **Phase 6 Dashboard UI & Frontend Experience**. This document explains the modern SaaS frontend architecture, layout and shared navigation systems, lightweight React Context state, Recharts visualization components, and strategies for expanding dashboard capability sets.

---

## 1. Frontend System Architecture Overview

The frontend experience is designed to feel highly intelligent, responsive, and minimalist, emphasizing clear analytics data points. We have decoupled marketing-focused pages from deep scanning analytics utilities.

```text
frontend/src/
├── app/
│   ├── page.js                       # Public marketing landing page (has global headers/footers)
│   └── dashboard/
│       ├── layout.js                 # Nested Dashboard Layout containing Sidebar + Top Navbar
│       └── page.js                   # Client-side dynamic switch rendering page components
├── context/
│   └── DashboardContext.js           # Lightweight React Context managing global state
├── lib/
│   └── mockData.js                   # Stable hash-reproducible 30-day time-series telemetry generator
├── components/
│   ├── shared/                       # Shared navigation controls (Sidebar, Navbar)
│   ├── ui/                           # Layout fallback primitives (LoadingSkeleton, EmptyResults)
│   ├── charts/                       # Reusable responsive chart wrappers (TrendChart, ScoreComparisonChart)
│   ├── dashboard/                    # Core SearchCockpit and Visibility scoreboard views
│   ├── competitors/                  # Competitor benchmark comparison views
│   ├── recommendations/              # Filterable prioritized task checklists
│   └── analytics/                    # Recharts-based history trends dashboards
```

### Path-Based Client Bypasses
To allow marketing pages (`/`) and SaaS tools (`/dashboard`) to exist under a unified root directory structure, the global marketing header ([Navbar.js](file:///c:/Users/Lenovo/per-project/AI_tools_recommending/frontend/src/components/Navbar.js)) and [Footer.js](file:///c:/Users/Lenovo/per-project/AI_tools_recommending/frontend/src/components/Footer.js) use path checks:
```javascript
const pathname = usePathname();
if (pathname && pathname.startsWith('/dashboard')) {
  return null; // Suppresses marketing elements inside the SaaS workspace
}
```

---

## 2. Centralized State Store: `DashboardContext.js`

To prevent massive component files and deep prop drilling, all query coordinators, loading statuses, and audit report payloads are managed inside a lightweight React Context provider:

*   **`activeSection`**: Controls which tab is highlighted in the sidebar and dynamically rendered in the main dashboard workspace (`home`, `visibility`, `competitors`, `recommendations`, or `analytics`).
*   **`status`**: Current operation cycle state (`idle` | `scanning` | `success` | `error`).
*   **`triggerAuditScan(coords)`**: Central asynchronous orchestrator. Fires concurrent scoring, competitor, and recommendations HTTP requests using `Promise.all`:
    ```javascript
    const [scoreRes, compRes, recRes] = await Promise.all([
      apiService.executeQueryEngine({ business, category, city }),
      apiService.executeCompetitorAnalysis({ business, category, city }),
      apiService.generateRecommendations({ business, category, city })
    ]);
    ```
*   **`searchHistory`**: Stores a list of up to 5 recently audited business coordinates in `localStorage`, enabling users to instantly toggle between demo brands with a single click.

---

## 3. Collapsible Sidebar & Navigation Layout

The layout uses a multi-column responsive dashboard structure:
*   **Collapsible Sidebar ([Sidebar.js](file:///c:/Users/Lenovo/per-project/AI_tools_recommending/frontend/src/components/shared/Sidebar.js))**: Features clean navigational tabs with Lucide React icons. Supports collapsible animation, folding down to compact 64px width on narrow screens or upon click, showing only mini-icons with responsive tooltips.
*   **Action Pings**: Active tabs feature a pulsed indicator ping, while inactive data tabs (Visibility, Competitors, Analytics) are locked with an elegant disabled opacity state until a successful scan is loaded.
*   **Top Navbar ([Navbar.js](file:///c:/Users/Lenovo/per-project/AI_tools_recommending/frontend/src/components/shared/Navbar.js))**: Incorporates dynamic breadcrumbs, quick templates recall select overlays, a light/dark theme toggler, and user account status displays.

---

## 4. Reusable Responsive Chart Systems (`/components/charts/`)

SaaS users rely on visual charts to digest brand performance gains. We created reusable, dark-mode-optimized chart components powered by **Recharts**:

### A. Trend Area Chart ([TrendChart.js](file:///c:/Users/Lenovo/per-project/AI_tools_recommending/frontend/src/components/charts/TrendChart.js))
*   **Purpose**: Plots your overall 30-day discoverability progression.
*   **Design**: Employs an `AreaChart` with customized linear color gradients, clean dotted horizontal grids, hidden axis lines, and dark minimal tooltips.
*   **Telemetry**: Starts lower and rises smoothly to the brand's current actual score to demonstrate optimization growth curves.

### B. Competitive Line Chart ([ScoreComparisonChart.js](file:///c:/Users/Lenovo/per-project/AI_tools_recommending/frontend/src/components/charts/ScoreComparisonChart.js))
*   **Purpose**: Contrasts your progression against two main local competitors.
*   **Design**: Plots a solid indigo line representing your brand's growth and dotted rose/amber curves showing competitor averages.
*   **UX value**: Demonstrates visually how optimizing signals enables your brand to defeat competitor averages.

---

## 5. UI Loading & Empty State Fallbacks

To ensure high startup-quality product feel, we engineered dedicated UI states:
*   **`LoadingSkeleton.js`**: Replaces standard spinners with structured layout blocks that pulsate. Simulates radial score outlines, horizontal bar breakdown rows, and checklist cards.
*   **`EmptyResults.js`**: Displays a custom Compass illustration, explains platform features, and prompts the user to launch their first crawl audit using one of two pre-configured template recall templates (Gold's Gym or Initech Café).

---

## 6. Future SaaS Scalability Architecture

The frontend directory and components are built to support future features without breaking existing MVP structures:

1.  **Multi-Business Tracking Dashboard**:
    *   *Implementation*: Extend `DashboardContext` to carry an array of active reports. Modify the top Navbar to render a multi-business tab toggle allowing users to swap their active workspace audit.
2.  **AI-Generated Summarization Reports (Phase 6b)**:
    *   *Implementation*: Incorporate a dynamic "Summarize with OpenAI" button above the `VisibilityView`. Create a `backend/controllers/openaiController.js` to fetch summaries and display them in a dynamic floating popover card.
3.  **Scheduled GEO/SEO Alerts**:
    *   *Implementation*: Mount a notifications center bell icon in the Navbar, hooking it up to a backend cron database table storing alerts when visibility scores change.
