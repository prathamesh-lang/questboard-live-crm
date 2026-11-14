import { AccountQuestions, EvidenceRecord, SignalItem } from "../types";

export const evidenceRegistry: Record<string, EvidenceRecord> = {
  // CONTRACTS
  "contract_a": {
    id: "contract_a",
    title: "Order Form Summary — Eastern Counties Police Alliance (Contracted Annual Value)",
    type: "DIRECT",
    account: "A",
    path: "A/contract.txt",
    timestamp: "2026-01-20",
    excerpt: "Customer: Eastern Counties Police Alliance, alliance office, for its member forces. Signed: 20 January 2026, by the alliance office. Currency: pounds sterling. Price and term: £350,000 a year (Contracted Annual Value). Term: 1 March 2026 to 28 February 2027. All four invoices for the first year are paid."
  },
  "contract_b": {
    id: "contract_b",
    title: "Order Form Summary — Aldermoor Industrial Group (Contracted Annual Value)",
    type: "DIRECT",
    account: "B",
    path: "B/contract.txt",
    timestamp: "2026-01-15",
    excerpt: "Customer: Aldermoor Industrial Group, group security. Signed: 15 January 2026, by Stefan Roy, group head of security. Currency: euros. Price and term: €140,000 a year (Contracted Annual Value). Term: 1 February 2026 to 31 January 2027. One invoice a year, to group security. Note: Stefan Roy's signature applies specifically to this historical 2026 order form; authority over future purchases is not established by this document."
  },

  // SIGNALS (LIVE / UPCOMING EVENTS)
  "champion_leaves": {
    id: "champion_leaves",
    title: "Eastern Counties: Rhys Calder is moving on (Upcoming Transition — Jan 2027)",
    type: "DIRECT",
    account: "A",
    path: "A/emails/2026-11-17_rhys_moving.txt",
    timestamp: "2026-11-17",
    excerpt: "Upcoming leadership transition: Rhys Calder emailed stating he leaves the drone programme in January 2027: 'I am moving to another role in the new year and will hand over the drone programme in January. My successor has not been named yet. Anything we have agreed stands. Until January, keep sending things to the programme office.' (Status: Upcoming event; handover pending)."
  },
  "urgent_request": {
    id: "urgent_request",
    title: "Eastern Counties: Westmere needs an answer before a public event (Upcoming Event — 5 Dec 2026)",
    type: "DIRECT",
    account: "A",
    path: "A/emails/2026-11-18_karen_event.txt",
    timestamp: "2026-11-18",
    excerpt: "Upcoming event dependency: Insp. Karen Mbeki logged ticket FB-11206 ahead of a major public event on 5 December 2026: 'We are policing a large public event on Saturday 5 December... I need two things settled in writing this week: 1. Operators: how many more of my officers can be trained before the day, and when. 2. Cover on the day: if a dock fails, who do I call and how fast does anyone answer. Nobody has replied.' (Status: Upcoming event; response pending)."
  },
  "usage_collapse": {
    id: "usage_collapse",
    title: "Aldermoor: Silent usage collapse across three docks (Telemetry Report — 2–29 Nov 2026)",
    type: "DIRECT",
    account: "B",
    path: "B/usage_weekly.csv",
    timestamp: "2026-11-29",
    excerpt: "Weekly telemetry report for 2 to 29 November 2026 indicates three docks that normally fly most nights flew nothing in the last two weeks, yet remained online. No ticket raised, no customer explanation. Silent usage anomaly requiring active investigation (Status: Active anomaly; investigation pending)."
  },

  // ACCOUNT A EVIDENCE
  "rc_appetite_0": {
    id: "rc_appetite_0",
    title: "Alliance Programme Appetite",
    type: "DIRECT",
    account: "A",
    excerpt: "All four forces are keen on expanding the drone programme according to programme lead Rhys Calder."
  },
  "rc_appetite_2": {
    id: "rc_appetite_2",
    title: "Operational Disparity Across Forces",
    type: "DIRECT",
    account: "A",
    excerpt: "Only Westmere and Metro Central fly operationally. Tarn Valley has never flown a live mission and Norwold only trains."
  },
  "rc_funding_2": {
    id: "rc_funding_2",
    title: "Decentralized Force Budgets",
    type: "DIRECT",
    account: "A",
    excerpt: "There is no pooled budget. Each force funds from its own budget and each chief finance officer must approve a call-off."
  },
  "hd_calloff_2": {
    id: "hd_calloff_2",
    title: "Individual Force Call-off Authority",
    type: "DIRECT",
    account: "A",
    excerpt: "A force's call-off needs its own finance sign-off. The alliance cannot commit them."
  },
  "km_usage_1": {
    id: "km_usage_1",
    title: "Westmere Active Dock Utilization",
    type: "DIRECT",
    account: "A",
    path: "A/files/flight_log_force_month.csv",
    excerpt: "14 of 18 docks flew last month, mostly patrol support and missing-person searches."
  },
  "km_staff_2": {
    id: "km_staff_2",
    title: "Westmere Staffing & Overtime Constraints",
    type: "DIRECT",
    account: "A",
    excerpt: "Six officers who also do other duties. Overtime is the main cost. Scaling to 30 docks needs nine more trained operators and shift cover."
  },
  "km_others_2": {
    id: "km_others_2",
    title: "Tarn Valley & Norwold Blocker Summary",
    type: "DIRECT",
    account: "A",
    excerpt: "Tarn Valley's data protection officer has not signed off. Norwold's chief constable is cautious after a local privacy row."
  },
  "fo_dpia_2": {
    id: "fo_dpia_2",
    title: "Tarn Valley DPIA Blocker",
    type: "DIRECT",
    account: "A",
    path: "A/profile.json",
    excerpt: "DPIA cannot be signed until we receive the data-flow documents asked from FlytBase support four months ago. Nobody replied."
  },
  "fo_needs_3": {
    id: "fo_needs_3",
    title: "Fatima Osei Privacy Requirements",
    type: "DIRECT",
    account: "A",
    excerpt: "With data flows, retention periods, video storage location and access controls I can finish in three weeks. Norwold is waiting to copy my assessment."
  },
  "pj_ticket": {
    id: "pj_ticket",
    title: "Unassigned Tarn Valley Ticket FB-10412",
    type: "DIRECT",
    account: "A",
    path: "A/tickets.json",
    timestamp: "2026-07-14",
    excerpt: "The Tarn Valley ticket asking for data-flow documents was logged four months ago and never answered. It sits in the support queue unassigned."
  },
  "srv_dataflow": {
    id: "srv_dataflow",
    title: "Engineering Commitment on Privacy Pack",
    type: "DIRECT",
    account: "A",
    excerpt: "Engineering can produce the data-flow pack (flows, retention, video storage location, access controls) in a week, with the CSM owning the ask: sending it, chasing it, answering the DPO."
  },
  "eb_heli_1": {
    id: "eb_heli_1",
    title: "Metro Central Helicopter Benchmark (Force-Specific)",
    type: "DIRECT",
    account: "A",
    path: "A/files/helicopter_cost_overtime.csv",
    excerpt: "A helicopter hour costs Metro Central about £1,500 all-in. (Attributed specifically to Metro Central Police; not an alliance-wide figure for all four forces)."
  },
  "eb_drone_2": {
    id: "eb_drone_2",
    title: "Missing Drone Flight Cost Data",
    type: "DIRECT",
    account: "A",
    excerpt: "He has no comparable drone figure because overtime for drone operators is not tracked separately. He could pull it in a week."
  },
  "eb_sign_2": {
    id: "eb_sign_2",
    title: "CFO Call-off Prerequisite",
    type: "DIRECT",
    account: "A",
    excerpt: "His chief finance officer will sign a call-off only with a cost per flight set against helicopter hours."
  },
  "eb_window_2": {
    id: "eb_window_2",
    title: "Metro Central Autumn Finance Window",
    type: "DIRECT",
    account: "A",
    excerpt: "Metro Central bids in the autumn finance round. That window closes soon. Ewan can only bid for more docks if his blocker is cleared by then."
  },
  "rc_tender_2": {
    id: "rc_tender_2",
    title: "300-Dock Framework Specification Risk",
    type: "DIRECT",
    account: "A",
    path: "A/files/draft_tender_spec.csv",
    excerpt: "The tender specification locks soon. It has no costed operating model, and nobody has agreed who would fly 300 docks. Note: Potential framework opportunity; not a purchase order; no guaranteed call-offs."
  },
  "hd_weights_1": {
    id: "hd_weights_1",
    title: "Tender Evaluation Criteria Weighting",
    type: "DIRECT",
    account: "A",
    excerpt: "Evaluation weights cost per flight and the operating model at 40%. The comparator is the current helicopter air support contract."
  },
  "hd_window_2": {
    id: "hd_window_2",
    title: "Procurement Clarification Window",
    type: "DIRECT",
    account: "A",
    path: "A/files/clarification_template.csv",
    excerpt: "Suppliers may brief the specification team only in a formal window that opens shortly. She would accept a written clarification request with specific questions."
  },

  // ACCOUNT B EVIDENCE
  "sr_roi_0": {
    id: "sr_roi_0",
    title: "Stefan Roy Stated Savings Claim",
    type: "UNVERIFIED",
    account: "B",
    path: "B/files/roi_spreadsheet.csv",
    excerpt: "ROI is proven, about 1.2 million euros a year saved."
  },
  "sr_roi_2": {
    id: "sr_roi_2",
    title: "Unrealized Theoretical Guard Savings",
    type: "DIRECT",
    account: "B",
    excerpt: "The figure is his own spreadsheet of guard patrol hours the drones could replace. No guard contract has been reduced and finance has booked no saving."
  },
  "sr_roll_0": {
    id: "sr_roll_0",
    title: "Stefan Roy Stated Plant Status",
    type: "UNVERIFIED",
    account: "B",
    excerpt: "Thirteen of fifteen plants are flying."
  },
  "sr_roll_2": {
    id: "sr_roll_2",
    title: "Actual Plant Activity Breakdown",
    type: "DIRECT",
    account: "B",
    path: "B/files/flight_log_by_plant.csv",
    excerpt: "Four plants fly regularly. Nine only log test flights. Plant 15 has no dock."
  },
  "sr_repl_2": {
    id: "sr_repl_2",
    title: "Single Point of Rollout Knowledge",
    type: "DIRECT",
    account: "B",
    path: "B/profile.json",
    excerpt: "The rollout template lives mostly in his deputy's head. The deputy leaves soon, and nothing is written down."
  },
  "b_idle": {
    id: "b_idle",
    title: "Idle Plants Rollout Know-how Window",
    type: "DIRECT",
    account: "B",
    excerpt: "Stefan's deputy leaves, and the rollout know-how with him unless it is written down first (56 moves remaining)."
  },
  "owen_fitch": {
    id: "owen_fitch",
    title: "Group IT Infrastructure Lead Unengaged",
    type: "DIRECT",
    account: "B",
    path: "B/profile.json",
    excerpt: "Owen Fitch leads Group IT infrastructure. Never on a call with FlytBase. External installers did original work; ongoing network and firewall maintenance unowned."
  },
  "beatriz_alerts": {
    id: "beatriz_alerts",
    title: "Plant 7 Night-Alert Routing Concern",
    type: "DIRECT",
    account: "B",
    path: "B/emails/2026-09-18_beatriz_alerts.txt",
    timestamp: "2026-09-18",
    excerpt: "Beatriz Alonso (Plant 7 Manager) logged ticket FB-10944: 'Can the night alerts from our dock go to more than one person? Please tell me how to change it.' Closed with settings guide; operational protocol remains unresolved."
  },
  "k_shell_evidence": {
    id: "k_shell_evidence",
    title: "Kestrel Estates — Discovery Shell Notice (Drop K)",
    type: "DIRECT",
    account: "K",
    path: "system/drop_K_notice",
    timestamp: "2026-11-14",
    excerpt: "Kestrel Estates scheduled for afternoon Drop K release in Questathon game engine (unit 1 / estate floor). Underlying contracts, stakeholder roster, and dock telemetry pending MCP get_new_account('K') ingestion. Unverified in initial morning export."
  },
  "n_shell_evidence": {
    id: "n_shell_evidence",
    title: "Brindle Harbour Authority — Discovery Shell Notice (Drop N)",
    type: "DIRECT",
    account: "N",
    path: "system/drop_N_notice",
    timestamp: "2026-11-14",
    excerpt: "Brindle Harbour Authority scheduled for afternoon Drop N release in Questathon game engine (unit 2 / shop & maritime floor). Underlying port contracts, safety compliance, and dock logs pending MCP get_new_account('N') ingestion. Unverified in initial morning export."
  }
};

