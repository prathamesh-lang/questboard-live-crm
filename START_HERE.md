# START HERE — QUESTBOARD Execution Guide

**Competition Deadline:** 3:47 PM IST, 14 November 2026
**Product:** QUESTBOARD — FlytBase Customer Success Intelligence CRM
**Status:** MVP Fully Implemented & Tested

---

## Quick Navigation

1. **Local Development:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to access the Monday-ready executive dashboard.

2. **Run Production Build:**
   ```bash
   npm run build
   ```

3. **Verify Type Safety:**
   ```bash
   npx --package=typescript tsc --noEmit
   ```

4. **Public Deployment:**
   - Deploy directly to Vercel via GitHub integration.
   - Configure server-only environment variable: `AQ_TOKEN=<your_token>`.
   - Never commit `.env.local` or upload tokens to browser/public logs.

---

## Key Modules & Files

- `components/dashboard.tsx`: Executive 8-view customer-success interface.
- `components/evidence-drawer.tsx`: Interactive slide-over provenance and audit inspector.
- `lib/data/curated-data.ts`: Evidence-backed dataset covering all 5 questions for both accounts.
- `lib/types.ts`: Strongly typed data models for deals, stakeholders, actions, risks, and unknowns.
- `lib/rate-limit.ts`: Strict 65-second cooldown and concurrency mutex for MCP JSON-RPC.
- `app/api/signals/route.ts`: Live signal poller with deduplication and stale error handling.
- `app/api/write-note/route.ts`: Validated note/task/risk write-back to Questathon MCP.
- `ARCHITECTURE.md`: Complete system diagrams, data flow, and deployment specs.
- `docs/data-map.md`: Traceable mapping of all deals, stakeholders, and source records.
- `docs/thinking-doc.md`: Answers to product philosophy, decision rules, and AI usage.
