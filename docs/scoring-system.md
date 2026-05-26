# AI Discoverability Platform - Visibility Scoring Handbook

Welcome to the technical handbook for the **AI Visibility Scoring System** (Phase 3). This document details how we compute an explainable, transparent search discoverability rating (**0–100**) for businesses based on four key heuristics: mention rate, ranking position decay, local reviews, and website authority.

---

## 1. Scoring Core Philosophy: Explainability & Trust

In modern marketing, business owners are tired of "black-box" scores that say *"Your search rank is 78/100"* without explaining *why*. 

### Why Heuristic Scoring?
We intentionally avoided advanced Machine Learning models or vector distance calculations for Phase 3. Instead, we chose a **transparent heuristic formula**:
- **Fully Explainable**: Any business owner can see exactly how each metric is calculated.
- **Actionable Gaps**: If their score is low, they can inspect which sub-score failed and execute concrete tasks to improve it.
- **Deterministic**: The same audit inputs yield reproducible, stable calculations.

---

## 2. Heuristic weights & Breakdown

The overall **AI Visibility Score** blends four diverse metrics, balanced according to their influence on AI scraper citation models:

| Heuristic Factor | Weight | Description | Easiest Optimization Task |
| :--- | :--- | :--- | :--- |
| **Mention Frequency** | **40% (0.40)** | Ratio of search query crawls your brand is cited in. | Build citations in authority directories. |
| **Ranking Position** | **30% (0.30)** | Decay score mapping how early you are recommended. | Author comprehensive, structured pages. |
| **Local Review Signals** | **15% (0.15)** | Blends star rating quality and trust count volume. | Increase keyword-rich Google review counts. |
| **Website SEO Authority** | **15% (0.15)** | Heuristics on domain authority, keywords, and SSL HTTPS. | Enable SSL HTTPS security on your site. |

---

## 3. Mathematical Formulas of Scoring Sub-Modules

### A. Frequency Score (`frequencyScore.js`)
Calculates the brand discoverability ratio across executed queries:

$$\text{Frequency Score} = \left( \frac{\text{Query Mentions}}{\text{Total Queries Run}} \right) \times 100$$

*Example:* Cited in 2 out of 3 queries $\rightarrow 66.7 \approx 67$ points.

### B. Ranking Position Score (`rankingScore.js`)
Applies a linear decay model. Being cited first is extremely valuable, while ranks deeper in list responses lose weight rapidly:
- **Rank #1.0**: `100 points`
- **Rank #2.0**: `80 points`
- **Rank #3.0**: `60 points`
- **Rank #4.0**: `40 points`
- **Rank #5.0**: `20 points`
- **Rank > #5.0**: `max(0, 20 - (averagePosition - 5) * 5)` (decays slowly)
- **Unlisted**: `0 points`

### C. Local Review Signals Score (`reviewScore.js`)
Weighs average rating quality (70% weight) and review counts trust volume (30% weight) sourced from `mockDataService.js`:
- `Rating Score = rating * 20` (Converts 0.0-5.0 scale to 0-100 index).
- `Count Score = min(100, (reviewCount / 1000) * 100)` (Normalizes count up to 1000 reviews for full points).

$$\text{Review Score} = (\text{Rating Score} \times 0.70) + (\text{Count Score} \times 0.30)$$

### D. Website SEO Authority Score (`authorityScore.js`)
Heuristically checks site coordinates to award points:
- Has active website base: `+30 points`
- Domain Authority (DA 0-100 scale): `domainAuthority * 0.40` (max 40 points)
- Sector keywords present in meta tags: `+20 points`
- SSL Security active (HTTPS protocol): `+10 points`

$$\text{Authority Score} = \text{Base (30)} + (\text{DA} \times 0.40) + \text{Keywords (20)} + \text{SSL (10)}$$

---

## 4. Score Normalization & Clamping

To prevent out-of-bound errors, every sub-score and the final overall score are channeled through a central utility **`normalizeScore.js`** which clamps values strictly between `0` and `100`:
```javascript
const normalize = (value) => {
  return Math.min(100, Math.max(0, Math.round(value)));
};
```

---

## 5. History Tracking & Trends Architecture (Step 10 Prep)

To prepare for timeline tracking without immediately configuring relational PostgreSQL updates in Phase 3, the scoring endpoint returns a consistent **historical trends array**:
```json
"history": [
  { "date": "2026-05-23", "score": 68 },
  { "date": "2026-05-24", "score": 73 },
  { "date": "2026-05-25", "score": 76 },
  { "date": "2026-05-26", "score": 78 }
]
```
### Evolving in Phase 4:
In the future, we will set up a cron job or scheduled cron worker:
1. Daily runs crawl queries for target brands.
2. The score calculator runs and compiles scorecards.
3. The results are logged directly in the `visibility_reports` PostgreSQL table.
4. The dashboard queries the table to render live timeline SVG charts mapping historic progress.

---

## 6. Future Scalability: Signals Expansion

The scoring architecture is designed to scale and accommodate modern search signals:
- **Social Citations (Reddit/Quora)**: Scrape if the brand is recommended on `/r/mumbai` or popular subreddits, adding a new `SocialScore` module weighted at 10%.
- **Sentiment Index**: Apply lightweight Sentiment Lexicon scores to text answers (e.g. positive citation vs critical comparison) to adjust the base score.
- **Direct Search Engine optimization (SEO) APIs**: Replace the `mockDataService` with a live Moz/Ahrefs API integration to fetch authentic Domain Authority values.
