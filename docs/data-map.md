# QUESTBOARD Data Map & Provenance Registry
**Product:** QUESTBOARD — FlytBase Customer Success Intelligence CRM
**Status:** Ingested & Verified
**Date:** 14 November 2026

---

## 1. Executive Account Overview

| Metric / Dimension | Account A: Eastern Counties Police Alliance | Account B: Aldermoor Industrial Group |
|---|---|---|
| **Account Key** | `A` | `B` |
| **Official Story** | Rollout under way across 4 forces, 35 docks commissioned, 300-dock framework tender in preparation. | ROI proven (€1.2M theoretical savings). 15 plants, 14 docks installed, 13 flying. 40-plant sister company case study pending. |
| **Operational Reality** | Only 2 forces (Westmere & Metro Central) fly live operations. Tarn Valley has 0 live flights (DPIA blocked). Norwold training only. | 4 plants fly regularly. 9 log test flights only. Plant 15 has no dock. Rollout know-how trapped in departing deputy's head. |
| **Active Contract Term** | 1 March 2026 – 28 February 2027 | 1 February 2026 – 31 January 2027 |
| **Contracted Annual Value** | **£350,000 / year** (GBP) — 4 paid invoices (`contract_a`) | **€140,000 / year** (EUR) — 1 invoice to Group Security (`contract_b`) |
| **Primary Champion** | Rhys Calder (Alliance Drone Programme Lead) — *Leaving Jan 2027; no purchasing authority* | Stefan Roy (Group Head of Security) — *Historical signatory; future authority unconfirmed* |
| **Key Blocker** | Fatima Osei (DPO) / Force CFO Signatures / Missing flight cost benchmark | Undocumented rollout / Departing deputy / Group IT non-involvement |

---

## 2. Deal Intelligence & Commercial Pipeline

### Account A Deals (Eastern Counties)

| Deal ID | Deal Name | Stage | Value / Currency | Status | Blocker / Condition | Evidence Source IDs |
|---|---|---|---|---|---|---|
| `a_contract_2026` | First-Year Alliance Order (35 docks) | Closed / Won | **£350,000** (GBP) | Contracted Annual Value | None (Signed order form on file, 4 paid invoices) | `contract_a`, `calls/2026-01-13_order_call.txt` |
| `a_renewal` | Renew Alliance Contract (35 docks) | Qualified | **£350,000** (GBP) | Open Pipeline | Force-by-force dock utilization unproven; each force CFO must approve call-off | `rc_appetite_0`, `rc_appetite_2`, `km_usage_1`, `flight_log_force_month` |
| `a_tarn` | Tarn Valley & Norwold Go-Live | Qualified | **$200,000** (USD) | Open Pipeline | DPIA unsigned; FlytBase 4-month missing data-flow pack | `fo_dpia_2`, `fo_needs_3`, `pj_ticket`, `srv_dataflow`, `support_ticket_history` |
| `a_westmere` | Scale Westmere Fleet (to 30 docks) | Qualified | **£250,000** (GBP) | Open Pipeline | No drone cost/flight calculated vs Metro Central's £1,500/hr helicopter benchmark | `km_staff_2`, `eb_heli_1`, `eb_drone_2`, `eb_sign_2`, `helicopter_cost_overtime` |
| `a_tender` | 300-Dock Alliance Framework | Qualified | **£1,500,000** (GBP) | **Potential Framework Opportunity** | Potential framework opportunity. Not a purchase order. No guaranteed call-offs. Excluded from booked revenue. Draft spec lacks costed operating model. | `rc_tender_2`, `hd_weights_1`, `hd_window_2`, `draft_tender_spec`, `clarification_template` |
| `a_priority_support` | Priority Support for Drone Units | Open Offer | **$60,000** (USD) | Conditional Offer | Pitched to Insp. Karen Mbeki; unaccepted | `a_priority_support`, `profile.json` |
| `a_training` | Operator Training for New Pilots | Open Offer | **$45,000** (USD) | Conditional Offer | Pitched to Insp. Karen Mbeki; unaccepted | `a_training`, `km_staff_2` |
| `a_extra_docks` | Extra Docks for Metro Central | Declined | **$180,000** (USD) | Declined Offer | Declined by Ewan Brooks | `a_extra_docks`, `eb_sign_2` |

### Account B Deals (Aldermoor)

