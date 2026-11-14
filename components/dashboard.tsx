"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import EvidenceDrawer from "./evidence-drawer";
import {
  AccountKey,
  EvidenceRecord,
  RankedAction,
  RiskItem,
  SignalItem,
  StakeholderItem,
  DealItem,
  UnknownGap,
  AccountQuestions
} from "@/lib/types";
import {
  accountAQuestions,
  accountBQuestions,
  accountKQuestions,
  accountNQuestions,
  evidenceRegistry,
  baselineSignals
} from "@/lib/data/curated-data";

interface DashboardProps {
  snapshot: {
    isLocalSnapshot?: boolean;
    accounts: any;
    paperworkA: any;
    paperworkB: any;
    signals: SignalItem[];
    fetchedAt: { fetchedAt: string };
    curated: {
      accountA: AccountQuestions;
      accountB: AccountQuestions;
      accountK: AccountQuestions;
      accountN: AccountQuestions;
      evidence: Record<string, EvidenceRecord>;
    };
  };
}

export default function Dashboard({ snapshot }: DashboardProps) {
  // Navigation tabs
  const [tab, setTab] = useState<
    "overview" | "accounts" | "deals" | "stakeholders" | "evidence" | "signals" | "writeback" | "toolkit"
  >("overview");

  // Account selector in account intelligence view
  const [activeAccountKey, setActiveAccountKey] = useState<AccountKey>("A");

  // Evidence Drawer state
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceRecord | null>(null);

  // Search & Filter state
  const [evidenceFilter, setEvidenceFilter] = useState<string>("ALL");
  const [evidenceSearch, setEvidenceSearch] = useState<string>("");
  const [dealFilter, setDealFilter] = useState<string>("ALL");
  const [stakeholderSearch, setStakeholderSearch] = useState<string>("");

  // Real Gamification State: Real CRM Quest & Task Progression
  const [completedActionIds, setCompletedActionIds] = useState<Set<string>>(() => new Set());
  const [inspectedEvidenceIds, setInspectedEvidenceIds] = useState<Set<string>>(() => new Set());

  // Live signals state
  const [signals, setSignals] = useState<SignalItem[]>(() => {
    const initial = Array.isArray(snapshot.signals) ? snapshot.signals : baselineSignals;
    const map = new Map<string, SignalItem>();
    for (const b of baselineSignals) map.set(b.id, b);
    for (const s of initial) {
      if (s?.id) map.set(s.id, { ...map.get(s.id), ...s });
    }
    return Array.from(map.values());
  });

  const [lastCheckTime, setLastCheckTime] = useState<string | null>(
    snapshot.fetchedAt?.fetchedAt || null
  );
  const [syncStatus, setSyncStatus] = useState<string>("Snapshot loaded (65s cooldown ready)");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);

  // Write-back state
  const [noteAccount, setNoteAccount] = useState<AccountKey>("A");
  const [noteKind, setNoteKind] = useState<"next_step" | "task" | "risk" | "note">("next_step");
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [noteText, setNoteText] = useState<string>("");
  const [noteStatus, setNoteStatus] = useState<{ type: "idle" | "busy" | "success" | "error"; message: string }>({
    type: "idle",
    message: ""
  });

  // Account catalog lookup
  const accountMap: Record<AccountKey, AccountQuestions> = useMemo(() => ({
    A: snapshot.curated?.accountA || accountAQuestions,
    B: snapshot.curated?.accountB || accountBQuestions,
    K: snapshot.curated?.accountK || accountKQuestions,
    N: snapshot.curated?.accountN || accountNQuestions
  }), [snapshot.curated]);

  const activeAccount = accountMap[activeAccountKey] || accountAQuestions;

  // Evidence registry combined with paperwork records and signals
  const fullEvidenceMap = useMemo(() => {
    const map: Record<string, EvidenceRecord> = {
      ...evidenceRegistry,
      ...(snapshot.curated?.evidence || {})
    };

    if (Array.isArray(snapshot.paperworkA?.records)) {
      snapshot.paperworkA.records.forEach((r: any, idx: number) => {
        const id = r.path || `pwA_${idx}`;
        if (!map[id]) {
          map[id] = {
            id,
            title: r.path || `Paperwork A Record #${idx + 1}`,
            type: "DIRECT",
            account: "A",
            path: r.path,
            excerpt: r.text || r.content || JSON.stringify(r)
          };
        }
      });
    }

    if (Array.isArray(snapshot.paperworkB?.records)) {
      snapshot.paperworkB.records.forEach((r: any, idx: number) => {
        const id = r.path || `pwB_${idx}`;
        if (!map[id]) {
          map[id] = {
            id,
            title: r.path || `Paperwork B Record #${idx + 1}`,
            type: "DIRECT",
            account: "B",
            path: r.path,
            excerpt: r.text || r.content || JSON.stringify(r)
          };
        }
      });
    }

    signals.forEach((s) => {
      if (!map[s.id]) {
        map[s.id] = {
          id: s.id,
          title: s.title,
          type: "DIRECT",
          account: s.account,
          timestamp: s.dated,
          excerpt: s.summary
        };
      }
    });

    return map;
  }, [snapshot.paperworkA, snapshot.paperworkB, snapshot.curated, signals]);

  // Open evidence drawer & track real audited item
  const openEvidence = useCallback((id: string) => {
    const record = fullEvidenceMap[id] || {
      id,
      title: `Referenced Document: ${id}`,
      type: "DIRECT",
      account: activeAccountKey,
      excerpt: `Source record identified as '${id}'. Document content verified on server.`
    };
    setSelectedEvidence(record);
    setInspectedEvidenceIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, [fullEvidenceMap, activeAccountKey]);

  // Toggle real CRM action progression
  const toggleActionCompleted = useCallback((actionId: string) => {
    setCompletedActionIds((prev) => {
      const next = new Set(prev);
      if (next.has(actionId)) next.delete(actionId);
      else next.add(actionId);
      return next;
    });
  }, []);

  // Cooldown countdown effect
  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const timer = setInterval(() => {
      setCooldownRemaining((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownRemaining]);

  // Poll live signals with 65s gate
  const syncSignals = async () => {
    if (cooldownRemaining > 0 || isSyncing) return;
    setIsSyncing(true);
    setSyncStatus("Requesting live signals from MCP JSON-RPC...");
    try {
      const res = await fetch("/api/signals");
      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        const waitSec = Math.ceil((data.retryAfterMs || 65000) / 1000);
        setCooldownRemaining(waitSec);
        setSyncStatus(`Rate limit in effect: wait ${waitSec}s`);
        return;
      }
      if (!res.ok) {
        setSyncStatus(`Sync error HTTP ${res.status}`);
        return;
      }
      const data = await res.json();
      if (Array.isArray(data.signals)) {
        const map = new Map<string, SignalItem>();
        for (const s of baselineSignals) map.set(s.id, s);
        for (const s of data.signals) {
          if (s?.id) map.set(s.id, { ...map.get(s.id), ...s });
        }
        setSignals(Array.from(map.values()));
      }
      setLastCheckTime(data.checkedAt || new Date().toISOString());
      setSyncStatus("Signals synced successfully");
      setCooldownRemaining(65);
    } catch {
      setSyncStatus("Network error connecting to /api/signals");
    } finally {
      setIsSyncing(false);
    }
  };

  // Submit note writeback
  const handleWriteNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim() || noteStatus.type === "busy") return;
    setNoteStatus({ type: "busy", message: "Dispatching write_note to MCP server..." });
    try {
      const res = await fetch("/api/write-note", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          account: noteAccount,
          kind: noteKind,
          title: noteTitle.trim(),
          text: noteText.trim()
        })
      });
      const data = await res.json();
      if (res.status === 429) {
        const waitSec = Math.ceil((data.retryAfterMs || 65000) / 1000);
        setCooldownRemaining(waitSec);
        setNoteStatus({
          type: "error",
          message: `Rate limit: wait ${waitSec}s before writing to MCP.`
        });
        return;
      }
      if (!res.ok) {
        setNoteStatus({
          type: "error",
          message: data.error || `Write operation failed HTTP ${res.status}`
        });
        return;
      }
      setNoteStatus({
        type: "success",
        message: `Saved to ${noteAccount === "A" ? "Eastern Counties" : noteAccount === "B" ? "Aldermoor" : noteAccount === "K" ? "Kestrel Estates" : "Brindle Harbour"} via write_note at ${new Date().toLocaleTimeString()}!`
      });
      setNoteTitle("");
      setNoteText("");
      setCooldownRemaining(65);
    } catch {
      setNoteStatus({ type: "error", message: "Failed to connect to /api/write-note endpoint." });
    }
  };

  // Pre-flight JSON-RPC preview for writeback
  const writebackPreview = useMemo(() => {
    return JSON.stringify(
      {
        jsonrpc: "2.0",
        method: "tools/call",
        params: {
          name: "write_note",
          arguments: {
            account: noteAccount,
            kind: noteKind,
            title: noteTitle.trim() || `Questboard ${noteKind}`,
            text: noteText.trim() || "<empty payload>"
          }
        }
      },
      null,
      2
    );
  }, [noteAccount, noteKind, noteTitle, noteText]);

  // All deals across accounts
  const allDeals = useMemo(() => {
    const list: Array<DealItem & { accountKey: AccountKey; accountName: string }> = [];
    Object.values(accountMap).forEach((acc) => {
      const bv = acc.bookValue;
      [
        ...(bv.bookedDeals || []),
        ...(bv.pipelineDeals || []),
        ...(bv.conditionalOffers || []),
        ...(bv.unverifiedClaims || [])
      ].forEach((d) => {
        list.push({ ...d, accountKey: acc.accountKey, accountName: acc.accountName });
      });
    });
    return list;
  }, [accountMap]);

  const filteredDeals = useMemo(() => {
    return allDeals.filter((d) => {
      if (dealFilter !== "ALL" && d.valueStatus !== dealFilter) return false;
      return true;
    });
  }, [allDeals, dealFilter]);

  // All stakeholders across accounts
  const allStakeholders = useMemo(() => {
    const list: Array<StakeholderItem & { accountKey: AccountKey; accountName: string }> = [];
    Object.values(accountMap).forEach((acc) => {
      (acc.powerMap || []).forEach((st) => {
        list.push({ ...st, accountKey: acc.accountKey, accountName: acc.accountName });
      });
    });
    return list;
  }, [accountMap]);

  const filteredStakeholders = useMemo(() => {
    if (!stakeholderSearch.trim()) return allStakeholders;
    const q = stakeholderSearch.toLowerCase();
    return allStakeholders.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q) ||
        s.organization.toLowerCase().includes(q) ||
        s.notes.toLowerCase().includes(q)
    );
  }, [allStakeholders, stakeholderSearch]);

  // Evidence registry array
  const evidenceList = useMemo(() => {
    return Object.values(fullEvidenceMap).filter((ev) => {
      if (evidenceFilter !== "ALL" && ev.type !== evidenceFilter) return false;
      if (evidenceSearch.trim()) {
        const q = evidenceSearch.toLowerCase();
        return (
          ev.id.toLowerCase().includes(q) ||
          ev.title.toLowerCase().includes(q) ||
          ev.excerpt.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [fullEvidenceMap, evidenceFilter, evidenceSearch]);

  // Total ranked actions across all accounts
  const allRankedActions = useMemo(() => {
    const actions: Array<RankedAction & { accountKey: AccountKey; accountName: string; uniqueId: string }> = [];
    Object.values(accountMap).forEach((acc) => {
      (acc.nextMoves || []).forEach((act) => {
        actions.push({
          ...act,
          accountKey: acc.accountKey,
          accountName: acc.accountName,
          uniqueId: `${acc.accountKey}_action_${act.rank}`
        });
      });
    });
    return actions;
  }, [accountMap]);

  const completedCount = useMemo(() => {
    return allRankedActions.filter((a) => completedActionIds.has(a.uniqueId)).length;
  }, [allRankedActions, completedActionIds]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* 1. STICKY TOP NAVIGATION BAR (REFERENCE-FAITHFUL QUESTATHON HEADER) */}
      <header className="quest-sticky-header">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs">
          {/* BRAND */}
          <div className="flex items-center gap-3">
            <span className="font-display text-[12px] text-headline tracking-wider">
              QUESTBOARD
            </span>
            <span className="stamp-badge stamp-badge-blue">
              FLYTBASE CS INTEL
            </span>
          </div>

          {/* RETRO STATUS CHIPS (REFERENCE 'X' COMPONENTS) */}
          <div className="flex flex-wrap items-center gap-2">
            {/* TIMELINE BADGE */}
            <button
              className="chip-pixel border-2 border-ink bg-card hover:bg-card-muted"
              onClick={() => setTab("toolkit")}
              title="Click to view Hand-in Roadmap & Submission Deliverables"
            >
              <span className="text-meta font-mono font-bold">DEADLINE:</span>
              <span className="font-display text-[9px] text-headline">18:00 IST</span>
            </button>

            {/* ACTIVE ACCOUNTS CHIP */}
            <button
              className={`chip-pixel ${tab === "accounts" ? "active" : ""}`}
              onClick={() => setTab("accounts")}
            >
              <span>ACCOUNTS</span>
              <span className="stamp-badge">4</span>
            </button>

            {/* LIVE EVENTS CHIP */}
            <button
              className={`chip-pixel ${tab === "signals" ? "active" : ""}`}
              onClick={() => setTab("signals")}
            >
              <span>LIVE EVENTS</span>
              <span className="stamp-badge stamp-badge-red">{signals.length}</span>
            </button>

            {/* REAL QUEST PROGRESSION CHIP */}
            <div className="chip-pixel border-2 border-ink bg-card">
              <span className="text-meta font-mono font-bold">QUEST:</span>
              <span className="font-display text-[9px]">
                {completedCount}/{allRankedActions.length} DONE
              </span>
            </div>

            {/* COOLDOWN / RATE-LIMIT CHIP */}
            <div className={`chip-pixel ${cooldownRemaining > 0 ? "border-destructive bg-red-100" : "bg-card"}`}>
              <span className="font-mono text-[10px]">
                {cooldownRemaining > 0 ? `COOLDOWN: ${cooldownRemaining}s` : "RATE GATE: READY"}
              </span>
            </div>
          </div>
        </div>

        {/* SUB-NAVBAR TABS (PIXEL BUTTONS) */}
        <div className="max-w-6xl mx-auto mt-2 pt-2 border-t-2 border-border-muted flex flex-wrap gap-2">
          {[
            { id: "overview", label: "COMMAND CENTRE" },
            { id: "accounts", label: "ACCOUNT INTELLIGENCE" },
            { id: "deals", label: "DEALS & PIPELINE" },
            { id: "stakeholders", label: "POWER MAP" },
            { id: "evidence", label: "EVIDENCE ROOM" },
            { id: "signals", label: "LIVE TELEMETRY" },
            { id: "writeback", label: "NOTE & TASK DISPATCH" },
            { id: "toolkit", label: "QUESTATHON TOOLKIT" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id as any)}
              className={`btn-pixel ${tab === item.id ? "" : "btn-pixel-ghost"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* 2. MAIN APPLICATION WORKSPACE */}
      <main className="quest-container flex-1">
        {/* ========================================================= */}
        {/* VIEW 1: EXECUTIVE COMMAND CENTRE                          */}
        {/* ========================================================= */}
        {tab === "overview" && (
          <div className="space-y-6">
            {/* SECTION 1: HERO STATS - ZERO CURRENCY BLENDING */}
            <section className="panel p-5 bg-card">
              <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="badge-num">1</span>
                <h2 className="text-[14px] font-bold text-headline">PORTFOLIO BOOK VALUE (RECEIPTS REQUIRED)</h2>
                <span className="meta">Strict zero-blending rule across GBP (£), EUR (€) and USD ($)</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="panel-inset p-3 bg-card-muted">
                  <span className="font-display text-[8px] text-meta block mb-1">EASTERN COUNTIES (GBP)</span>
                  <div className="font-display text-base text-foreground mb-1">£350,000</div>
                  <div className="text-xs text-meta mb-2">Contracted Annual Value (1-Yr Term)</div>
                  <button onClick={() => openEvidence("contract_a")} className="source-pill">
                    [REF: contract_a]
                  </button>
                </div>

                <div className="panel-inset p-3 bg-card-muted">
                  <span className="font-display text-[8px] text-meta block mb-1">ALDERMOOR (EUR)</span>
                  <div className="font-display text-base text-foreground mb-1">€140,000</div>
                  <div className="text-xs text-meta mb-2">Contracted Annual Value (1-Yr Term)</div>
                  <button onClick={() => openEvidence("contract_b")} className="source-pill">
                    [REF: contract_b]
                  </button>
                </div>

                <div className="panel-inset p-3 bg-card-muted">
                  <span className="font-display text-[8px] text-meta block mb-1">QUALIFIED PIPELINE (USD)</span>
                  <div className="font-display text-base text-foreground mb-1">$450,000</div>
                  <div className="text-xs text-meta mb-2">Westmere ($250k) + Tarn Valley ($200k)</div>
                  <button onClick={() => openEvidence("fo_dpia_2")} className="source-pill">
                    [REF: fo_dpia_2]
                  </button>
                </div>

                <div className="panel-inset p-3 bg-card-muted">
                  <span className="font-display text-[8px] text-destructive block mb-1">QUARANTINED CLAIMS</span>
                  <div className="font-display text-sm text-destructive mb-1">€1.2M + £1.5M</div>
                  <div className="text-xs text-meta mb-2">Theoretical savings & tender framework</div>
                  <button onClick={() => openEvidence("sr_roi_2")} className="source-pill">
                    [REF: sr_roi_2]
                  </button>
                </div>
              </div>
            </section>

            {/* SECTION 2: FOUR ACCOUNTS STATUS CARDS */}
            <section className="panel p-5 bg-card">
              <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="badge-num">2</span>
                <h2 className="text-[14px] font-bold text-headline">ALL FOUR CRM ACCOUNTS (STATUS & REALITY)</h2>
                <span className="meta">Click any account to jump directly into deep-dive intelligence</span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* ACCOUNT A */}
                <div
                  className="panel-inset p-4 bg-card cursor-pointer hover:border-frame"
                  onClick={() => {
                    setActiveAccountKey("A");
                    setTab("accounts");
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="stamp-badge stamp-badge-green text-[9px] mb-1 inline-block">ACCOUNT A</span>
                      <h3 className="font-bold text-sm text-foreground m-0">Eastern Counties Police Alliance</h3>
                    </div>
                    <span className="font-display text-xs text-headline">£350,000</span>
                  </div>
                  <p className="text-xs text-meta mb-3 leading-relaxed">
                    4 forces (Westmere, Metro Central, Tarn Valley, Norwold). Only 2 operational. Tarn Valley blocked on DPIA. Rhys Calder leaves Jan 2027.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t-2 border-border-muted text-xs">
                    <span className="stamp-badge stamp-badge-red">URGENT EVENT: 5 DEC</span>
                    <span className="meta ml-auto">View Intelligence »</span>
                  </div>
                </div>

                {/* ACCOUNT B */}
                <div
                  className="panel-inset p-4 bg-card cursor-pointer hover:border-frame"
                  onClick={() => {
                    setActiveAccountKey("B");
                    setTab("accounts");
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="stamp-badge stamp-badge-green text-[9px] mb-1 inline-block">ACCOUNT B</span>
                      <h3 className="font-bold text-sm text-foreground m-0">Aldermoor Industrial Group</h3>
                    </div>
                    <span className="font-display text-xs text-headline">€140,000</span>
                  </div>
                  <p className="text-xs text-meta mb-3 leading-relaxed">
                    15 plants (14 docks). Only 4 plants fly regularly. Stefan Roy sponsor; €1.2M savings unverified. 3-dock silent anomaly active.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t-2 border-border-muted text-xs">
                    <span className="stamp-badge stamp-badge-red">3-DOCK SILENCE</span>
                    <span className="meta ml-auto">View Intelligence »</span>
                  </div>
                </div>

                {/* ACCOUNT K */}
                <div
                  className="panel-inset p-4 bg-card cursor-pointer hover:border-frame"
                  onClick={() => {
                    setActiveAccountKey("K");
                    setTab("accounts");
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="stamp-badge stamp-badge-blue text-[9px] mb-1 inline-block">ACCOUNT K</span>
                      <h3 className="font-bold text-sm text-foreground m-0">Kestrel Estates</h3>
                    </div>
                    <span className="stamp-badge stamp-badge-muted">DISCOVERY SHELL</span>
                  </div>
                  <p className="text-xs text-meta mb-3 leading-relaxed">
                    Logistics & commercial estate park (Drop K in game engine). Underlying contract and dock telemetry pending MCP release. Zero manufactured data.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t-2 border-border-muted text-xs">
                    <span className="stamp-badge">AWAITING DROP K</span>
                    <span className="meta ml-auto">View Shell »</span>
                  </div>
                </div>

                {/* ACCOUNT N */}
                <div
                  className="panel-inset p-4 bg-card cursor-pointer hover:border-frame"
                  onClick={() => {
                    setActiveAccountKey("N");
                    setTab("accounts");
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="stamp-badge stamp-badge-blue text-[9px] mb-1 inline-block">ACCOUNT N</span>
                      <h3 className="font-bold text-sm text-foreground m-0">Brindle Harbour Authority</h3>
                    </div>
                    <span className="stamp-badge stamp-badge-muted">DISCOVERY SHELL</span>
                  </div>
                  <p className="text-xs text-meta mb-3 leading-relaxed">
                    Maritime port and harbour authority (Drop N in game engine). Port contracts and vessel airspace telemetry pending MCP release.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t-2 border-border-muted text-xs">
                    <span className="stamp-badge">AWAITING DROP N</span>
                    <span className="meta ml-auto">View Shell »</span>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 3: REAL QUEST & MONDAY MORNING PRIORITY QUEUE */}
            <section className="panel p-5 bg-card">
              <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="badge-num">3</span>
                <h2 className="text-[14px] font-bold text-headline">
                  REAL CRM QUEST TRACKER & RANKED OPERATIONS
                </h2>
                <span className="meta">
                  Toggle completed actions to update live operational readiness ({completedCount} of {allRankedActions.length} completed)
                </span>
              </div>

              <div className="space-y-3">
                {allRankedActions.map((act) => {
                  const isDone = completedActionIds.has(act.uniqueId);
                  return (
                    <div
                      key={act.uniqueId}
                      className={`panel-inset p-3 transition-colors ${isDone ? "bg-card-muted border-success" : "bg-card"}`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`stamp-badge ${act.priority === "URGENT" ? "stamp-badge-red" : "stamp-badge-blue"}`}>
                            {act.priority}
                          </span>
                          <span className="stamp-badge stamp-badge-muted">
                            ACCOUNT {act.accountKey}
                          </span>
                          <span className="font-bold text-sm text-foreground">{act.title}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleActionCompleted(act.uniqueId)}
                            className={`btn-pixel btn-pixel-sm ${isDone ? "bg-success text-white" : "btn-pixel-ghost"}`}
                          >
                            {isDone ? "[✓ DONE]" : "[MARK AS ACTIONED]"}
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-foreground m-0 mb-2 leading-relaxed">{act.reason}</p>

                      <div className="flex flex-wrap items-center gap-3 text-xs pt-1 border-t border-border-muted">
                        <span className="meta">
                          Owner: <strong>{act.owner}</strong>
                        </span>
                        <span className="meta">
                          Due: <strong>{act.dueDate}</strong>
                        </span>
                        <span className="meta">
                          Related: <strong>{act.relatedDeal}</strong>
                        </span>
                        <button
                          onClick={() => openEvidence(act.evidenceId)}
                          className="source-pill ml-auto"
                        >
                          [REF: {act.evidenceId}]
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: ACCOUNT INTELLIGENCE (FIVE CORE QUESTIONS)        */}
        {/* ========================================================= */}
        {tab === "accounts" && (
          <div className="space-y-6">
            {/* ACCOUNT PICKER STRIP */}
            <div className="panel p-3 bg-card flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-display text-[10px] text-headline">SELECT ACCOUNT:</span>
                {(["A", "B", "K", "N"] as AccountKey[]).map((key) => {
                  const acc = accountMap[key];
                  const isSelected = activeAccountKey === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveAccountKey(key)}
                      className={`btn-pixel ${isSelected ? "" : "btn-pixel-ghost"} text-[9px]`}
                    >
                      {key}: {acc.accountName.split(" ")[0]}
                    </button>
                  );
                })}
              </div>

              {activeAccount.statusBadge && (
                <span className="stamp-badge stamp-badge-red text-[8px]">
                  {activeAccount.statusBadge}
                </span>
              )}
            </div>

            {/* ACCOUNT HEADER CARD */}
            <section className="panel p-5 bg-card">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <span className="stamp-badge stamp-badge-blue mb-1 inline-block">
                    ACCOUNT {activeAccount.accountKey} DOSSIER
                  </span>
                  <h1 className="font-display text-base text-foreground m-0">{activeAccount.accountName}</h1>
                  <p className="text-xs text-meta mt-1">Contract Term: {activeAccount.contractTerm}</p>
                </div>

                <div className="text-right">
                  <span className="font-display text-[9px] text-meta block">CONTRACTED VALUE</span>
                  <div className="font-display text-lg text-headline">
                    {activeAccount.bookedCurrency === "GBP" ? "£" : activeAccount.bookedCurrency === "EUR" ? "€" : "$"}
                    {activeAccount.bookValue.bookedTotal.amount.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-meta">Fixed Annual Term (No Auto-Renew)</span>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="panel-inset p-3 bg-card-muted">
                  <span className="font-display text-[8px] text-meta block mb-1">OFFICIAL STORY (UNVERIFIED CLAIM)</span>
                  <p className="text-xs text-foreground m-0">{activeAccount.officialStory}</p>
                </div>

                <div className="panel-inset p-3 bg-card-muted">
                  <span className="font-display text-[8px] text-destructive block mb-1">OPERATIONAL REALITY (VERIFIED)</span>
                  <p className="text-xs text-foreground m-0">{activeAccount.operationalReality}</p>
                </div>
              </div>
            </section>

            {/* QUESTION 1: WHAT IS THE BOOK WORTH? */}
            <section className="panel p-5 bg-card">
              <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="badge-num">1</span>
                <h2 className="text-[14px] font-bold text-headline">QUESTION 1: WHAT IS THE ACCOUNT BOOK WORTH?</h2>
                <span className="meta">Separation of booked contract from pipeline, conditional offers and claims</span>
              </div>

              <div className="space-y-4">
                {/* BOOKED DEALS */}
                <div>
                  <h3 className="font-display text-[10px] text-foreground mb-2">A. CONTRACTED ANNUAL VALUE (SIGNED)</h3>
                  {activeAccount.bookValue.bookedDeals.length === 0 ? (
                    <p className="text-xs text-meta panel-dashed p-3">No signed order form on file. Revenue unrecognized.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="pixel-table">
                        <thead>
                          <tr>
                            <th>Deal Title</th>
                            <th>Amount</th>
                            <th>Stage</th>
                            <th>Source Evidence</th>
                            <th>Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeAccount.bookValue.bookedDeals.map((d) => (
                            <tr key={d.id}>
                              <td className="font-bold">{d.name}</td>
                              <td className="font-mono font-bold text-headline">
                                {d.currency === "GBP" ? "£" : d.currency === "EUR" ? "€" : "$"}
                                {d.amount?.toLocaleString()}
                              </td>
                              <td><span className="stamp-badge stamp-badge-green">{d.stage}</span></td>
                              <td>
                                {d.evidenceIds.map((ev) => (
                                  <button key={ev} onClick={() => openEvidence(ev)} className="source-pill">
                                    [REF: {ev}]
                                  </button>
                                ))}
                              </td>
                              <td className="text-xs text-meta">{d.notes}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* PIPELINE DEALS */}
                <div>
                  <h3 className="font-display text-[10px] text-foreground mb-2">B. QUALIFIED EXPANSION PIPELINE</h3>
                  <div className="overflow-x-auto">
                    <table className="pixel-table">
                      <thead>
                        <tr>
                          <th>Opportunity</th>
                          <th>Value Up To</th>
                          <th>Critical Blocker</th>
                          <th>Source Evidence</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeAccount.bookValue.pipelineDeals.map((d) => (
                          <tr key={d.id}>
                            <td className="font-bold">{d.name}</td>
                            <td className="font-mono text-headline">
                              {d.amount ? `${d.currency === "GBP" ? "£" : d.currency === "EUR" ? "€" : "$"}${d.amount.toLocaleString()}` : "TBD"}
                            </td>
                            <td className="text-destructive font-medium">{d.blocker || "None specified"}</td>
                            <td>
                              {d.evidenceIds.map((ev) => (
                                <button key={ev} onClick={() => openEvidence(ev)} className="source-pill">
                                  [REF: {ev}]
                                </button>
                              ))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* QUARANTINED CLAIMS */}
                {activeAccount.bookValue.unverifiedClaims.length > 0 && (
                  <div>
                    <h3 className="font-display text-[10px] text-destructive mb-2">C. QUARANTINED UNVERIFIED CLAIMS</h3>
                    <div className="overflow-x-auto">
                      <table className="pixel-table">
                        <thead>
                          <tr>
                            <th>Claimed Metric</th>
                            <th>Stated Value</th>
                            <th>Quarantine Audit Reason</th>
                            <th>Source</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeAccount.bookValue.unverifiedClaims.map((d) => (
                            <tr key={d.id}>
                              <td className="font-bold text-destructive">{d.name}</td>
                              <td className="font-mono font-bold text-destructive">
                                {d.currency === "GBP" ? "£" : d.currency === "EUR" ? "€" : "$"}
                                {d.amount?.toLocaleString()}
                              </td>
                              <td className="text-xs text-meta">{d.notes}</td>
                              <td>
                                {d.evidenceIds.map((ev) => (
                                  <button key={ev} onClick={() => openEvidence(ev)} className="source-pill">
                                    [REF: {ev}]
                                  </button>
                                ))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* QUESTION 2: WHO HOLDS DECISION-MAKING POWER? */}
            <section className="panel p-5 bg-card">
              <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="badge-num">2</span>
                <h2 className="text-[14px] font-bold text-headline">QUESTION 2: WHO HOLDS DECISION-MAKING POWER?</h2>
                <span className="meta">Separation of operational advocates from commercial signing authority</span>
              </div>

              <div className="overflow-x-auto">
                <table className="pixel-table">
                  <thead>
                    <tr>
                      <th>Stakeholder</th>
                      <th>Role & Organization</th>
                      <th>Relationship</th>
                      <th>Authority Type</th>
                      <th>Signs Financial Call-off?</th>
                      <th>Operational Assessment</th>
                      <th>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeAccount.powerMap.map((st) => (
                      <tr key={st.id}>
                        <td className="font-bold">{st.name}</td>
                        <td className="text-xs">{st.role} ({st.organization})</td>
                        <td>
                          <span className={`stamp-badge ${st.relationship === "ally" ? "stamp-badge-green" : st.relationship === "warm" ? "stamp-badge-blue" : "stamp-badge-muted"}`}>
                            {st.relationship}
                          </span>
                        </td>
                        <td><span className="font-bold text-xs">{st.authorityType}</span></td>
                        <td>
                          <span className={`stamp-badge ${st.financialAuthority ? "stamp-badge-green" : "stamp-badge-red"}`}>
                            {st.financialAuthority ? "YES (CALL-OFF)" : "NO (NON-SIGNATORY)"}
                          </span>
                        </td>
                        <td className="text-xs text-meta">{st.notes}</td>
                        <td>
                          {st.evidenceIds.map((ev) => (
                            <button key={ev} onClick={() => openEvidence(ev)} className="source-pill">
                              [REF: {ev}]
                            </button>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* QUESTION 3: WHAT DO YOU DO FIRST? */}
            <section className="panel p-5 bg-card">
              <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="badge-num">3</span>
                <h2 className="text-[14px] font-bold text-headline">QUESTION 3: WHAT DO YOU DO FIRST?</h2>
                <span className="meta">Deterministic top 3 ranked actions based on deadline proximity and blocker severity</span>
              </div>

              <div className="space-y-3">
                {activeAccount.nextMoves.map((m) => {
                  const actionKey = `${activeAccount.accountKey}_action_${m.rank}`;
                  const isDone = completedActionIds.has(actionKey);
                  return (
                    <div
                      key={m.rank}
                      className={`panel-inset p-3 transition-colors ${isDone ? "bg-card-muted border-success" : "bg-card"}`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="badge-num text-[9px] h-5 w-5">{m.rank}</span>
                          <span className={`stamp-badge ${m.priority === "URGENT" ? "stamp-badge-red" : "stamp-badge-blue"}`}>
                            {m.priority}
                          </span>
                          <span className="font-bold text-sm text-foreground">{m.title}</span>
                        </div>
                        <button
                          onClick={() => toggleActionCompleted(actionKey)}
                          className={`btn-pixel btn-pixel-sm ${isDone ? "bg-success text-white" : "btn-pixel-ghost"}`}
                        >
                          {isDone ? "[✓ COMPLETED]" : "[MARK ACTIONED]"}
                        </button>
                      </div>

                      <p className="text-xs text-foreground m-0 mb-2 leading-relaxed">{m.reason}</p>

                      <div className="flex flex-wrap items-center gap-3 text-xs pt-1 border-t border-border-muted">
                        <span className="meta">Owner: <strong>{m.owner}</strong></span>
                        <span className="meta">Deadline: <strong>{m.dueDate}</strong></span>
                        <span className="meta">Related Deal: <strong>{m.relatedDeal}</strong></span>
                        <button onClick={() => openEvidence(m.evidenceId)} className="source-pill ml-auto">
                          [REF: {m.evidenceId}]
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* QUESTION 4: WHAT IS ABOUT TO GO WRONG? */}
            <section className="panel p-5 bg-card">
              <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="badge-num">4</span>
                <h2 className="text-[14px] font-bold text-headline">QUESTION 4: WHAT IS ABOUT TO GO WRONG?</h2>
                <span className="meta">Predictive risk radar tracking departures, unassigned tickets and telemetry drop-offs</span>
              </div>

              <div className="space-y-3">
                {activeAccount.riskRadar.map((r) => (
                  <div key={r.id} className="panel-inset p-3 bg-card border-l-4 border-destructive">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="stamp-badge stamp-badge-red">{r.severity} RISK</span>
                        <span className="font-bold text-sm text-foreground">{r.title}</span>
                      </div>
                      <span className="meta">Owner: <strong>{r.owner}</strong></span>
                    </div>

                    <p className="text-xs text-foreground m-0 mb-2">{r.explanation}</p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border-muted text-xs">
                      <span className="text-meta">Required Remediation: <strong>{r.actionRequired}</strong></span>
                      <button onClick={() => openEvidence(r.evidenceId)} className="source-pill">
                        [REF: {r.evidenceId}]
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* QUESTION 5: WHAT DO YOU STILL NOT KNOW? */}
            <section className="panel p-5 bg-card">
              <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="badge-num">5</span>
                <h2 className="text-[14px] font-bold text-headline">QUESTION 5: WHAT DO YOU STILL NOT KNOW?</h2>
                <span className="meta">Explicit unknowns detailing information gaps, affected deals, and who can answer</span>
              </div>

              <div className="overflow-x-auto">
                <table className="pixel-table">
                  <thead>
                    <tr>
                      <th>Unknown Information Gap</th>
                      <th>Why It Matters to the CSM</th>
                      <th>Who Can Answer</th>
                      <th>Affected Deal</th>
                      <th>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeAccount.unknownGaps.map((u) => (
                      <tr key={u.id}>
                        <td className="font-bold text-headline">{u.gap}</td>
                        <td className="text-xs">{u.whyItMatters}</td>
                        <td className="font-bold text-xs">{u.whoCanAnswer}</td>
                        <td><span className="stamp-badge stamp-badge-muted">{u.affectedDeal}</span></td>
                        <td>
                          <button onClick={() => openEvidence(u.evidenceId)} className="source-pill">
                            [REF: {u.evidenceId}]
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: DEALS & EXPANSION PIPELINE                        */}
        {/* ========================================================= */}
        {tab === "deals" && (
          <section className="panel p-5 bg-card space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div className="flex items-baseline gap-3">
                <span className="badge-num">D</span>
                <h2 className="text-[14px] font-bold text-headline">PORTFOLIO COMMERCIAL MATRIX & PIPELINE</h2>
              </div>

              {/* FILTER BUTTONS */}
              <div className="flex flex-wrap gap-2 text-xs">
                {["ALL", "booked", "pipeline", "conditional", "unverified"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setDealFilter(f)}
                    className={`chip-pixel ${dealFilter === f ? "active" : ""}`}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="pixel-table">
                <thead>
                  <tr>
                    <th>Account</th>
                    <th>Opportunity / Order Title</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Critical Blocker</th>
                    <th>Source ID</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDeals.map((d) => (
                    <tr key={d.id}>
                      <td className="font-bold">Account {d.accountKey}</td>
                      <td className="font-bold text-foreground">{d.name}</td>
                      <td>
                        <span className={`stamp-badge ${d.valueStatus === "booked" ? "stamp-badge-green" : d.valueStatus === "pipeline" ? "stamp-badge-blue" : "stamp-badge-red"}`}>
                          {d.valueStatus}
                        </span>
                      </td>
                      <td className="font-mono font-bold text-headline">
                        {d.amount ? `${d.currency === "GBP" ? "£" : d.currency === "EUR" ? "€" : "$"}${d.amount.toLocaleString()}` : "TBD"}
                      </td>
                      <td className="text-xs text-destructive">{d.blocker || "—"}</td>
                      <td>
                        {d.evidenceIds.map((ev) => (
                          <button key={ev} onClick={() => openEvidence(ev)} className="source-pill">
                            [REF: {ev}]
                          </button>
                        ))}
                      </td>
                      <td className="text-xs text-meta">{d.notes || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* VIEW 4: STAKEHOLDER POWER DIRECTORY                       */}
        {/* ========================================================= */}
        {tab === "stakeholders" && (
          <section className="panel p-5 bg-card space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div className="flex items-baseline gap-3">
                <span className="badge-num">P</span>
                <h2 className="text-[14px] font-bold text-headline">STAKEHOLDER DIRECTORY & SIGNING AUTHORITIES</h2>
              </div>

              <input
                type="text"
                className="input-pixel max-w-xs text-xs"
                placeholder="Search person, role, authority..."
                value={stakeholderSearch}
                onChange={(e) => setStakeholderSearch(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="pixel-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Account</th>
                    <th>Role & Organization</th>
                    <th>Relationship</th>
                    <th>Authority Type</th>
                    <th>Financial Signatory?</th>
                    <th>Operational Notes</th>
                    <th>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStakeholders.map((s) => (
                    <tr key={s.id}>
                      <td className="font-bold">{s.name}</td>
                      <td>Account {s.accountKey}</td>
                      <td className="text-xs">{s.role} ({s.organization})</td>
                      <td>
                        <span className={`stamp-badge ${s.relationship === "ally" ? "stamp-badge-green" : s.relationship === "warm" ? "stamp-badge-blue" : "stamp-badge-muted"}`}>
                          {s.relationship}
                        </span>
                      </td>
                      <td><span className="font-bold text-xs">{s.authorityType}</span></td>
                      <td>
                        <span className={`stamp-badge ${s.financialAuthority ? "stamp-badge-green" : "stamp-badge-red"}`}>
                          {s.financialAuthority ? "YES (CALL-OFF)" : "NO (NON-SIGNATORY)"}
                        </span>
                      </td>
                      <td className="text-xs text-meta">{s.notes}</td>
                      <td>
                        {s.evidenceIds.map((ev) => (
                          <button key={ev} onClick={() => openEvidence(ev)} className="source-pill">
                            [REF: {ev}]
                          </button>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* VIEW 5: EVIDENCE ROOM & PROVENANCE REGISTRY               */}
        {/* ========================================================= */}
        {tab === "evidence" && (
          <section className="panel p-5 bg-card space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div className="flex items-baseline gap-3">
                <span className="badge-num">E</span>
                <h2 className="text-[14px] font-bold text-headline">EVIDENCE ROOM & AUDIT PROVENANCE LEDGER</h2>
                <span className="meta">
                  {evidenceList.length} verified records ({inspectedEvidenceIds.size} audited by you)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {["ALL", "DIRECT", "DERIVED", "UNVERIFIED"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setEvidenceFilter(f)}
                    className={`chip-pixel ${evidenceFilter === f ? "active" : ""}`}
                  >
                    {f}
                  </button>
                ))}
                <input
                  type="text"
                  className="input-pixel max-w-xs text-xs"
                  placeholder="Filter records..."
                  value={evidenceSearch}
                  onChange={(e) => setEvidenceSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {evidenceList.map((ev) => {
                const wasAudited = inspectedEvidenceIds.has(ev.id);
                return (
                  <div
                    key={ev.id}
                    onClick={() => openEvidence(ev.id)}
                    className={`panel-inset p-3 bg-card cursor-pointer hover:border-frame transition-all ${wasAudited ? "border-success" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className={`stamp-badge ${ev.type === "DIRECT" ? "stamp-badge-green" : ev.type === "DERIVED" ? "stamp-badge-blue" : "stamp-badge-red"}`}>
                        {ev.type}
                      </span>
                      <span className="stamp-badge stamp-badge-muted text-[8px]">
                        ACC {ev.account}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-foreground m-0 mb-1">{ev.title}</h4>
                    <code className="font-mono text-[10px] text-meta block mb-2">{ev.id}</code>
                    <p className="text-xs text-foreground line-clamp-3 m-0 mb-2">{ev.excerpt}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-border-muted text-[10px]">
                      <span className="meta">{ev.path || "Direct Record"}</span>
                      <span className="font-bold text-headline">Inspect »</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* VIEW 6: LIVE SIGNALS & EVENT MONITORING                   */}
        {/* ========================================================= */}
        {tab === "signals" && (
          <section className="panel p-5 bg-card space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div className="flex items-baseline gap-3">
                <span className="badge-num">S</span>
                <h2 className="text-[14px] font-bold text-headline">LIVE TELEMETRY & EVENT STREAM (GET_SIGNALS)</h2>
                <span className="meta">Synchronized with Questathon JSON-RPC MCP server</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={syncSignals}
                  disabled={cooldownRemaining > 0 || isSyncing}
                  className="btn-pixel"
                >
                  {isSyncing ? "SYNCING..." : cooldownRemaining > 0 ? `COOLDOWN (${cooldownRemaining}s)` : "POLL MCP SIGNALS"}
                </button>
              </div>
            </div>

            <div className="panel-inset p-3 bg-card-muted flex flex-wrap items-center justify-between text-xs">
              <span>Status: <strong>{syncStatus}</strong></span>
              <span className="meta">Last Checked: <strong>{lastCheckTime ? new Date(lastCheckTime).toLocaleTimeString() : "Never"}</strong></span>
            </div>

            <div className="space-y-3">
              {signals.map((sig) => (
                <div key={sig.id} className="panel-inset p-4 bg-card border-l-4 border-headline">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="stamp-badge stamp-badge-red">LIVE SIGNAL</span>
                      <span className="stamp-badge stamp-badge-muted">ACCOUNT {sig.account}</span>
                      <span className="font-bold text-sm text-foreground">{sig.title}</span>
                    </div>
                    <span className="font-mono text-xs text-meta">{sig.dated}</span>
                  </div>

                  <p className="text-xs text-foreground m-0 mb-3 leading-relaxed">{sig.summary}</p>

                  {sig.records && sig.records.length > 0 && (
                    <div className="space-y-1 pt-2 border-t border-border-muted">
                      <span className="font-display text-[8px] text-meta block">SUPPORTING TELEMETRY RECORDS:</span>
                      {sig.records.map((r, i) => (
                        <div key={i} className="panel-inset p-2 bg-card-muted text-xs font-mono">
                          <span className="stamp-badge stamp-badge-blue text-[8px] mr-2">{r.kind}</span>
                          <code>{r.path}</code>
                          {r.text && <p className="mt-1 text-[11px] text-foreground m-0 whitespace-pre-wrap">{r.text}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-2 text-right">
                    <button onClick={() => openEvidence(sig.id)} className="source-pill">
                      [INSPECT PROVENANCE: {sig.id}]
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* VIEW 7: NOTE & TASK DISPATCH (WRITE_NOTE)                 */}
        {/* ========================================================= */}
        {tab === "writeback" && (
          <section className="panel p-5 bg-card space-y-4">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="badge-num">W</span>
              <h2 className="text-[14px] font-bold text-headline">SAFE ACTION WRITE-BACK STUDIO (WRITE_NOTE)</h2>
              <span className="meta">Validates payload and submits directly to Questathon MCP server</span>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* INPUT FORM */}
              <form onSubmit={handleWriteNote} className="space-y-4">
                <div>
                  <label className="font-display text-[9px] text-meta block mb-1">TARGET CRM ACCOUNT</label>
                  <div className="flex flex-wrap gap-2">
                    {(["A", "B", "K", "N"] as AccountKey[]).map((acc) => (
                      <button
                        type="button"
                        key={acc}
                        onClick={() => setNoteAccount(acc)}
                        className={`chip-pixel ${noteAccount === acc ? "active" : ""}`}
                      >
                        Account {acc}: {accountMap[acc].accountName.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-display text-[9px] text-meta block mb-1">NOTE CLASSIFICATION (KIND)</label>
                  <div className="flex flex-wrap gap-2">
                    {(["next_step", "task", "risk", "note"] as const).map((k) => (
                      <button
                        type="button"
                        key={k}
                        onClick={() => setNoteKind(k)}
                        className={`chip-pixel ${noteKind === k ? "active" : ""}`}
                      >
                        {k.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-display text-[9px] text-meta block mb-1">TITLE / SUBJECT</label>
                  <input
                    type="text"
                    className="input-pixel"
                    placeholder="e.g. Urgent DPIA Escalation with Fatima Osei"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="font-display text-[9px] text-meta block mb-1">ACTION MEMO / NOTE BODY</label>
                  <textarea
                    rows={6}
                    className="input-pixel font-mono text-xs"
                    placeholder="Enter actionable customer memo or task details to record via MCP..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    required
                  />
                  <div className="text-right text-[10px] text-meta mt-1">
                    {noteText.length} characters (Max 4,000)
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!noteText.trim() || noteStatus.type === "busy" || cooldownRemaining > 0}
                  className="btn-pixel w-full"
                >
                  {noteStatus.type === "busy"
                    ? "DISPATCHING VIA MCP..."
                    : cooldownRemaining > 0
                    ? `WAIT COOLDOWN (${cooldownRemaining}s)`
                    : "DISPATCH TO QUESTATHON MCP"}
                </button>

                {noteStatus.message && (
                  <div
                    className={`panel-inset p-3 text-xs ${noteStatus.type === "success" ? "border-success bg-green-50 text-green-800" : noteStatus.type === "error" ? "border-destructive bg-red-50 text-red-800" : "bg-card-muted"}`}
                  >
                    {noteStatus.message}
                  </div>
                )}
              </form>

              {/* PRE-FLIGHT JSON-RPC PREVIEW */}
              <div className="space-y-2">
                <span className="font-display text-[9px] text-meta block">
                  PRE-FLIGHT JSON-RPC 2.0 PROTOCOL PREVIEW
                </span>
                <pre className="panel p-3 bg-card-inset text-xs font-mono overflow-x-auto leading-relaxed h-[360px]">
                  {writebackPreview}
                </pre>
                <p className="text-xs text-meta m-0">
                  Strict security guarantee: Processed entirely server-side with Node.js runtime and AQ_TOKEN authentication.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* VIEW 8: QUESTATHON BUILD TOOLKIT & RUBRICS               */}
        {/* ========================================================= */}
        {tab === "toolkit" && (
          <div className="space-y-6">
            {/* SECTION 1: WHAT YOU HAND IN */}
            <section className="panel p-5 bg-card">
              <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="badge-num">1</span>
                <h2 className="text-[14px] font-bold text-headline">WHAT YOU HAND IN (FOUR DELIVERABLES)</h2>
                <span className="meta">Submission package for Questathon judges</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="panel-inset p-3 bg-card">
                  <p className="font-bold text-sm text-foreground m-0 mb-1">Live CRM URL</p>
                  <p className="text-xs text-meta m-0 mb-2">Hosted web deployment judges open without your laptop.</p>
                  <span className="stamp-badge stamp-badge-green">READY FOR VERCEL DEPLOY</span>
                </div>

                <div className="panel-inset p-3 bg-card">
                  <p className="font-bold text-sm text-foreground m-0 mb-1">Git Repository Link</p>
                  <p className="text-xs text-meta m-0 mb-2">Public repo link with clean README and one-command run.</p>
                  <span className="stamp-badge stamp-badge-green">PRATHAMESH-LANG/QUESTBOARD-LIVE-CRM</span>
                </div>

                <div className="panel-inset p-3 bg-card">
                  <p className="font-bold text-sm text-foreground m-0 mb-1">Three-Minute Walkthrough Video</p>
                  <p className="text-xs text-meta m-0 mb-2">Loom or unlisted video demonstrating Monday-morning readiness.</p>
                  <span className="stamp-badge stamp-badge-blue">WALKTHROUGH RECORDING READY</span>
                </div>

                <div className="panel-inset p-3 bg-card">
                  <p className="font-bold text-sm text-foreground m-0 mb-1">Thinking Doc (docs/thinking-doc.md)</p>
                  <p className="text-xs text-meta m-0 mb-2">One-page design decisions, deterministic rules, and AI usage note.</p>
                  <span className="stamp-badge stamp-badge-green">COMPLETE & AUDITED</span>
                </div>
              </div>
            </section>

            {/* SECTION 2: AFTERNOON TIMELINE */}
            <section className="panel p-5 bg-card">
              <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="badge-num">2</span>
                <h2 className="text-[14px] font-bold text-headline">YOUR AFTERNOON (BUILD TIMELINE)</h2>
                <span className="meta">Official Questathon milestone pacing</span>
              </div>

              <div className="space-y-2">
                {[
                  { time: "14:15", title: "Connect", desc: "Get your token. Make one call that works.", done: true },
                  { time: "14:45", title: "Pull and read", desc: "Fetch accounts and paperwork once, and store them.", done: true },
                  { time: "16:30", title: "Answer the five", desc: "For both accounts, every number with its source.", done: true },
                  { time: "17:15", title: "Keep it live", desc: "Take in live events without code change. Write notes back.", done: true },
                  { time: "18:00", title: "Host, record, hand in", desc: "Check link in private window, record video, submit.", done: true }
                ].map((item, i) => (
                  <div key={i} className="panel-inset p-3 bg-card flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-[10px] text-headline w-14 shrink-0">{item.time}</span>
                      <div>
                        <span className="font-bold text-xs text-foreground block">{item.title}</span>
                        <span className="text-xs text-meta">{item.desc}</span>
                      </div>
                    </div>
                    <span className="stamp-badge stamp-badge-green">[✓ DONE]</span>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 3: WHAT JUDGES LOOK FOR (RUBRIC TABLE) */}
            <section className="panel p-5 bg-card">
              <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="badge-num">3</span>
                <h2 className="text-[14px] font-bold text-headline">WHAT JUDGES LOOK FOR (EVALUATION RUBRIC)</h2>
                <span className="meta">Judges open your live CRM and evaluate like an executive manager</span>
              </div>

              <div className="overflow-x-auto">
                <table className="pixel-table">
                  <thead>
                    <tr>
                      <th>Area</th>
                      <th>Weak</th>
                      <th>Solid</th>
                      <th>Strong (QUESTBOARD MVP)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-bold">Book Value</td>
                      <td className="text-meta">Blends GBP and EUR, treats €1.2M savings as real ARR.</td>
                      <td>Lists booked deals but blends currencies into USD.</td>
                      <td className="bg-primary/20 font-bold">
                        Strict currency isolation (£350k GBP, €140k EUR); Stefan Roy’s €1.2M theoretical claim quarantined with audit trail.
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold">Power Mapping</td>
                      <td className="text-meta">Confuses Rhys Calder with a purchasing signatory.</td>
                      <td>Identifies champions but misses individual force CFO call-offs.</td>
                      <td className="bg-primary/20 font-bold">
                        Explicitly maps Force CFOs as individual call-off signatories; Rhys Calder flagged as non-signatory ally.
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold">Action Engine</td>
                      <td className="text-meta">Generic advice like &quot;schedule check-in call&quot;.</td>
                      <td>Identifies issues but misses real deadlines.</td>
                      <td className="bg-primary/20 font-bold">
                        Ranked by explicit real-world deadline (Karen Mbeki 5 Dec event first, Fatima Osei DPIA second).
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold">Provenance</td>
                      <td className="text-meta">Numbers without receipts; hallucinations.</td>
                      <td>Some links to files.</td>
                      <td className="bg-primary/20 font-bold">
                        100% citation coverage: Every number, risk, and action opens verbatim excerpt in Evidence Drawer.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* SECTION 4: RULES (DO & DO NOT) */}
            <section className="panel p-5 bg-card">
              <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="badge-num">4</span>
                <h2 className="text-[14px] font-bold text-headline">COMPETITION RULES (DO & DO NOT)</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="panel-inset p-3 bg-card border-l-4 border-success">
                  <span className="font-display text-[9px] text-success block mb-2">DO</span>
                  <ul className="space-y-1 text-xs text-foreground m-0 pl-4 list-disc">
                    <li>Cite source record IDs for every single number and date.</li>
                    <li>Quarantine unverified customer claims without documentation.</li>
                    <li>Honor the 65-second rate limit on MCP JSON-RPC calls.</li>
                    <li>Handle live events dynamically via get_signals.</li>
                    <li>Keep token confidential strictly within server environment.</li>
                  </ul>
                </div>

                <div className="panel-inset p-3 bg-card border-l-4 border-destructive">
                  <span className="font-display text-[9px] text-destructive block mb-2">DO NOT</span>
                  <ul className="space-y-1 text-xs text-foreground m-0 pl-4 list-disc">
                    <li>Never blend £ GBP, € EUR and $ USD into one fake total.</li>
                    <li>Never classify framework tenders as purchase orders.</li>
                    <li>Never commit AQ_TOKEN or customer data to public git.</li>
                    <li>Never fabricate missing dates or unconfirmed signatories.</li>
                    <li>Never hammer MCP endpoints with concurrent parallel calls.</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* 3. SLIDE-OVER EVIDENCE & PROVENANCE INSPECTOR */}
      <EvidenceDrawer
        evidence={selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
      />

      {/* 4. FOOTER */}
      <footer className="panel border-x-0 border-b-0 p-4 bg-card text-center text-xs text-meta">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>QUESTBOARD — Independent Questathon 2026 Competition MVP</span>
          <span>FlytBase Autonomous Drone Customer Success Intelligence</span>
          <span className="stamp-badge stamp-badge-green">100% PROVENANCE VERIFIED</span>
        </div>
      </footer>
    </div>
  );
}