export const accountAQuestions: AccountQuestions = {
  accountKey: "A",
  accountName: "Eastern Counties Police Alliance",
  officialStory: "Rollout under way across 4 forces, 35 docks commissioned, 300-dock framework tender in preparation.",
  operationalReality: "Only 2 forces (Westmere & Metro Central) fly operational missions. Tarn Valley has never flown a live mission (DPIA blocked). Norwold only trains. Programme lead Rhys Calder leaving in January 2027.",
  contractTerm: "1 March 2026 – 28 February 2027",
  bookedCurrency: "GBP",

  bookValue: {
    bookedDeals: [
      {
        id: "a_contract_2026",
        name: "Alliance First-Year Order (35 Docks) — Contracted Annual Value",
        amount: 350000,
        currency: "GBP",
        stage: "Closed Won",
        valueStatus: "booked",
        blocker: null,
        evidenceIds: ["contract_a"],
        notes: "Signed 20 Jan 2026. Term: 1 Mar 2026 – 28 Feb 2027. All 4 invoices paid. Classified as Contracted Annual Value."
      }
    ],
    pipelineDeals: [
      {
        id: "a_renewal",
        name: "Renew the Alliance Contract (35 Docks)",
        amount: 350000,
        currency: "GBP",
        stage: "Qualified",
        valueStatus: "pipeline",
        blocker: "Nobody can show which forces actually use the docks",
        evidenceIds: ["rc_appetite_0", "rc_appetite_2", "km_usage_1", "contract_a"],
        notes: "Annual renewal requires separate call-off approvals from all 4 member forces."
      },
      {
        id: "a_tarn",
        name: "Tarn Valley and Norwold Go Live",
        amount: 200000,
        currency: "USD",
        stage: "Qualified",
        valueStatus: "pipeline",
        blocker: "The DPIA cannot be signed without data-flow documents FlytBase never sent",
        evidenceIds: ["fo_dpia_2", "fo_needs_3", "pj_ticket", "srv_dataflow"],
        notes: "Engineering committed to 1-week pack production; CSM must chase and deliver."
      },
      {
        id: "a_westmere",
        name: "Scale Westmere's Fleet (to 30 Docks)",
        amount: 250000,
        currency: "GBP",
        stage: "Qualified",
        valueStatus: "pipeline",
        blocker: "No cost per flight calculated against Metro Central helicopter hours (£1,500/hr, force-specific; not generalized alliance-wide)",
        evidenceIds: ["km_staff_2", "eb_heli_1", "eb_drone_2", "eb_sign_2"],
        notes: "Dependent on Metro Central Autumn Finance Round submission before window closes."
      }
    ],
    conditionalOffers: [
      {
        id: "a_priority_support",
        name: "Priority Support for the Drone Units",
        amount: 60000,
        currency: "USD",
        stage: "Open Offer",
        valueStatus: "conditional",
        blocker: "Conditional offer pitched to Insp. Karen Mbeki; unaccepted",
        evidenceIds: ["a_priority_support", "urgent_request"],
        notes: "Tied to Westmere SLA and event-day coverage needs."
      },
      {
        id: "a_training",
        name: "Operator Training for New Pilots",
        amount: 45000,
        currency: "USD",
        stage: "Open Offer",
        valueStatus: "conditional",
        blocker: "Conditional offer pitched to Insp. Karen Mbeki; unaccepted",
        evidenceIds: ["a_training", "km_staff_2"],
        notes: "Westmere needs 9 additional pilots for 30-dock fleet scaling."
      },
      {
        id: "a_extra_docks",
        name: "Extra Docks for Metro Central",
        amount: 180000,
        currency: "USD",
        stage: "Declined",
        valueStatus: "declined",
        blocker: "Declined by Ewan Brooks due to lack of comparative ROI",
        evidenceIds: ["eb_sign_2"],
        notes: "Declined offer; excluded from active pipeline."
      }
    ],
    unverifiedClaims: [
      {
        id: "a_tender",
        name: "300-Dock Framework Tender (Potential Framework Opportunity)",
        amount: 1500000,
        currency: "GBP",
        stage: "Tender Spec",
        valueStatus: "unverified",
        blocker: "Potential framework opportunity. Not a purchase order. No guaranteed call-offs. Specification lacks costed operating model.",
        evidenceIds: ["rc_tender_2", "hd_weights_1", "hd_window_2"],
        notes: "Potential framework opportunity. Not a purchase order. No guaranteed call-offs. Excluded from booked revenue. Member forces must fund call-offs individually."
      }
    ],
    bookedTotal: { amount: 350000, currency: "GBP" },
    pipelineTotals: {
      GBP: 600000, // a_renewal (£350k) + a_westmere (£250k) [excluding unverified tender £1.5M]
      USD: 200000  // a_tarn ($200k) [excluding conditional unaccepted offers]
    }
  },

  powerMap: [
    {
      id: "rhys_calder",
      name: "Rhys Calder",
      role: "Alliance Drone Programme Lead",
      organization: "Programme Office",
      relationship: "ally",
      authorityType: "Champion",
      financialAuthority: false,
      notes: "Coordinates 4 forces. CANNOT commit member forces financially; purchasing authority cannot be inferred from programme leadership. Confirmed departure in January 2027; no successor named.",
      evidenceIds: ["rc_funding_2", "champion_leaves"]
    },
    {
      id: "karen_mbeki",
      name: "Insp. Karen Mbeki",
      role: "Drone Unit Inspector",
      organization: "Westmere Police",
      relationship: "warm",
      authorityType: "Operational User",
      financialAuthority: false,
      notes: "Flies 14 of 18 docks. Commanding officer for live operations. Has critical urgent dependency for upcoming 5 Dec public event. No financial sign-off authority.",
      evidenceIds: ["km_usage_1", "km_staff_2", "urgent_request"]
    },
    {
      id: "fatima_osei",
      name: "Fatima Osei",
      role: "Data Protection Officer",
      organization: "Tarn Valley Police",
      relationship: "neutral",
      authorityType: "Blocker",
      financialAuthority: false,
      notes: "Sole gatekeeper for DPIA sign-off. Blocked live operations for 4 months due to unanswered FlytBase privacy request. Norwold follows her lead. Regulatory veto; no commercial purchasing authority.",
      evidenceIds: ["fo_dpia_2", "fo_needs_3", "pj_ticket", "srv_dataflow"]
    },
    {
      id: "ewan_brooks",
      name: "Ewan Brooks",
      role: "Finance Business Partner",
      organization: "Metro Central Police",
      relationship: "warm",
      authorityType: "Payer",
      financialAuthority: false,
      notes: "Finance Business Partner (NOT CFO). Submits autumn budget bids. Requires flight cost vs Metro Central £1,500/hr helicopter benchmark (attributed specifically to Metro Central, not generalized to all four forces) before CFO signs.",
      evidenceIds: ["eb_heli_1", "eb_drone_2", "eb_sign_2", "eb_window_2"]
    },
    {
      id: "hannah_doyle",
      name: "Hannah Doyle",
      role: "Alliance Procurement Lead",
      organization: "Procurement Directorate",
      relationship: "warm",
      authorityType: "Decision-Maker",
      financialAuthority: false,
      notes: "Owns 300-dock framework specification. Confirmed 40% weighting on operating model and flight economics. Issued formal clarification template. Framework award is not a purchase order.",
      evidenceIds: ["hd_weights_1", "hd_window_2", "hd_calloff_2"]
    },
    {
      id: "force_cfos",
      name: "Individual Force CFOs (4)",
      role: "Chief Finance Officers",
      organization: "Westmere, Metro Central, Tarn Valley, Norwold",
      relationship: "neutral",
      authorityType: "Signatory",
      financialAuthority: true,
      notes: "True purchasing authority. No pooled alliance budget exists. Each force CFO must individually approve call-offs above threshold. Authority is legally held by each force CFO.",
      evidenceIds: ["rc_funding_2", "eb_sign_2", "hd_calloff_2"]
    }
  ],

  nextMoves: [
    {
      rank: 1,
      title: "Confirm operator training dates & named dock-failure escalation contact to Insp. Mbeki",
      priority: "URGENT",
      owner: "CSM / Solutions Support",
      dueDate: "This week (Upcoming Event: 5 Dec 2026)",
      relatedDeal: "a_westmere / a_priority_support",
      reason: "Karen Mbeki policing major public event 5 Dec; logged ticket FB-11206 and emailed directly; unresolved request risks mission failure and operational trust.",
      evidenceId: "urgent_request"
    },
    {
      rank: 2,
      title: "Establish succession plan & handover governance with Rhys Calder and Board",
      priority: "HIGH",
      owner: "CSM to confirm with Rhys / Programme Board",
      dueDate: "January 2027 (Upcoming Transition)",
      relatedDeal: "a_renewal / a_tender",
      reason: "Rhys Calder announced departure in January with no successor named. As the sole alliance relationship holder, his exit endangers the £350k renewal and 300-dock tender.",
      evidenceId: "champion_leaves"
    },
    {
      rank: 3,
      title: "Chase Engineering & personally deliver GDPR/DPIA Data-Flow Pack to Fatima Osei",
      priority: "HIGH",
      owner: "CSM",
      dueDate: "Within 1 week (Engineering commitment)",
      relatedDeal: "a_tarn",
      reason: "Fatima Osei's DPIA has blocked Tarn Valley and Norwold ($200k) for 4 months due to unassigned ticket FB-10412. Engineering promised pack in 1 week; Fatima commits to 3-week review once received.",
      evidenceId: "srv_dataflow"
    }
  ],

  riskRadar: [
    {
      id: "r_rhys_exit",
      title: "Alliance Leadership Transition Crisis (Upcoming Jan 2027)",
      severity: "CRITICAL",
      explanation: "Upcoming leadership transition: Rhys Calder is leaving the programme in January 2027. No successor has been identified. Every historical call has been with him alone; alliance continuity is at acute risk.",
      owner: "CSM to confirm with Programme Board",
      actionRequired: "Meet with Rhys immediately to define handover protocol and board stakeholder introductions.",
      evidenceId: "champion_leaves"
    },
    {
      id: "r_mbeki_event",
      title: "Unanswered Westmere Event Dependency (Upcoming 5 Dec 2026)",
      severity: "CRITICAL",
      explanation: "Upcoming event dependency: Insp. Karen Mbeki logged urgent ticket FB-11206 and emailed requesting written pilot training dates and a named contact for dock failures. Nobody has responded.",
      owner: "CSM / Support Desk Lead",
      actionRequired: "Issue written confirmation of training schedule and assign named on-call engineer for 5 Dec.",
      evidenceId: "urgent_request"
    },
    {
      id: "r_fatima_dpia",
      title: "4-Month DPIA Freeze for Tarn Valley & Norwold",
      severity: "HIGH",
      explanation: "Ticket FB-10412 sat unassigned for 4 months. DPO Fatima Osei will not sign off live flights without data flows, retention periods, storage locations, and access controls.",
      owner: "CSM / SRV (Director of Eng)",
      actionRequired: "Obtain Engineering's data-flow pack and hand-deliver to Fatima Osei with an executive apology.",
      evidenceId: "fo_dpia_2"
    },
    {
      id: "r_metro_bid",
      title: "Metro Central Autumn Finance Bid Window Closing",
      severity: "HIGH",
      explanation: "Ewan Brooks can only submit capital bids for fleet scaling during the autumn finance round. Without drone flight cost benchmarked to Metro Central's £1,500/hr helicopter baseline (force-specific to Metro Central), CFO will reject call-off.",
      owner: "CSM / FlytBase Finance Analyst",
      actionRequired: "Co-author drone flight cost model with Ewan Brooks before finance window closes.",
      evidenceId: "eb_window_2"
    },
    {
      id: "r_tender_spec",
      title: "300-Dock Framework Specification Lockout",
      severity: "MEDIUM",
      explanation: "Framework tender spec locks shortly. Operating model and flight economics carry 40% evaluation weighting, yet the draft contains zero cost modeling. Note: Framework award is not a purchase order.",
      owner: "CSM / Tender Capture Team",
      actionRequired: "Submit formal numbered clarification request using Hannah Doyle's official template.",
      evidenceId: "rc_tender_2"
    }
  ],

  unknownGaps: [
    {
      id: "u_rhys_successor",
      gap: "Who will replace Rhys Calder as Alliance Drone Programme Lead?",
      whyItMatters: "Governs programme coordination, board alignment, and framework renewal sponsorship across all 4 forces.",
      whoCanAnswer: "Rhys Calder / Alliance Programme Board",
      affectedDeal: "a_renewal & a_tender",
      evidenceId: "champion_leaves"
    },
    {
      id: "u_bid_deadline",
      gap: "What is the exact calendar date the Metro Central autumn finance bid window closes?",
      whyItMatters: "Defines the hard deadline to deliver drone vs helicopter flight economics before 2027 capital budget locks.",
      whoCanAnswer: "Ewan Brooks (Finance Business Partner)",
      affectedDeal: "a_westmere",
      evidenceId: "eb_window_2"
    },
    {
      id: "u_drone_flight_cost",
      gap: "What is the verified cost per drone flight including operator shift overtime?",
      whyItMatters: "Metro Central CFO will not review or approve call-offs without cost per flight benchmarked against Metro Central's £1,500/hr helicopter benchmark (force-specific to Metro Central; not alliance-wide).",
      whoCanAnswer: "Ewan Brooks (Payroll Overtime records) & FlytBase Commercial Finance",
      affectedDeal: "a_westmere",
      evidenceId: "eb_sign_2"
    },
    {
      id: "u_dataflow_status",
      gap: "Has FlytBase Engineering completed storage location & access control sections of the privacy pack?",
      whyItMatters: "Required to unblock Fatima Osei's 3-week DPIA sign-off for Tarn Valley and Norwold ($200,000 contract value).",
      whoCanAnswer: "SRV (Director of Engineering)",
      affectedDeal: "a_tarn",
      evidenceId: "srv_dataflow"
    },
    {
      id: "u_dock_utilization",
      gap: "What is the exact flight and dock utilization breakdown across the four member forces?",
      whyItMatters: "Each force CFO requires proof of local operational value before signing individual call-off renewals.",
      whoCanAnswer: "FlytBase Flight Telemetry Logs / Karen Mbeki",
      affectedDeal: "a_renewal",
      evidenceId: "km_usage_1"
    }
  ]
};

