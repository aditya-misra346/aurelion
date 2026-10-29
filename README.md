# AURELION — Private & Digital Banking Experience

**Tagline:** *"Banking, Beyond Ordinary."*

AURELION is a luxury-grade, interactive digital banking web application crafted with React 18, TypeScript, Tailwind CSS, Recharts, and Lucide Icons.

> **Important Demonstration Disclosure:** AURELION is a fictional product demonstration powered entirely by synthetic sample data. No real banking operations, wire transfers, or identity verifications are performed.

## Quick Start

### Launch the Development Server

```bash
./start-aurelion.sh
```

Or if using Node.js directly:

```bash
export PATH="/Users/aditya/.gemini/antigravity/scratch/tools/node-v22.14.0-darwin-arm64/bin:$PATH"
npm install
npm run dev
```

### Build for Production

```bash
export PATH="/Users/aditya/.gemini/antigravity/scratch/tools/node-v22.14.0-darwin-arm64/bin:$PATH"
npm run build
```

## Implemented Route Architecture (21 Routes)

### Public Website
1. `/` — Signature Homepage (Hero, Trust Strip, Account Tiers, 3D Interactive Card Studio, Live Portfolio Telemetry, Editorial Bento Features, Interactive Security Posture Simulator, Persona Scenarios, Interactive FAQ)
2. `/personal-banking` — Personal Banking & Automated Inflow Sweep Simulator
3. `/accounts` — Signature Account Tier Comparison Matrix & Reserve Vault Compounding Calculator
4. `/cards` — Metal Card Collection & Interactive 3D Card Studio
5. `/payments` — Global Corridors & Multi-Currency Settlement Estimator
6. `/loans` — Tailored Private Credit & Amortization Calculator
7. `/wealth` — Private Wealth & Treasury Overview
8. `/security` — Defense-in-Depth Security & Privacy Architecture
9. `/about` — Institutional Philosophy & Design Principles
10. `/contact` — Global Client Concierge Desks & Interactive Inquiry Dispatch
11. `/login` — Safe Demo Sign-In Portal (no real passwords collected)
12. `/signup` — 2-Step Interactive Account Configuration & Onboarding Flow

### Authenticated Client Dashboard
13. `/dashboard` — Executive Overview (KPIs, Account Switcher, Balance Masking, Cash Flow & Balance Charts, Budget Adherence, Recent Activity, Goals & Upcoming Recurring Commitments)
14. `/dashboard/accounts` — Multi-Account Inspector (Available vs. Current vs. Pending Balances, One-Click Copy Identifiers, Linked Vault Goal Creation/Renaming, Sample Statement Downloads)
15. `/dashboard/transactions` — Interactive Transaction Ledger (Search, Date Range, Category, Type & Status Filters, Multi-Column Sorting, Pagination, Detail Slide-Over Drawer, Working CSV Export)
16. `/dashboard/transfers` — 6-Step Validated Simulated Transfer Workflow (Updates account balances, budgets, notifications, and ledger in real time)
17. `/dashboard/cards` — Payment Card Governance (Carousel, 3D Flip, Sample Number Reveal, Instant Lock/Unlock, Online/Contactless/International Toggles, Velocity Limit Sliders, Card Activity)
18. `/dashboard/budgets` — Monthly Category Budgets & Capital Savings Goals (Create, Edit, Delete, Add Simulated Contributions, Live Progress & Completion Projections)
19. `/dashboard/analytics` — Quantitative Portfolio Telemetry (Savings Rate, MoM Deltas, 6-Month Cash Flow Trends, Category Share, Largest Expenses, Merchant-Level Breakdown)
20. `/dashboard/profile` — Editable Fictional Client Dossier & Private Advisor Directory
21. `/dashboard/settings` — Theme Switcher (Midnight Navy Dark / Soft Ivory Light), Currency Display Converter (`USD`, `EUR`, `GBP`, `CHF`), Security/Privacy Toggles, and One-Click Demo Reset
