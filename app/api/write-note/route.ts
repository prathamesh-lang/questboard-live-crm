import { NextRequest, NextResponse } from "next/server";
import { callMcpTool } from "@/lib/mcp";
import { assertMcpWindow } from "@/lib/rate-limit";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.text !== "string" || !body.text.trim()) {
    return NextResponse.json({ error: "A non-empty note is required." }, { status: 400 });
  }
  const gate = assertMcpWindow();
  if (!gate.allowed) return NextResponse.json({ error: "MCP rate limit: wait before the next MCP call.", retryAfterMs: gate.retryAfterMs }, { status: 429 });
  try {
    const result = await callMcpTool("write_note", {
      text: body.text.trim(),
      ...(body.account ? { account: body.account } : {}),
      ...(body.kind ? { kind: body.kind } : {}),
      ...(body.title ? { title: body.title } : {})
    });
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Note write failed" }, { status: 502 });
  }
}