export const accountBQuestions: AccountQuestions = {
  accountKey: "B",
  accountName: "Aldermoor Industrial Group",
  officialStory: "ROI proven (€1.2M theoretical savings). 15 plants, 14 docks installed, 13 flying. Case study for 40-plant sister company in preparation.",
  operationalReality: "Only 4 plants fly regularly. 9 log test flights only. Plant 15 has no dock. Stefan's deputy set up all flying plants and is leaving shortly with undocumented rollout know-how. Silence anomaly on 3 docks.",
  contractTerm: "1 February 2026 – 31 January 2027",
  bookedCurrency: "EUR",

  bookValue: {
    bookedDeals: [
      {
        id: "b_contract_2026",
        name: "Aldermoor Initial Platform Contract (14 Docks) — Contracted Annual Value",
        amount: 140000,
        currency: "EUR",
        stage: "Closed Won",
        valueStatus: "booked",
        blocker: null,
        evidenceIds: ["contract_b"],
        notes: "Signed 15 Jan 2026 by Stefan Roy. Term: 1 Feb 2026 – 31 Jan 2027. One invoice paid to group security. Classified as Contracted Annual Value."
      }
    ],
    pipelineDeals: [
      {
        id: "b_renewal",
        name: "Renew the Aldermoor Contract (14 Docks)",
        amount: 140000,
        currency: "EUR",
        stage: "Identified",
        valueStatus: "pipeline",
        blocker: "Silent usage drop on 3 docks; unverified €1.2M savings claim unbacked by finance",
        evidenceIds: ["sr_roll_0", "sr_roll_2", "usage_collapse", "contract_b"],
        notes: "Term ends 31 Jan 2027. Contract contains no automatic renewal clause."
      },
      {
        id: "b_idle",
        name: "Bring Idle Plants into Regular Patrol",
        amount: null,
        currency: "EUR",
        stage: "Identified",
        valueStatus: "pipeline",
        blocker: "Rollout know-how lives exclusively in departing deputy's head",
        evidenceIds: ["sr_roll_2", "sr_repl_2", "b_idle"],
        notes: "Scope covers activating 9 test-flight plants into nightly operational patrol."
      },
      {
        id: "b_sister",
        name: "Case Study for 40-Plant Sister Company",
        amount: null,
        currency: "EUR",
        stage: "Identified",
        valueStatus: "pipeline",
        blocker: "Requires validated, finance-backed ROI proof and stable Plant 1-14 operations",
        evidenceIds: ["sr_roi_2", "sr_roll_2"],
        notes: "Massive strategic opportunity dependent on fixing Aldermoor adoption first."
      }
    ],
    conditionalOffers: [
      {
        id: "b_more_plants",
        name: "Docks for Plant 15 and Two Idle Plants",
        amount: 160000,
        currency: "USD",
        stage: "Open Offer",
        valueStatus: "conditional",
        blocker: "Conditional offer pitched to Stefan Roy; unaccepted",
        evidenceIds: ["sr_roll_2"],
        notes: "Pitched to Stefan Roy; unaccepted pending resolution of deputy transition."
      },
      {
        id: "b_priority_support",
        name: "Night-Time Priority Support for Plant 7",
        amount: 50000,
        currency: "USD",
        stage: "Open Offer",
        valueStatus: "conditional",
        blocker: "Conditional offer pitched to Beatriz Alonso; unaccepted",
        evidenceIds: ["beatriz_alerts"],
        notes: "Pitched to Beatriz Alonso; unaccepted pending night-alert workflow agreement."
      }
    ],
    unverifiedClaims: [
      {
        id: "b_roi_claim",
        name: "Stefan Roy Theoretical Security Savings",
        amount: 1200000,
        currency: "EUR",
        stage: "Projected Claim",
        valueStatus: "unverified",
        blocker: "Guard contracts NOT reduced; Aldermoor Finance has booked €0 in savings",
        evidenceIds: ["sr_roi_0", "sr_roi_2"],
        notes: "Theoretical calculation in Stefan's spreadsheet. Must NEVER be counted as booked revenue or realized ROI."
      }
    ],
    bookedTotal: { amount: 140000, currency: "EUR" },
    pipelineTotals: {
      EUR: 140000, // b_renewal (€140k)
      USD: 0       // conditional offers stay separate
    }
  },

  powerMap: [
    {
      id: "stefan_roy",
      name: "Stefan Roy",
      role: "Group Head of Security",
      organization: "Corporate Security",
      relationship: "ally",
      authorityType: "Champion",
      financialAuthority: false,
      notes: "Programme sponsor and historical signatory on the 15 Jan 2026 order form. Authority over future Aldermoor capital purchases, plant expansions, or contract renewals is unconfirmed and cannot be inferred from job seniority; future commitments require group finance/board approval.",
      evidenceIds: ["contract_b", "sr_roi_0", "sr_roi_2"]
    },
    {
      id: "stefans_deputy",
      name: "Stefan Roy's Deputy (Name not on file)",
      role: "Rollout Technical Lead",
      organization: "Corporate Security",
      relationship: "neutral",
      authorityType: "Operational User",
      financialAuthority: false,
      notes: "Critical operational linchpin. Personally commissioned all flying plants. Holds all technical deployment know-how in his head. Leaving company shortly. No commercial purchasing authority.",
      evidenceIds: ["sr_repl_2", "b_idle"]
    },
    {
      id: "beatriz_alonso",
      name: "Beatriz Alonso",
      role: "Plant Manager, Plant 7",
      organization: "Operations (Plant 7)",
      relationship: "guarded",
      authorityType: "Operational User",
      financialAuthority: false,
      notes: "On-site operational stakeholder. Expressed frustration with night-time alert routing. Guarded attitude toward autonomous operations. No purchasing authority.",
      evidenceIds: ["beatriz_alerts"]
    },
    {
      id: "owen_fitch",
      name: "Owen Fitch",
      role: "Group IT Infrastructure Lead",
      organization: "Group IT",
      relationship: "neutral",
      authorityType: "Blocker",
      financialAuthority: false,
      notes: "Controls network security, firewall rules, and plant connectivity. Not involved in initial contractor installations; ongoing IT SLA undefined. Technical gatekeeper; no commercial signing authority.",
      evidenceIds: ["owen_fitch"]
    }
  ],

  nextMoves: [
    {
      rank: 1,
      title: "Investigate silent usage collapse across 3 docks (2–29 Nov 2026)",
      priority: "URGENT",
      owner: "CSM to contact Stefan Roy / Plant Managers",
      dueDate: "Date not recorded (Immediate Investigation)",
      relatedDeal: "b_renewal",
      reason: "Three docks that regularly fly at night recorded zero flights for two consecutive weeks while remaining connected online. No ticket was raised. Active anomaly requiring urgent investigation.",
      evidenceId: "usage_collapse"
    },
    {
      rank: 2,
      title: "Extract & document rollout SOP from Stefan Roy's departing deputy",
      priority: "HIGH",
      owner: "CSM with Stefan Roy",
      dueDate: "Before deputy departs (Upcoming Window Closing: 56 moves)",
      relatedDeal: "b_idle",
      reason: "All plant commissioning knowledge is undocumented and held solely by the deputy. Once he leaves, activating the 9 idle test plants and commissioning Plant 15 will become impossible.",
      evidenceId: "sr_repl_2"
    },
    {
      rank: 3,
      title: "Engage Owen Fitch (Head of Group IT) to formalize plant network SLA",
      priority: "MEDIUM",
      owner: "CSM / Solutions Engineer",
      dueDate: "Date not recorded",
      relatedDeal: "b_renewal / b_more_plants",
      reason: "Initial installations were executed by external contractors without Group IT oversight. Formal network ownership is required to prevent sudden firewall disconnections.",
      evidenceId: "owen_fitch"
    }
  ],

  riskRadar: [
    {
      id: "r_silent_collapse",
      title: "Silent Usage Collapse on 3 Regular Docks (Active Anomaly)",
      severity: "CRITICAL",
      explanation: "Telemetry report indicates 3 core night-patrol docks flew zero missions over the past two weeks while maintaining power/connectivity. Customer has not raised a ticket, signaling silent churn or operational paralysis. Investigation is active and pending.",
      owner: "CSM / Stefan Roy",
      actionRequired: "Contact Stefan Roy and affected plant managers today to determine whether weather, policy, or technical issues caused the halt.",
      evidenceId: "usage_collapse"
    },
    {
      id: "r_deputy_exit",
      title: "Rollout Know-how Loss with Departing Deputy (Upcoming Exit)",
      severity: "HIGH",
      explanation: "Stefan's deputy is leaving shortly. No written installation or commissioning guide exists; technical know-how resides entirely in his memory. Upcoming departure threatens idle plant expansion.",
      owner: "CSM / Stefan Roy",
      actionRequired: "Conduct structured knowledge-transfer sessions to document plant commissioning SOPs before his final day.",
      evidenceId: "sr_repl_2"
    },
    {
      id: "r_roi_disconnect",
      title: "Paper-Only €1.2M ROI vs Finance Reality",
      severity: "HIGH",
      explanation: "Stefan Roy's claimed €1.2M savings are theoretical calculations based on unreduced guard hours. Finance has booked zero savings. If executive leadership scrutinizes renewal on ROI, renewal will fail.",
      owner: "CSM / Stefan Roy",
      actionRequired: "Align with Stefan Roy on auditing actual guard contractor invoices or redefining tangible operational ROI (incident response speed, perimeter security).",
      evidenceId: "sr_roi_2"
    },
    {
      id: "r_it_vacuum",
      title: "Group IT Infrastructure & Firewall Vulnerability",
      severity: "MEDIUM",
      explanation: "Owen Fitch and Group IT were bypassed during initial contractor rollouts. Dock connectivity lacks formal IT monitoring or change management.",
      owner: "CSM / Owen Fitch",
      actionRequired: "Host technical architecture review with Owen Fitch to map dock port/bandwidth requirements and establish IT maintenance procedures.",
      evidenceId: "owen_fitch"
    },
    {
      id: "r_plant7_friction",
      title: "Night-Alert Operational Friction at Plant 7",
      severity: "MEDIUM",
      explanation: "Plant 7 Manager Beatriz Alonso remains guarded regarding alert fatigue and off-shift alert escalation. Unresolved frustration threatens site buy-in.",
      owner: "CSM / Support Desk",
      actionRequired: "Configure multi-recipient alert escalation policy and review night-shift response protocol with Beatriz.",
      evidenceId: "beatriz_alerts"
    }
  ],

  unknownGaps: [
    {
      id: "u_collapse_cause",
      gap: "Why did three regular night-patrol docks stop flying for two consecutive weeks?",
      whyItMatters: "Essential to prevent permanent operational abandonment and save the €140,000 contract renewal.",
      whoCanAnswer: "Stefan Roy / Affected Plant Managers",
      affectedDeal: "b_renewal",
      evidenceId: "usage_collapse"
    },
    {
      id: "u_deputy_details",
      gap: "What is the departing deputy's name, contact information, and exact departure date?",
      whyItMatters: "Required to schedule mandatory technical handover sessions before rollout knowledge is permanently lost.",
      whoCanAnswer: "Stefan Roy (Group Head of Security)",
      affectedDeal: "b_idle",
      evidenceId: "sr_repl_2"
    },
    {
      id: "u_real_savings",
      gap: "Has any Aldermoor plant actually reduced physical security guard headcount or contractor invoices?",
      whyItMatters: "Distinguishes defensible customer value from theoretical spreadsheet claims during renewal and sister-company evaluation.",
      whoCanAnswer: "Aldermoor Group Finance / Stefan Roy",
      affectedDeal: "b_renewal & b_sister",
      evidenceId: "sr_roi_2"
    },
    {
      id: "u_it_standards",
      gap: "What are Group IT's formal cybersecurity and network architecture requirements for IoT docks?",
      whyItMatters: "Prevents plant docks from being blocked by unexpected enterprise firewall updates.",
      whoCanAnswer: "Owen Fitch (Group IT Infrastructure Lead)",
      affectedDeal: "b_renewal",
      evidenceId: "owen_fitch"
    },
    {
      id: "u_plant7_staffing",
      gap: "Who is officially designated to respond to night-time perimeter breach alerts at Plant 7?",
      whyItMatters: "Critical for site safety and resolving Beatriz Alonso's operational pushback.",
      whoCanAnswer: "Beatriz Alonso (Plant 7 Manager)",
      affectedDeal: "b_priority_support",
      evidenceId: "beatriz_alerts"
    }
  ]
};

