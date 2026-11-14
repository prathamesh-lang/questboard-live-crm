export type AccountKey = "A" | "B" | "K" | "N";

export type EvidenceType = "DIRECT" | "DERIVED" | "UNVERIFIED";

export interface EvidenceRecord {
  id: string;
  title: string;
  type: EvidenceType;
  account: AccountKey;
  path?: string;
  timestamp?: string;
  excerpt: string;
  formula?: string;
  sourceIds?: string[];
}

export type DealValueStatus = "booked" | "pipeline" | "conditional" | "unverified" | "declined";

export interface DealItem {
  id: string;
  name: string;
  amount: number | null;
  currency: "GBP" | "EUR" | "USD";
  stage: string;
  valueStatus: DealValueStatus;
  blocker?: string | null;
  evidenceIds: string[];
  notes?: string;
}

export interface StakeholderItem {
  id: string;
  name: string;
  role: string;
  organization: string;
  relationship: "ally" | "warm" | "neutral" | "guarded";
  authorityType: "Decision-Maker" | "Payer" | "Signatory" | "Operational User" | "Blocker" | "Champion";
  financialAuthority: boolean;
  notes: string;
  evidenceIds: string[];
}

export interface RankedAction {
  rank: 1 | 2 | 3;
  title: string;
  priority: "URGENT" | "HIGH" | "MEDIUM";
  owner: string; // "Owner to confirm" if unknown
  dueDate: string; // "Date not recorded" if unknown
  relatedDeal: string;
  reason: string;
  evidenceId: string;
}

export interface RiskItem {
  id: string;
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  explanation: string;
  owner: string;
  actionRequired: string;
  evidenceId: string;
}

export interface UnknownGap {
  id: string;
  gap: string;
  whyItMatters: string;
  whoCanAnswer: string;
  affectedDeal: string;
  evidenceId: string;
}

export interface AccountQuestions {
  accountKey: AccountKey;
  accountName: string;
  officialStory: string;
  operationalReality: string;
  contractTerm: string;
  bookedCurrency: "GBP" | "EUR" | "USD";
  statusBadge?: string;
  discoveryStatus?: "active" | "discovery_shell";

  // Q1: Book Value
  bookValue: {
    bookedDeals: DealItem[];
    pipelineDeals: DealItem[];
    conditionalOffers: DealItem[];
    unverifiedClaims: DealItem[];
    bookedTotal: { amount: number; currency: string };
    pipelineTotals: Record<string, number>;
  };

  // Q2: Decision Power
  powerMap: StakeholderItem[];

  // Q3: Next Moves (exactly 3)
  nextMoves: [RankedAction, RankedAction, RankedAction];

  // Q4: Risk Radar
  riskRadar: RiskItem[];

  // Q5: Unknown Gaps
  unknownGaps: UnknownGap[];
}

export interface SignalRecord {
  kind: string;
  path: string;
  text?: string;
  note?: string;
}

export interface SignalItem {
  id: string;
  account: AccountKey;
  dated: string;
  title: string;
  summary: string;
  records?: SignalRecord[];
  set_off_at?: string;
}
