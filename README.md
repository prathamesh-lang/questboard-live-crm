# QUESTBOARD — Customer Success Intelligence CRM

**Customer Operations for Autonomous Drone Deployments**
*Questathon Competition MVP — 14 November 2026*

> **DISCLAIMER:** QUESTBOARD is an independent competition prototype built for the Questathon Hackathon. It is **NOT** an official FlytBase product and must not imply official endorsement by FlytBase.

---

## 1. Product Overview

QUESTBOARD is an evidence-driven Customer Success operating system designed for an enterprise Customer Success Manager (CSM) taking over complex autonomous drone dock accounts.

When opening QUESTBOARD on Monday morning, an executive CSM instantly understands:
- **What the account book is worth:** Verified booked annual recurring revenue (ARR) cleanly isolated from open pipeline, conditional unaccepted offers, and unverified customer claims.
- **Who actually holds decision-making power:** Operational champions separated from true purchasing authorities and regulatory blockers.
- **What to do first:** Deterministically ranked next actions with verified owners, actual deadlines, and evidence sources.
- **What is about to go wrong:** Predictive risk radar tracking stakeholder exits, unanswered event tickets, DPIA stalls, and silent telemetry drop-offs.
- **What you still do not know:** Honest, explicit unknowns detailing what information is missing, why it matters, who can answer, and the affected deal.

---

## 2. The Two Enterprise Accounts

### Account A: Eastern Counties Police Alliance
- **Operational Reality:** 4 member forces (Westmere, Metro Central, Tarn Valley, Norwold). Only Westmere and Metro Central fly live missions. Tarn Valley has 0 live missions (DPIA blocked). Norwold only trains.
- **Booked ARR:** **£350,000 / year** (GBP) — Signed contract on file (`contract_a`), all 4 invoices paid.
- **Key Champions & Blockers:** Rhys Calder (Programme Lead, Ally — *Leaving in January 2027*); Fatima Osei (Tarn Valley DPO — *DPIA blocked 4 months waiting on FlytBase data-flow pack*); Insp. Karen Mbeki (Westmere Drone Unit — *Urgent event 5 Dec, unanswered ticket FB-11206*).
- **Financial Rule:** Decentralized budgets. Each force CFO must individually approve call-offs.

### Account B: Aldermoor Industrial Group
- **Operational Reality:** 15 plants (14 docks installed, 13 flying). Only 4 plants fly regularly; 9 plants only log test flights. Plant 15 has no dock.
- **Booked ARR:** **€140,000 / year** (EUR) — Signed contract on file (`contract_b`).
- **Key Stakeholders & Risks:** Stefan Roy (Head of Group Security, Sponsor); Stefan's Deputy (*Undocumented rollout know-how; leaving shortly*); Owen Fitch (Head of Group IT — *Zero ongoing IT maintenance ownership*); Beatriz Alonso (Plant 7 Manager — *Night alert friction*).
- **Financial Rule:** Stefan's €1.2M annual savings claim is strictly theoretical guard hours replaced; Finance has booked €0 in savings.

---

## 3. Key Features

1. **Executive Command Centre:** Unified overview of both enterprise accounts, isolating currencies (£ GBP, € EUR, $ USD) with zero artificial blending.
2. **Deterministic Five-Question Intelligence:** Dedicated deep-dive panels for all five core customer-success questions per account.
3. **Interactive Evidence & Provenance Drawer:** Every numerical statement, action deadline, and risk links to an inspectable source ID with verbatim excerpts, document dates, and provenance classifications (`DIRECT`, `DERIVED`, `UNVERIFIED`).
4. **Live Signal Monitoring:** JSON-RPC integration with MCP tool `get_signals`, respecting a strict 65-second rate limit, deduplicating signals by unique ID, and providing cooldown countdown timers.
5. **Two-Way Action Write-Back:** Server-side write-back using `write_note` with pre-flight JSON-RPC payload preview, character counters, and explicit confirmation.
6. **Honest Unknowns Engine:** Explicitly highlights missing information and unanswered questions rather than fabricating false health scores.

---

## 4. Technology Stack

- **Framework:** Next.js 15.5.6 (App Router)
- **Library:** React 19.1.1
- **Language:** TypeScript 5.8
- **Runtime:** Node.js 18+
- **Styling:** Custom Enterprise Dark CSS (`app/globals.css`)
- **Protocol:** Questathon MCP JSON-RPC over HTTP (`lib/mcp.ts`)
- **Dependencies:** Zero external bloat (built on core Next.js & React)

---

## 5. Security & Confidentiality

The `AQ_TOKEN` is confidential and strictly protected:
- **Server-Side Only:** `process.env.AQ_TOKEN` is used exclusively within Node.js API routes and scripts.
- **Zero Client Exposure:** Never exposed in browser JavaScript, `NEXT_PUBLIC_*` variables, or client bundle.
- **Git Protection:** `.env.local` and raw local `data/` directories are git-ignored.
- **Production Fallback:** `lib/snapshot.ts` safely falls back to sanitized curated records if `data/` is excluded on cloud deployments.

---

## 6. Local Setup & Execution

```bash
# 1. Clone repository
git clone https://github.com/prathamesh-lang/questboard-live-crm.git
cd questboard-live-crm

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local and set AQ_TOKEN=<your_token> (never commit this file)

# 3. Install dependencies
npm install

# 4. Ingest data (already completed in production snapshot)
# npm run ingest

# 5. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 7. Testing & Verification

```bash
# Typecheck
npx --package=typescript tsc --noEmit

# Production Build
npm run build
```

---

## 8. Deployment

To deploy to Vercel or any Node.js hosting platform:
1. Connect the GitHub repository `prathamesh-lang/questboard-live-crm`.
2. Add `AQ_TOKEN` in the hosting environment variables settings.
3. Deploy. The application's multi-tier snapshot engine will serve curated evidence records seamlessly without requiring private customer files in git.