| Deal ID | Deal Name | Stage | Value / Currency | Status | Blocker / Condition | Evidence Source IDs |
|---|---|---|---|---|---|---|
| `b_contract_2026` | 14-Dock Platform Contract | Closed / Won | **€140,000** (EUR) | Contracted Annual Value | None (Active to 31 Jan 2027; historical order form) | `contract.txt`, `calls/2026-01-08_order_call.txt` |
| `b_renewal` | Renew Aldermoor Contract (14 docks) | Identified | **€140,000** (EUR) | Open Pipeline | Silent usage drop & unverified savings claim | `sr_roll_0`, `sr_roll_2`, `usage_collapse` |
| `b_idle` | Bring Idle Plants into Regular Patrol | Identified | *TBD / Unpriced* | Open Pipeline | Rollout know-how trapped in departing deputy's head | `sr_roll_2`, `sr_repl_2`, `b_idle` |
| `b_sister` | Case Study for 40-Plant Sister Company | Identified | *TBD / Unpriced* | Open Pipeline | Dependent on valid ROI proof and Plant 1-14 success | `sr_roi_2`, `sr_roll_2`, `flight_log_by_plant` |
| `b_more_plants` | Docks for Plant 15 & 2 Idle Plants | Open Offer | **$160,000** (USD) | Conditional Offer | Pitched to Stefan Roy; unaccepted | `b_more_plants`, `sr_roll_2` |
| `b_priority_support` | Night-Time Priority Support (Plant 7) | Open Offer | **$50,000** (USD) | Conditional Offer | Pitched to Beatriz Alonso; unaccepted | `b_priority_support`, `emails/2026-09-18_beatriz_alerts.txt` |
| *Claim* | Stefan Roy Theoretical Savings | Claim | *€1,200,000 / yr* | **Unverified Claim** | Theoretical guard hours calculation. Guard contracts NOT cut; Finance booked €0. Excluded from booked revenue. | `sr_roi_0`, `sr_roi_2`, `roi_spreadsheet.csv` |

---

## 3. Stakeholder Authority & Power Mapping

### Account A: Eastern Counties
- **Rhys Calder** (`rhys_calder`) — Alliance Drone Programme Lead:
  - *Relationship:* Ally (Leaving January 2027).
  - *Authority:* Operational coordination across 4 forces. **CANNOT commit forces financially; purchasing authority cannot be inferred from job title**.
  - *Evidence:* `rc_funding_2`, `hd_calloff_2`, `champion_leaves`.
- **Insp. Karen Mbeki** (`karen_mbeki`) — Drone Unit Inspector, Westmere:
  - *Relationship:* Warm (Active user).
  - *Authority:* Operational lead. 6 pilots under command. Urgently requesting training & dock-fail SLA before upcoming 5 Dec public event. No financial sign-off authority.
  - *Evidence:* `km_usage_1`, `km_staff_2`, `urgent_request`, `FB-11206`.
- **Fatima Osei** (`fatima_osei`) — Data Protection Officer, Tarn Valley:
  - *Relationship:* Neutral (Critical Gatekeeper/Blocker).
  - *Authority:* Sole signatory for DPIA. Without her sign-off, Tarn Valley and Norwold cannot fly live operations. Regulatory veto; no commercial purchasing authority.
  - *Evidence:* `fo_dpia_2`, `fo_needs_3`, `pj_ticket`.
- **Ewan Brooks** (`ewan_brooks`) — Finance Business Partner, Metro Central:
  - *Relationship:* Warm (Influencer).
  - *Authority:* Prepares autumn finance bids. **NOT Chief Financial Officer**; requires drone cost per flight vs Metro Central's £1,500/hr helicopter benchmark (attributed specifically to Metro Central Police; not an alliance-wide figure for all four forces) before CFO approves.
  - *Evidence:* `eb_heli_1`, `eb_drone_2`, `eb_sign_2`.
- **Hannah Doyle** (`hannah_doyle`) — Alliance Procurement Lead:
  - *Relationship:* Warm (Procurement Gatekeeper).
  - *Authority:* Drafts 300-dock framework tender specification. Confirmed 40% weighting on operating model and cost per flight. Framework tender is not a purchase order.
  - *Evidence:* `hd_weights_1`, `hd_window_2`, `clarification_template`.
- **Individual Force CFOs** (`force_cfos`) — Chief Finance Officers (Westmere, Metro Central, Tarn Valley, Norwold):
  - *Relationship:* Neutral (Signatories & Payers).
  - *Authority:* **True purchasing authority**. No pooled alliance budget exists. Each force CFO must individually approve call-offs above threshold.

