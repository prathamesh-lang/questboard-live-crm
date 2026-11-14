import { NextResponse } from "next/server";
import { callMcpTool } from "@/lib/mcp";
import { assertMcpWindow, releaseMcpWindow } from "@/lib/rate-limit";
import { baselineSignals } from "@/lib/data/curated-data";
import { SignalItem } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const gate = assertMcpWindow();
  if (!gate.allowed) {
    return NextResponse.json(
      {
        error: gate.reason,
        retryAfterMs: gate.retryAfterMs
      },
      { status: 429 }
    );
  }

  try {
    const rawResult = await callMcpTool<any>("get_signals");
    const rawSignals: SignalItem[] = Array.isArray(rawResult)
      ? rawResult
      : (rawResult?.signals ?? []);

    // Deduplicate by actual ID, preserving baseline signals
    const signalMap = new Map<string, SignalItem>();
    for (const b of baselineSignals) {
      signalMap.set(b.id, b);
    }
    for (const s of rawSignals) {
      if (s && s.id) {
        signalMap.set(s.id, { ...signalMap.get(s.id), ...s });
      }
    }

    const merged = Array.from(signalMap.values());

    return NextResponse.json({
      signals: merged,
      checkedAt: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Live signal sync failed",
        checkedAt: new Date().toISOString()
      },
      { status: 502 }
    );
  } finally {
    releaseMcpWindow();
  }
}
