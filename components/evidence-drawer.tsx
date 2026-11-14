"use client";
import React from "react";
import { EvidenceRecord } from "@/lib/types";

interface Props {
  evidence: EvidenceRecord | null;
  onClose: () => void;
}

export default function EvidenceDrawer({ evidence, onClose }: Props) {
  if (!evidence) return null;

  const typeBadgeClass =
    evidence.type === "DIRECT"
      ? "stamp-badge stamp-badge-green"
      : evidence.type === "DERIVED"
      ? "stamp-badge stamp-badge-blue"
      : "stamp-badge stamp-badge-red";

  const accountLabel =
    evidence.account === "A"
      ? "Eastern Counties (A)"
      : evidence.account === "B"
      ? "Aldermoor (B)"
      : evidence.account === "K"
      ? "Kestrel Estates (K)"
      : "Brindle Harbour (N)";

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside
        className="drawer-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Evidence Inspector"
      >
        {/* DRAWER TOP BAR */}
        <div className="panel flex items-center justify-between border-x-0 border-t-0 p-4 bg-card-muted">
          <div>
            <span className="font-display text-[9px] text-headline tracking-widest block mb-1">
              PROVENANCE INSPECTOR
            </span>
            <h3 className="font-bold text-sm text-foreground m-0">{evidence.title}</h3>
          </div>
          <button
            className="btn-pixel btn-pixel-ghost text-xs px-3 py-1 font-bold ml-2"
            onClick={onClose}
            aria-label="Close drawer"
          >
            [X] CLOSE
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* META GRID */}
          <div className="grid grid-cols-2 gap-3">
            <div className="panel-inset p-3 bg-card">
              <span className="font-display text-[8px] text-meta block mb-1">SOURCE ID</span>
              <code className="font-mono text-xs font-bold text-foreground break-all">{evidence.id}</code>
            </div>

            <div className="panel-inset p-3 bg-card">
              <span className="font-display text-[8px] text-meta block mb-1">CLASSIFICATION</span>
              <span className={typeBadgeClass}>{evidence.type} EVIDENCE</span>
            </div>

            <div className="panel-inset p-3 bg-card">
              <span className="font-display text-[8px] text-meta block mb-1">ACCOUNT</span>
              <span className="font-sans text-xs font-bold text-foreground">{accountLabel}</span>
            </div>

            {evidence.timestamp && (
              <div className="panel-inset p-3 bg-card">
                <span className="font-display text-[8px] text-meta block mb-1">DOCUMENT DATE</span>
                <span className="font-mono text-xs font-bold text-foreground">{evidence.timestamp}</span>
              </div>
            )}
          </div>

          {/* PATH */}
          {evidence.path && (
            <div className="space-y-1">
              <span className="font-display text-[9px] text-meta block">REPOSITORY FILE PATH</span>
              <div className="panel-inset p-2 bg-card">
                <code className="font-mono text-xs text-foreground break-all">{evidence.path}</code>
              </div>
            </div>
          )}

          {/* FORMULA */}
          {evidence.formula && (
            <div className="space-y-1">
              <span className="font-display text-[9px] text-meta block">CALCULATION FORMULA & INPUTS</span>
              <div className="panel-inset p-3 bg-card space-y-2">
                <p className="font-mono text-xs text-foreground m-0">{evidence.formula}</p>
                {evidence.sourceIds && evidence.sourceIds.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {evidence.sourceIds.map((s) => (
                      <span key={s} className="stamp-badge stamp-badge-muted text-[8px]">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VERBATIM EXCERPT */}
          <div className="space-y-1">
            <span className="font-display text-[9px] text-meta block">VERBATIM RECORD EXCERPT</span>
            <pre className="panel border-2 border-ink p-3 bg-card text-xs font-mono whitespace-pre-wrap leading-relaxed m-0 max-h-72 overflow-y-auto">
              {evidence.excerpt}
            </pre>
          </div>

          {/* AUDIT NOTE */}
          <div className="panel-dashed p-3 text-xs leading-relaxed">
            <strong className="text-headline block font-display text-[9px] mb-1">
              JUDGING AUDIT RULE
            </strong>
            Every numerical claim, action deadline, and risk in QUESTBOARD traces directly to verified MCP records. Unsupported customer claims are strictly quarantined as UNVERIFIED.
          </div>
        </div>
      </aside>
    </div>
  );
}
