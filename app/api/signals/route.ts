import { NextResponse } from "next/server";
import { callMcpTool } from "@/lib/mcp";
import { assertMcpWindow } from "@/lib/rate-limit";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  const gate = assertMcpWindow();
  if (!gate.allowed) return NextResponse.json({ error: "MCP rate limit: one call per minute.", retryAfterMs: gate.retryAfterMs }, { status: 429 });
  try {
    const signals = await callMcpTool("get_signals");
    return NextResponse.json({ signals, checkedAt: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Signal sync failed" }, { status: 502 });
  }
}