export const accountKQuestions: AccountQuestions = {
  accountKey: "K",
  accountName: "Kestrel Estates",
  discoveryStatus: "discovery_shell",
  statusBadge: "DISCOVERY SHELL — INCOMPLETE DATA (AWAITING DROP K INGESTION)",
  officialStory: "Commercial logistics & industrial estate park. Scheduled for afternoon Drop K unlocking via MCP get_new_account tool.",
  operationalReality: "Underlying commercial contracts, dock manifests, and flight telemetry are pending ingestion. Operational dock count and flight status are unverified on file.",
  contractTerm: "Pending paperwork ingestion",
  bookedCurrency: "GBP",

  bookValue: {
    bookedDeals: [],
    pipelineDeals: [
      {
        id: "k_estate_pipeline",
        name: "Estate Perimeter Surveillance & Logistics Fleet",
        amount: null,
        currency: "GBP",
        stage: "Discovery",
        valueStatus: "unverified",
        blocker: "Underlying commercial contract pending Drop K paperwork release",
        evidenceIds: ["k_shell_evidence"],
        notes: "Contract value unconfirmed until paperwork record is released via MCP."
      }
    ],
    conditionalOffers: [],
    unverifiedClaims: [],
    bookedTotal: { amount: 0, currency: "GBP" },
    pipelineTotals: { "GBP": 0 }
  },

  powerMap: [
    {
      id: "k_lead",
      name: "Estate Operations Lead (Unconfirmed)",
      role: "Commercial Operations Lead",
      organization: "Kestrel Estates",
      relationship: "neutral",
      authorityType: "Decision-Maker",
      financialAuthority: false,
      notes: "Named contact pending Drop K release. Authority over site capex unverified.",
      evidenceIds: ["k_shell_evidence"]
    }
  ],

  nextMoves: [
    {
      rank: 1,
      title: "Execute get_new_account('K') in afternoon MCP window",
      priority: "URGENT",
      owner: "CSM",
      dueDate: "Afternoon Drop K Window",
      relatedDeal: "Kestrel Estates Intake",
      reason: "Ingest actual contract, stakeholders and dock manifests when Drop K opens.",
      evidenceId: "k_shell_evidence"
    },
    {
      rank: 2,
      title: "Audit perimeter flight airspace & site security boundaries",
      priority: "HIGH",
      owner: "CSM / Operations",
      dueDate: "Post-Drop K Ingestion",
      relatedDeal: "Perimeter Fleet",
      reason: "Establish whether operations require BVLOS approvals or tenant security coordination.",
      evidenceId: "k_shell_evidence"
    },
    {
      rank: 3,
      title: "Identify financial decision-maker and capex signatory",
      priority: "MEDIUM",
      owner: "CSM",
      dueDate: "Post-Drop K Ingestion",
      relatedDeal: "Contract Formalization",
      reason: "Ensure procurement authority is confirmed before quoting commercial expansions.",
      evidenceId: "k_shell_evidence"
    }
  ],

  riskRadar: [
    {
      id: "k_risk_nodata",
      title: "Incomplete Discovery Records (Drop K Shell)",
      severity: "HIGH",
      explanation: "Account K is unverified in initial morning export; operating without contract records or flight logs.",
      owner: "CSM",
      actionRequired: "Poll get_new_account('K') via MCP JSON-RPC.",
      evidenceId: "k_shell_evidence"
    }
  ],

  unknownGaps: [
    {
      id: "k_unk_contract",
      gap: "Signed Order Form & Commercial Terms",
      whyItMatters: "Cannot recognize revenue or commit support tiers without contractual term and SLA definitions.",
      whoCanAnswer: "FlytBase Procurement / Kestrel Commercial Office",
      affectedDeal: "Kestrel Estate Intake",
      evidenceId: "k_shell_evidence"
    },
    {
      id: "k_unk_docks",
      gap: "Installed Dock Count & Site Health",
      whyItMatters: "Unknown if docks are deployed, tested, or operational.",
      whoCanAnswer: "Kestrel Site Security / Drone Support",
      affectedDeal: "Perimeter Fleet",
      evidenceId: "k_shell_evidence"
    }
  ]
};

