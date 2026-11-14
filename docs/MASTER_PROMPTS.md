# QUESTBOARD — Master Prompt & Implementation Directives

**Project:** QUESTBOARD — FlytBase Customer Success Intelligence CRM
**Date:** 14 November 2026
**Context:** Questathon Competition MVP

This document logs the staged architectural execution prompts and directives used to build and verify the QUESTBOARD application.

---

## Stage 1: Data Ingestion & Audit
- Execute local MCP ingestion (`npm run ingest`) to fetch:
  - `get_my_accounts` -> `data/accounts.json`
  - `get_all_paperwork` (Account A) -> `data/paperwork-A.json`
  - `get_all_paperwork` (Account B) -> `data/paperwork-B.json`
  - `get_signals` -> `data/signals.json`
  - `get_data_format` -> `data/data-format.json`
- Perform deep data audit across both accounts:
  - Account A: 4 forces, 35 docks, £350,000 GBP booked contract, 4 opportunities, 3 conditional offers.
  - Account B: 15 plants (14 docks installed), €140,000 EUR booked contract, 3 opportunities, 2 conditional offers, €1.2M theoretical savings claim.

---

## Stage 2: Five Core Customer-Success Questions
For both accounts, implement deterministic, evidence-backed answers:
1. **Book Value:** Isolates booked revenue, open pipeline, conditional unaccepted offers, and unverified claims. Enforces zero currency blending (£ GBP, € EUR, $ USD).
2. **Decision Power:** Maps Decision-makers, Payers, Signatories, Users, Blockers, and Champions. Distinguishes operational champions (Rhys Calder, Stefan Roy) from true financial signatories (Force CFOs, Group Security).
3. **What to Do First:** Exactly 3 ranked actions per account with deterministic priority rules (proximity to deadline, blocker severity, commercial impact).
4. **What is About to Go Wrong:** Risk radar covering leadership departure (Rhys Calder), unanswered event dependencies (Insp. Karen Mbeki, FB-11206), DPIA stalls (Fatima Osei, FB-10412), silent usage collapses (Aldermoor 3-dock anomaly), and undocumented rollout processes (Stefan's departing deputy).
5. **What You Still Don't Know:** Explicit unknowns detailing information gaps, why they matter, who can answer, and affected deals.

---

## Stage 3: Evidence & Provenance Engine
- Every numerical value, action deadline, and risk statement must link to an inspectable source record.
- Implement an interactive Slide-Over Evidence Drawer.
- Classify all evidence into DIRECT (verbatim source record), DERIVED (formula and input sources specified), or UNVERIFIED (quarantined claims).

---

## Stage 4: Live Event Monitoring & Rate-Limiting
- Integrate `get_signals` via JSON-RPC MCP.
- Enforce strict 65-second minimum cooldown and concurrency mutex in server runtime.
- Display live polling countdown, last refreshed timestamp, and stale/error indicators.
- Deduplicate signals by unique ID.

---

## Stage 5: Safe Write-Back Operation
- Support `write_note` for next steps, tasks, risks, and notes.
- Enforce client-side pre-flight JSON-RPC preview before submission.
- Validate non-empty payload and target account.
- Execute write-back strictly on server with `AQ_TOKEN`.

---

## Stage 6: Security, Verification & Cloud Hosting
- Ensure zero leakage of `AQ_TOKEN` to client-side code, network logs, or git commits.
- Implement clean curated fallback in `lib/snapshot.ts` so application runs reliably when `data/` is git-ignored in cloud environments.
- Verify TypeScript compilation and production Next.js build.