### Account B: Aldermoor
- **Stefan Roy** (`stefan_roy`) — Group Head of Security:
  - *Relationship:* Ally / Programme Sponsor.
  - *Authority:* **Historical signatory on original 15 Jan 2026 order form (`contract_b`). Authority over future Aldermoor capital purchases or contract renewals is unconfirmed and cannot be inferred from job seniority**; group finance/board approval required.
  - *Evidence:* `contract.txt`, `sr_roi_0`, `sr_roi_2`.
- **Stefan Roy's Deputy** (`name_not_on_file`) — Rollout Technical Lead:
  - *Relationship:* Operational Linchpin (Leaving shortly).
  - *Authority:* Personally commissioned all flying plants. Holds all technical deployment templates. No commercial purchasing authority.
  - *Evidence:* `sr_repl_2`, `profile.json`, `calls/2026-04-23_rollout_close.txt`.
- **Beatriz Alonso** (`beatriz_alonso`) — Plant Manager, Plant 7:
  - *Relationship:* Guarded (Operational User).
  - *Authority:* Site lead. Raised unanswered ticket FB-10944 regarding night-alert routing. No commercial purchasing authority.
  - *Evidence:* `emails/2026-09-18_beatriz_alerts.txt`, `tickets.json`.
- **Owen Fitch** (`owen_fitch`) — Group IT Infrastructure Lead:
  - *Relationship:* Neutral (Technical Gatekeeper).
  - *Authority:* Network & infrastructure continuity. Currently uninvolved; risks site disconnections. No purchasing authority.
  - *Evidence:* `owen_fitch`, `profile.json`.

---

## 4. Live Event Triggers & Source Mapping (Upcoming / Action Pending)

1. **Signal `champion_leaves` (Dated: 2026-11-17) — UPCOMING TRANSITION (January 2027)**
   - *Account:* Eastern Counties (A)
   - *Source:* `A/emails/2026-11-17_rhys_moving.txt`
   - *Timestamp:* `set_off_at: "2026-11-14T09:30:38.755Z"`
   - *Classification:* **Upcoming leadership transition (Pending)**. Rhys Calder confirms departure in January 2027. No successor named. Handover planning required.

2. **Signal `urgent_request` (Dated: 2026-11-18) — UPCOMING OPERATIONAL EVENT (5 Dec 2026)**
   - *Account:* Eastern Counties (A)
   - *Source:* `A/emails/2026-11-18_karen_event.txt` & ticket `FB-11206`
   - *Timestamp:* `set_off_at: "2026-11-14T09:30:42.574Z"`
   - *Classification:* **Upcoming event dependency (Action Pending)**. Karen Mbeki policing major public event 5 December 2026. Needs written operator training dates and dock-failure escalation contact. Response is pending.

3. **Signal `usage_collapse` (Dated: 2026-11-29) — ACTIVE TELEMETRY ANOMALY REPORT (2–29 Nov 2026)**
   - *Account:* Aldermoor (B)
   - *Source:* `usage_weekly.csv` (Weeks of 2–29 Nov 2026)
   - *Timestamp:* `set_off_at: "2026-11-14T09:30:50.000Z"`
   - *Classification:* **Active usage anomaly report (Investigation Pending)**. 3 docks flying regularly dropped to 0 flights over 2 consecutive weeks while remaining online. No tickets raised. Urgent investigation required.

---

## 5. Afternoon Release Drop Accounts (Accounts K & N) — Discovery Shells

### Account K: Kestrel Estates
- **Account Key:** `K`
- **Context:** Commercial logistics and industrial estate park (represented as Drop K / unit 1 in Questathon world engine).
- **Status:** **DISCOVERY SHELL — INCOMPLETE DATA (AWAITING DROP K INGESTION)**.
- **Contract / Revenue:** £0 booked (unrecognized until paperwork is released).
- **Source Notice:** `k_shell_evidence` (`system/drop_K_notice`).
- **Honest Unknowns:** Order form, commercial SLA, dock health, and tenant airspace permissions are unrecorded on file. No manufactured data.

### Account N: Brindle Harbour Authority
- **Account Key:** `N`
- **Context:** Maritime commercial harbour and port authority (represented as Drop N / unit 2 in Questathon world engine).
- **Status:** **DISCOVERY SHELL — INCOMPLETE DATA (AWAITING DROP N INGESTION)**.
- **Contract / Revenue:** £0 booked (unrecognized until paperwork is released).
- **Source Notice:** `n_shell_evidence` (`system/drop_N_notice`).
- **Honest Unknowns:** Maritime port contract, coastal dock telemetry, CAA over-water permissions, and port board budget threshold are unrecorded on file. No manufactured data.