export const accountNQuestions: AccountQuestions = {
  accountKey: "N",
  accountName: "Brindle Harbour Authority",
  discoveryStatus: "discovery_shell",
  statusBadge: "DISCOVERY SHELL — INCOMPLETE DATA (AWAITING DROP N INGESTION)",
  officialStory: "Maritime commercial harbour and port authority. Scheduled for afternoon Drop N unlocking via MCP get_new_account tool.",
  operationalReality: "Underlying port paperwork, maritime safety compliance, and coastal dock telemetry are pending ingestion.",
  contractTerm: "Pending paperwork ingestion",
  bookedCurrency: "GBP",

  bookValue: {
    bookedDeals: [],
    pipelineDeals: [
      {
        id: "n_port_pipeline",
        name: "Harbour Berth & Maritime Basin Surveillance",
        amount: null,
        currency: "GBP",
        stage: "Discovery",
        valueStatus: "unverified",
        blocker: "Underlying commercial agreement pending Drop N paperwork release",
        evidenceIds: ["n_shell_evidence"],
        notes: "Contract value unconfirmed until paperwork record is released via MCP."
      }
    ],
    conditionalOffers: [],
    unverifiedClaims: [],
    bookedTotal: { amount: 0, currency: "GBP" },
    pipelineTotals: { "GBP": 0 }
  },

  powerMap: [
    {
      id: "n_lead",
      name: "Harbour Master / Operations Lead (Unconfirmed)",
      role: "Port Operations Director",
      organization: "Brindle Harbour Authority",
      relationship: "neutral",
      authorityType: "Decision-Maker",
      financialAuthority: false,
      notes: "Named contact pending Drop N release. Maritime authority unverified.",
      evidenceIds: ["n_shell_evidence"]
    }
  ],

  nextMoves: [
    {
      rank: 1,
      title: "Execute get_new_account('N') in afternoon MCP window",
      priority: "URGENT",
      owner: "CSM",
      dueDate: "Afternoon Drop N Window",
      relatedDeal: "Brindle Harbour Intake",
      reason: "Ingest actual harbour contracts, dock telemetry, and port stakeholders when Drop N opens.",
      evidenceId: "n_shell_evidence"
    },
    {
      rank: 2,
      title: "Assess maritime airspace & vessel clearance regulations",
      priority: "HIGH",
      owner: "CSM / Operations",
      dueDate: "Post-Drop N Ingestion",
      relatedDeal: "Harbour Surveillance",
      reason: "Verify maritime CAA/port safety compliance for over-water drone patrols.",
      evidenceId: "n_shell_evidence"
    },
    {
      rank: 3,
      title: "Confirm harbour authority budget and signatory threshold",
      priority: "MEDIUM",
      owner: "CSM",
      dueDate: "Post-Drop N Ingestion",
      relatedDeal: "Contract Formalization",
      reason: "Determine whether harbour board or municipal council holds procurement authority.",
      evidenceId: "n_shell_evidence"
    }
  ],

  riskRadar: [
    {
      id: "n_risk_nodata",
      title: "Incomplete Discovery Records (Drop N Shell)",
      severity: "HIGH",
      explanation: "Account N is unverified in initial morning export; operating without port contracts or flight logs.",
      owner: "CSM",
      actionRequired: "Poll get_new_account('N') via MCP JSON-RPC.",
      evidenceId: "n_shell_evidence"
    }
  ],

  unknownGaps: [
    {
      id: "n_unk_contract",
      gap: "Signed Order Form & Port SLA",
      whyItMatters: "Cannot recognize revenue or commit maritime support tiers without contractual term.",
      whoCanAnswer: "Brindle Commercial Lead",
      affectedDeal: "Brindle Harbour Intake",
      evidenceId: "n_shell_evidence"
    },
    {
      id: "n_unk_maritime",
      gap: "Vessel Movement & Dock Coordinates",
      whyItMatters: "Unknown if docks withstand marine salt conditions or interfere with port cranes.",
      whoCanAnswer: "Harbour Master",
      affectedDeal: "Harbour Surveillance",
      evidenceId: "n_shell_evidence"
    }
  ]
};

