# QUESTBOARD System Architecture & Technical Specifications

**Product:** QUESTBOARD — Customer Success Intelligence CRM
**Target:** FlytBase Enterprise Customer Operations
**Context:** Independent Questathon Competition MVP — 14 November 2026
**Stack:** Next.js 15.5.6 (App Router), React 19.1.1, TypeScript 5.8, Node.js, Custom CSS

---

## 1. Architectural Overview & System Flow

```mermaid
flowchart TD
    subgraph Client ["Client Browser (Next.js 19 React Client)"]
        UI["QUESTBOARD Executive Dashboard"]
        Nav["8 Operational Views"]
        EvDrawer["Slide-Over Evidence Drawer"]
        Poller["Live Signals Poller (65s Guard)"]
        WriteForm["Validated Write-Back Note Form"]
    end

    subgraph Server ["Server Boundary (Next.js App Router / Node.js)"]
        Page["app/page.tsx (Server Component)"]
        SnapLoader["lib/snapshot.ts"]
        CuratedData["lib/data/curated-data.ts (Clean Fallback)"]
        LocalData["data/*.json (Git-Ignored Local Snapshots)"]
        RateGate["lib/rate-limit.ts (65s Cooldown & Mutex)"]
        SigAPI["app/api/signals/route.ts"]
        WriteAPI["app/api/write-note/route.ts"]
        McpClient["lib/mcp.ts (JSON-RPC over HTTP)"]
    end

    subgraph External ["External Services"]
        QuestMCP["Questathon MCP Server\nhttps://questathon.aihackerscollective.com/api/public/mcp"]
    end

    UI --> Nav
    UI --> EvDrawer
    UI --> WriteForm
    Poller -->|GET /api/signals| SigAPI
    WriteForm -->|POST /api/write-note| WriteAPI

    Page --> SnapLoader
    SnapLoader --> LocalData
    SnapLoader -.->|Fallback on Cloud Deploy| CuratedData
    Page --> UI

    SigAPI --> RateGate
    SigAPI --> McpClient
    WriteAPI --> RateGate
    WriteAPI --> McpClient

    McpClient -->|Bearer AQ_TOKEN\n(Strictly Server-Side)| QuestMCP
```

---

## 2. Core Architectural Layers

### 1. Presentation & Interaction Layer (`components/dashboard.tsx`, `components/evidence-drawer.tsx`)
- **8 Dedicated Views:** Command Centre (Default), Eastern Counties (A), Aldermoor (B), Deal Intelligence, Stakeholder Power Map, Evidence Room, Live Signals, and Write-Back.
- **Evidence Drawer:** Slide-over modal inspects verbatim source excerpts, document dates, repository paths, and classifications (DIRECT, DERIVED, UNVERIFIED) from any clickable source pill.
- **Strict Financial Classification:** Never blends currencies (£ GBP, € EUR, $ USD). Quarantines unverified claims (e.g. Stefan Roy's €1.2M theoretical savings, 300-dock framework spec).

### 2. Five-Question Intelligence Engine (`lib/data/curated-data.ts`, `lib/types.ts`)
Answers the five core customer-success questions deterministically for both accounts:
- **Q1: What is the book worth?** Detailed breakdown of booked contracts, open pipeline, conditional unaccepted offers, and unverified claims.
- **Q2: Who holds the power?** Multi-dimensional mapping: Decision-Maker, Payer, Signatory, Operational User, Blocker, and Champion.
- **Q3: What do you do first?** Exactly 3 deterministically ranked actions per account with priority, owner, exact due date (or "Date not recorded"), and evidence traceability.
- **Q4: What is about to go wrong?** Risk radar highlighting stakeholder transitions, unanswered event tickets, DPIA stalls, and silent telemetry anomalies.
- **Q5: What do you still not know?** Explicit unknowns identifying information gaps, why they matter, who can answer, and affected deals.

### 3. Provenance & Evidence Registry (`lib/data/curated-data.ts`)
- Indexes every fact, contract, paperwork record, and signal with a unique immutable ID.
- Categorizes evidence into:
  - **DIRECT:** Verbatim match from signed contract, email, ticket, or discovery log.
  - **DERIVED:** Calculated from documented parameters (formula and input sources displayed).
  - **UNVERIFIED:** Claims made without independent documentary corroboration.

### 4. Rate-Limiting & Concurrency Mutex (`lib/rate-limit.ts`)
- **Strict 65-Second Window:** Protects against Questathon API 429 throttling (1 call/min limit).
- **Concurrency Gate:** Blocks simultaneous overlapping requests. If a request is in flight, subsequent calls receive an immediate `429` with retry cooldown.
- **Unified Scheduler:** Both `get_signals` polling and `write_note` operations share the same server gate.

### 5. Server-Only MCP Protocol Client (`lib/mcp.ts`)
- Implements JSON-RPC 2.0 over HTTP.
- Uses `process.env.AQ_TOKEN` strictly within Node.js runtime.
- **Zero Token Leakage:** Never passes token to client JavaScript, HTML, headers, or API responses.

---

## 3. Deployment & Cloud Hosting Architecture

### Handling Git-Ignored Data in Production
- The `data/` directory contains raw player ingestion files and is intentionally excluded from Git via `.gitignore`.
- To prevent empty views or server runtime errors in production (such as Vercel or AWS), `lib/snapshot.ts` implements a multi-tier fallback:
  1. Checks if local `data/*.json` files exist on disk.
  2. If absent (cloud container), automatically falls back to the clean, reviewed `lib/data/curated-data.ts` dataset.
  3. Guarantees 100% operational uptime without committing private customer data.

### Environment Requirements
- Server environment variable `AQ_TOKEN` must be configured in hosting environment (e.g. Vercel Project Settings).
- Node.js 18+ runtime.
