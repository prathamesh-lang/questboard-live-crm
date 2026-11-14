# QUESTBOARD — Product Thinking & Architectural Decisions

**Product:** QUESTBOARD — FlytBase Customer Success Intelligence CRM
**Competition Hand-in:** 14 November 2026
**Target User:** Enterprise Customer Success Manager (CSM) managing complex drone automation deployments.

---

## 1. What It Does and For Whom
QUESTBOARD is a purpose-built Customer Success operating system designed for an enterprise CSM managing complex, multi-stakeholder autonomous drone operations. On a Monday morning, an executive CSM must immediately understand:
- **What the account book is worth:** Booked ARR separated from pipeline, conditional unaccepted offers, and unverified customer projections.
- **Who holds the power:** Distinguishing operational advocates from true financial signatories and gatekeeping blockers across decentralized authorities.
- **What to do first:** Deterministically ranked next actions with verified owners, actual deadlines, and commercial impact.
- **What is about to go wrong:** Predictive risk radar tracking stakeholder departures, unanswered event dependencies, unassigned support tickets, and silent telemetry drop-offs.
- **What you still do not know:** Honest, explicit unknowns detailing the missing information, why it matters, who can answer, and the affected deal.

---

## 2. How It Decides: Deterministic Business Rules

1. **Strict Financial Provenance & Zero Blending:**
   - Contract values are recognized as booked only with a signed order form on file (`contract.txt`).
   - Different currencies (£ GBP, € EUR, $ USD) are NEVER summed together.
   - Theoretical customer claims (e.g. Stefan Roy's €1.2M theoretical security guard savings) are strictly quarantined as UNVERIFIED because no guard contracts were cut and Aldermoor Finance booked €0.
   - Framework tender specifications (e.g. 300-dock £1.5M alliance tender) are categorized as tender positioning, NOT purchase orders.
2. **Authority Decoupling:**
   - Operational trust does not equal purchasing power. Rhys Calder is an enthusiastic alliance champion, but each police force CFO must individually approve call-offs.
   - Ewan Brooks is a Finance Business Partner, NOT the Chief Financial Officer; Metro Central requires flight economics before CFO review.
3. **Deterministic Action Ranking:**
   - Actions are ranked by:
     1. Proximity to explicit real-world deadline (e.g. Insp. Karen Mbeki's 5 Dec public event outranks generic check-ins).
     2. Blocker severity (e.g. Fatima Osei's 4-month DPIA stall unblocking $200k ARR).
     3. Continuity risk (e.g. Rhys Calder's departure without successor, departing deputy's undocumented know-how).
4. **Honest Unknowns:**
   - If a date is not recorded in the source records, it is explicitly labelled `"Date not recorded"` rather than fabricated.
   - If an owner is unassigned, it is labelled `"Owner to confirm"`.
5. **Rate-Limit Mutex & Concurrency Guard:**
   - Enforces a minimum 65-second cooldown on MCP tool calls.
   - Server-side concurrency lock prevents overlapping asynchronous requests.
   - Polling and write-back share a single server-side gate.

---

## 3. What It Does Not Do
- It does NOT fabricate return-on-investment numbers or hallucinate drone flight costs.
- It does NOT assume that an alliance framework tender guarantees call-off purchase orders.
- It does NOT convert unaccepted conditional offers into booked ARR.
- It does NOT hide missing information behind arbitrary percentage health scores.
- It does NOT expose `AQ_TOKEN` or private customer tokens to browser client scripts.

---

## 4. How AI Was Used
- **Data Engineering:** Automated schema parsing, paperwork record indexing, and fact graph extraction.
- **Full-Stack Implementation:** Authored type-safe Next.js App Router endpoints, deterministic scoring logic, and responsive dark enterprise UI.
- **Evidence Verification:** Cross-referenced every numerical statement, risk item, and next action against actual JSON-RPC snapshots to guarantee 100% provenance traceability.
