import fs from "node:fs";
import path from "node:path";
import {
  accountAQuestions,
  accountBQuestions,
  accountKQuestions,
  accountNQuestions,
  baselineSignals,
  evidenceRegistry
} from "./data/curated-data";
import { SignalItem } from "./types";

const dataDir = path.join(process.cwd(), "data");

function readJson<T = any>(name: string): T | null {
  try {
    const filePath = path.join(dataDir, name);
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
  } catch {
    return null;
  }
}

export function getSnapshot() {
  const accountsRaw = readJson("accounts.json");
  const paperworkARaw = readJson("paperwork-A.json");
  const paperworkBRaw = readJson("paperwork-B.json");
  const signalsRaw = readJson<{ signals?: SignalItem[] } | SignalItem[]>("signals.json");
  const fetchedAtRaw = readJson<{ fetchedAt: string }>("fetched-at.json");

  // Merge any raw signals with baseline signals, deduplicating by id
  const rawSignalList: SignalItem[] = Array.isArray(signalsRaw)
    ? signalsRaw
    : (signalsRaw?.signals ?? []);

  const signalMap = new Map<string, SignalItem>();
  // Start with baseline signals so all 3 critical event scenarios exist
  for (const s of baselineSignals) {
    signalMap.set(s.id, s);
  }
  // Overlay any newer or fetched signals
  for (const s of rawSignalList) {
    if (s && s.id) {
      signalMap.set(s.id, { ...signalMap.get(s.id), ...s });
    }
  }

  const mergedSignals = Array.from(signalMap.values());

  return {
    isLocalSnapshot: accountsRaw !== null,
    accounts: accountsRaw ?? { accounts: [accountAQuestions, accountBQuestions] },
    paperworkA: paperworkARaw ?? { account: "A", records: [] },
    paperworkB: paperworkBRaw ?? { account: "B", records: [] },
    signals: mergedSignals,
    fetchedAt: fetchedAtRaw ?? { fetchedAt: new Date().toISOString() },
    curated: {
      accountA: accountAQuestions,
      accountB: accountBQuestions,
      accountK: accountKQuestions,
      accountN: accountNQuestions,
      evidence: evidenceRegistry
    }
  };
}