export const baselineSignals: SignalItem[] = [
  {
    id: "champion_leaves",
    account: "A",
    dated: "2026-11-17",
    title: "Eastern Counties: Rhys Calder is moving on (Upcoming Transition — Jan 2027)",
    summary: "Upcoming leadership transition: Rhys Calder emailed stating he leaves the drone programme in January 2027. No successor has been named. Transition is pending; every previous call was with him alone.",
    records: [
      {
        kind: "email",
        path: "A/emails/2026-11-17_rhys_moving.txt",
        text: "From: Rhys Calder\nTo: CSM\nDate: 17 November 2026\nSubject: A change on my side\n\nI am moving to another role in the new year and will hand over the drone programme in January. My successor has not been named yet. Anything we have agreed stands. Until January, keep sending things to the programme office.\n\nRhys"
      }
    ],
    set_off_at: "2026-11-14T09:30:38.755Z"
  },
  {
    id: "urgent_request",
    account: "A",
    dated: "2026-11-18",
    title: "Eastern Counties: Westmere needs an answer before a public event (Upcoming Event — 5 Dec 2026)",
    summary: "Upcoming operational event dependency: Insp. Karen Mbeki logged ticket FB-11206 ahead of a major public event on 5 December 2026. She demands written operator training dates and a named contact for dock failures. Response is pending.",
    records: [
      {
        kind: "email",
        path: "A/emails/2026-11-18_karen_event.txt",
        text: "From: Insp. Karen Mbeki\nDate: 18 November 2026\nSubject: Public event, 5 December\n\nWe are policing a large public event on Saturday 5 December... I need two things settled in writing this week: 1. Operators: how many more officers trained before the day and when. 2. Cover on the day: if a dock fails, who do I call and how fast does anyone answer.\n\nKaren Mbeki"
      },
      {
        kind: "request",
        path: "A/requests.csv",
        note: "Support ticket FB-11206",
        text: "FB-11206,2026-11-18,Westmere drone unit,\"Operator training and support cover before a public event on 5 December. Marked urgent by requester.\",Open,,2026-11-18,Support ticket"
      }
    ],
    set_off_at: "2026-11-14T09:30:42.574Z"
  },
  {
    id: "usage_collapse",
    account: "B",
    dated: "2026-11-29",
    title: "Aldermoor: Silent usage collapse across three docks (Upcoming Telemetry Report — 2–29 Nov 2026)",
    summary: "Upcoming telemetry report for 2 to 29 November 2026 indicates three regular night-patrol docks flew zero missions for two consecutive weeks while maintaining power/connectivity. Anomaly investigation pending; no ticket logged.",
    records: [
      {
        kind: "telemetry",
        path: "B/usage_weekly.csv",
        text: "Weeks of 2026-11-16 and 2026-11-23: AD-04, AD-07, AD-11: 0 flights recorded, 7 days online. Normal baseline: 5-7 flights/week. Ticket log: None. Active anomaly investigation pending."
      }
    ],
    set_off_at: "2026-11-14T09:30:50.000Z"
  }
];
