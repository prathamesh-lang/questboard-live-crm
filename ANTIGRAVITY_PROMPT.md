# Antigravity implementation brief — Questboard

You are implementing the Questathon live CRM in this repository. Work from the real MCP snapshots in `data/`; do not invent data, people, IDs, values, dates, relationships, or outcomes.

## Hard requirements

1. Read `README.md`, `docs/thinking-doc.md`, all JSON files in `data/`, and the supplied Questathon build brief before changing code.
2. Never read, print, log, expose, or commit `.env.local`. The MCP token must remain in the server environment as `AQ_TOKEN`; never use `NEXT_PUBLIC_AQ_TOKEN`.
3. The token permits one MCP call per minute, including writes. Respect that limit. The initial ingestion script already spaces calls by 61 seconds. Live `get_signals` polling must be at least 65 seconds. Do not make parallel MCP calls.
4. Keep account snapshots and paperwork in `data/`. Do not repeatedly refetch the same static material. New events come from `get_signals`; notes are written with `write_note`.
5. The app must answer all five questions for BOTH accounts:
   - What is the book worth?
   - Who holds the power? (decision-maker, payer, user, blocker, relationship state)
   - What do we do first? (three ranked moves, each with owner, actual due date, linked deal)
   - What is about to go wrong? (deadline, silent usage change, stuck deal, stakeholder change)
   - What do we still not know? (gap, why it matters, who can answer)
6. Every displayed number must have a visible, clickable or inspectable source ID from the actual MCP data. If no record ID supports a number, do not present it as fact. Put unsupported champion claims in a clearly labelled `Unverified / projected` section.
7. Never convert projected savings into realised savings. Never infer that a framework award guarantees orders. Never infer a person can sign for a force unless the source explicitly says so.
8. For actions, use only dates in source data or live signals. If no due date is present, say `Date not recorded`; do not invent one. Rank by explicit deadlines, blocker severity and deal impact. Every move has an owner and deal link; if owner is not confirmed, say `Owner to confirm`.
9. Include an evidence drawer that shows the exact record text and source ID. Every risk, deal value and key assertion should link to its evidence.
10. Display the new live signals and show when they were last checked. At minimum, make the app poll `get_signals` at 65-second intervals without overlapping calls. De-duplicate signal items by real signal ID. New items must appear without a code change.
11. Provide a safe `write_note` interface for next steps, risks and notes. Validate input, show success/failure, and obey the one-call-per-minute token limit.
12. Make the UI manager-ready: clean dark enterprise design, responsive desktop/mobile, clear account switcher, strong hierarchy, no fake charts or decorative metrics.

## Suggested structure

- `data/accounts.json`: source-of-truth account, people, deals, offers, deadlines.
- `data/paperwork-A.json`, `data/paperwork-B.json`: account source documents.
- `data/signals.json`: initial live event snapshot. Refresh via `get_signals`.
- `lib/`: typed parsing, source registry, evidence helpers, decision rules.
- `app/api/`: server-only MCP routes.
- `components/`: account overview, deal pipeline, stakeholder map, ranked actions, risk radar, unknowns, evidence drawer, signal feed.

## Data-mapping work

First inspect the real JSON shape and create TypeScript types for the returned structures. Build a normalized view model that retains the original source ID and source text for every item. Do not write brittle assumptions based on guessed paths. If source records don't provide a value/date/owner/decision role, surface that gap.

The five question panels should have specific account-level answers, not generic placeholder text. Use concise narrative plus evidence links. The default landing page should show a cross-account command center with the top three actions and top risks, and then allow drilling into each account.

## Specific known context to validate against MCP (not as a substitute for MCP evidence)

The discovery conversation established the following leads, but only use a lead as a factual CRM assertion if you can map it to a real MCP source record:

- Eastern Counties: Fatima Osei accepted a dated delivery plan for a data-flow pack; the pack is not yet delivered. SRV committed to produce flows, retention, video storage location and access controls within one week. The CSM owns chasing and handover. The original support ticket sat unassigned for four months. Rhys Calder said he leaves the programme in January and no successor was named in the live event signal.
- Eastern Counties: the Westmere event is on 5 December. Karen Mbeki requested, in writing and during the week of the 18 November signal, training dates for additional operators and the named day-of-event dock-failure responder. The account signal says no one has replied.
- Eastern Counties: each force funds purchases from its own budget and its own CFO signs each call-off. Rhys cannot commit all four forces. Hannah Doyle owns the public 300-dock framework specification. The tender draft has no costed operating model. Cost per flight and operating model comprise 40% of evaluation; comparator is the existing helicopter contract. The official process uses a written clarification template and formal supplier briefing window.
- Eastern Counties: live missions in Westmere and Metro Central; Tarn Valley had not flown a live mission; Norwold was training only at discovery time. Validate with current MCP data/signals before display.
- Aldermoor: Stefan Roy's €1.2m annual savings figure is a projection from his own spreadsheet based on guard hours drones could replace. No guard contract was reduced and Finance had not booked any of it. Do not display as realised ROI.
- Aldermoor: Stefan reported 13 of 15 sites had flight activity, but only four flew regularly and nine mostly recorded test flights; Plant 15 had no dock at that point. A later signal says three docks that usually flew most nights had no flights during the last two weeks while staying online, and no ticket/customer explanation existed.
- Aldermoor: Stefan's deputy set up every plant that flies, held the rollout knowledge mostly in his head, and was leaving shortly; no process documentation existed. Installers handled technical installs; Group IT (Owen Fitch) was not involved.
- Aldermoor: Ewan Brooks gave a helicopter benchmark around £1,500/hour including crew. Drone overtime was not separately tracked; Payroll held overtime records and needed Ewan's sign-off. Ewan said his Finance Director needs a cost-per-flight comparison against helicopter hours before considering a call-off. His helicopter/overtime export duplicates monthly entries; Ewan said to trust the second entry each month. His budget bid window is the autumn round and closes soon (confirm dates only if present in source records).

Do not copy this context into the UI without source IDs. Use it as a checklist when searching the fetched records.

## Deliverables after implementation

- Working local Next.js app (`npm run dev`).
- Production build passes (`npm run build`).
- README with exact run instructions, no token.
- One-page thinking doc updated to match implemented rules.
- Clear deployment checklist for hosted app with `AQ_TOKEN` configured server-side.
- Do not claim hosted/repository/docs/video links are done unless they actually exist and have been verified.
