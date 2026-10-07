# SKY — SSH Key Yardstick

**Intelligent SSH log analysis with unsupervised K-Means clustering for brute-force detection.**

SKY analyzes SSH authentication logs and automatically separates IP addresses into Normal, Suspicious, and Attacker risk categories using machine learning — entirely in your browser, with zero server-side processing or data transmission.

## Features

- **CSV & auth.log Parsing** — Accept raw Linux SSH logs or structured CSV exports
- **Feature Extraction** — Automatically compute behavioral metrics per IP:
  - Total/failed attempt counts
  - Failure ratio (%)
  - Login frequency (attempts/hour)
  - Unique username targets
  - Peak access hour
- **K-Means Clustering** — Unsupervised grouping into 3 risk tiers (Normal/Suspicious/Attacker)
- **Risk Scoring** — Continuous 0–150 score per IP based on failure rate & attempt volume
- **Live Operations Dashboard** — Real-time stats, login activity chart, top offenders
- **Risk Scoreboard** — All IPs ranked by risk with filtering & progress visualization
- **Cluster Insights** — Per-cluster statistics and sample members
- **Cluster Laboratory** — Interactive scatter plot with K-Means parameter tuning
- **Privacy-First** — All analysis happens in-browser; no logs uploaded or stored remotely

## Tech Stack

- **Frontend**: React 18, React Router v6, Tailwind CSS, Recharts
- **Build**: Vite
- **Backend**: Node.js, Express, MongoDB (scaffolded; not required for MVP)
- **Algorithm**: K-Means clustering (client-side, 7 exports in `kmeansEngine.js`)

## Quick Start

### Prerequisites
- Node.js v18+
- npm v9+

### Installation

```bash
git clone https://github.com/notmajed-dev/SKY-v2.git
cd SKY-v2
npm install
npm run dev
```

Open **http://localhost:3000** in your browser.

### Optional: Start Backend

```bash
npm run server
```

Backend runs on http://localhost:5000 (not required for MVP).

## Workflow

1. **Upload** — Drag CSV/auth.log to the upload area
2. **Preview** — View parsed records and extracted features
3. **Cluster** — Click "Run K-Means Clustering" to analyze
4. **Explore** — Navigate between dashboards:
   - **Live Ops** — Overview stats & login activity chart
   - **Risk Scoreboard** — All IPs ranked by risk
   - **Cluster Insights** — Per-cluster statistics
   - **Cluster Lab** — Interactive scatter plot & parameter tuning

## File Structure

```
sky-v2/
├── src/
│   ├── components/
│   │   ├── Upload.jsx               # File upload (drag-drop)
│   │   ├── PreviewTable.jsx         # Parsed records + features + cluster trigger
│   │   ├── LiveOps.jsx              # Dashboard: stats + login activity chart
│   │   ├── RiskScoreboard.jsx       # All IPs ranked by risk score
│   │   ├── ClusterInsights.jsx      # Per-cluster statistics
│   │   └── ClusterLab.jsx           # Interactive scatter plot + K-Means controls
│   ├── utils/
│   │   ├── csvParser.js             # CSV/auth.log parsing
│   │   ├── featureExtractor.js      # Behavioral feature extraction
│   │   ├── kmeansEngine.js          # K-Means algorithm (7 exports)
│   │   ├── clusteringService.js     # Orchestration pipeline
│   │   ├── dashboardService.js      # Live Ops calculations
│   │   ├── scoreBoardService.js     # Risk ranking
│   │   ├── clusterInsightsService.js# Per-cluster stats
│   │   └── scatterPlotService.js    # Scatter data generation
│   ├── styles/
│   │   └── index.css                # Tailwind + global styles
│   ├── App.jsx                      # Routes & layout
│   └── main.jsx                     # React entry point
├── server/                          # Backend scaffold (not used in MVP)
├── public/
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Data Persistence

- Parsed records, statistics, and clustering results are stored in **localStorage**
- Data persists across page reloads until cleared
- No server-side storage or network transmission

## Algorithm: K-Means Clustering

SKY uses Lloyd's K-Means algorithm to partition IPs into 3 clusters:

1. **Feature Extraction** — Extract 7 behavioral metrics per IP
2. **Normalization** — Scale features to [0, 1] range
3. **Initialization** — Place 3 random centroids (seeded for reproducibility)
4. **Iteration** — Assign points → update centroids → repeat until convergence
5. **Labeling** — Assign clusters to Normal/Suspicious/Attacker by ascending failure ratio
6. **Risk Score** — Compute continuous score: `baseScore × multiplier`, capped at 150

### Parameterization

| Parameter | Default | Range | Purpose |
|---|---|---|---|
| K | 3 | Fixed | Number of clusters (risk tiers) |
| Max Iterations | 12 | 1–20 | Convergence limit |
| Seed | 1 | 1–100 | Centroid initialization reproducibility |

Adjust in **Cluster Laboratory**.

## Risk Scoring

```
Risk Score = baseScore × multiplier  (capped at 150)

baseScore  = failureRatio (%) × (totalAttempts / 10)

multiplier:
  Normal     → 0.5
  Suspicious → 2.0
  Attacker   → 4.0
```

Example: IP with 100% failure, 4 attempts, Attacker label:

```
baseScore = 100 × (4 / 10) = 40
score     = 40 × 4 = 160  →  capped to 150
```

## Test Data

Sample CSV for testing (7 rows, 3 IPs):

```csv
IP,timestamp,username,status
10.0.4.148,2024-01-15 07:23:45,admin,failed
10.0.4.148,2024-01-15 07:24:10,root,failed
10.0.4.148,2024-01-15 07:25:00,admin,failed
10.0.4.200,2024-01-15 08:10:30,user1,success
10.0.4.200,2024-01-15 08:11:00,user2,success
10.0.4.100,2024-01-15 09:00:00,guest,success
10.0.4.148,2024-01-15 10:30:15,admin,failed
```

Expected clustering:
- `10.0.4.148` → **Attacker** (100% fail, risk 150)
- `10.0.4.200`, `10.0.4.100` → **Normal** (0% fail, risk 0)

## Limitations & Future Work

### Current Limitations
- K is fixed at 3 (no adaptive cluster count)
- Large files (>100 MB) may strain browser memory
- K-Means assumes spherical, similarly-sized clusters

### Planned Enhancements
- [ ] Adaptive K selection (elbow method / silhouette analysis)
- [ ] Geolocation lookups for flagged IPs
- [ ] Watch-folder ingestion (auto re-upload)
- [ ] fail2ban integration (automated blocking)
- [ ] Historical trend tracking (risk over time)

## Development

### Build & Preview

```bash
npm run build
npm run preview
```

### Git Workflow

Each checkpoint is a git commit:

```bash
git log --oneline
# feat(cp1): initialize project scaffolding
# feat(cp2): implement CSV parser and upload UI
# feat(cp3): feature extraction pipeline
# feat(cp4): K-Means clustering engine with risk scoring
# feat(cp5): live ops dashboard with recharts login activity
# feat(cp6): risk scoreboard with full IP ranking
# feat(cp7): cluster insights & interactive cluster lab
```

## License

MIT — Free to use, modify, redistribute.

## Author

Built by @notmajed-dev | Checkpoint-based iterative development

---

**Questions?** Check the code — it's minimal and self-documenting.
