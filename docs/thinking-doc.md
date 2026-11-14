# Questboard — product thinking document

## What it does and for whom
Questboard is a manager-facing customer-success intelligence CRM for two live accounts. It is designed for a CSM taking over complex accounts with multiple decision-makers, payers, users, blockers and evidence records. It turns account data and paperwork into five Monday-ready answers: book value, decision power, next moves, risk and unknowns.

## How it decides: rules
1. Only treat a deal value as substantiated when a deal record or documentary source supports it. Keep champion estimates and projected savings in a separate unverified section.
2. For each deal, distinguish decision-maker, payer, user, blocker and relationship status. Never infer that one stakeholder can approve another force's purchase.
3. Rank next actions by explicit deadlines, blocker severity and deal impact. Every action must have an owner, due date and linked deal. If no date or owner is in the data, mark it unknown rather than inventing one.
4. Risk comes from recorded deadlines, missing deliverables, negative usage signals, unassigned support tickets and stakeholder departures. An event is not downgraded merely because the overall account relationship is positive.
5. Unknowns are first-class records: state what is missing, why it matters and who can supply it.
6. Every numerical claim must show the source record ID. If there is no source ID, suppress the number or label it unverified and show the underlying claim.
7. `get_signals` is polled no more than once per minute. The initial account and paperwork snapshots are stored locally and checked against new signals.
8. Notes are written back only through the explicit `write_note` action and are labelled as tasks, risks, notes or next steps.

## What it does not do yet
It does not calculate savings from incomplete overtime records, assume projected ROI is realised, infer procurement authority, predict tender outcomes, or automatically close a deal. It does not replace finance, legal, privacy or procurement review. It does not invent source identifiers or use unsupported dates.

## How AI was used
AI assisted with requirements decomposition, interface scaffolding, evidence/provenance rules, action prioritisation and implementation review. Human review is required for the final data mapping, every financial calculation, each source reference and all submitted content.
