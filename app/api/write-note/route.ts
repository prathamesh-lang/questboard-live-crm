import { NextRequest, NextResponse } from "next/server";
import { callMcpTool } from "@/lib/mcp";
import { assertMcpWindow, releaseMcpWindow } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.text !== "string" || !body.text.trim()) {
    return NextResponse.json({ error: "A non-empty note text is required." }, { status: 400 });
  }

  const validAccounts = ["A", "B", "K", "N"];
  const account = validAccounts.includes(body.account) ? body.account : "A";
  const validKinds = ["next_step", "task", "risk", "note"];
  const kind = validKinds.includes(body.kind) ? body.kind : "next_step";
  const title = typeof body.title === "string" && body.title.trim() ? body.title.trim() : `Questboard ${kind}`;

  const gate = assertMcpWindow();
  if (!gate.allowed) {
    return NextResponse.json(
      { error: gate.reason, retryAfterMs: gate.retryAfterMs },
      { status: 429 }
    );
  }

  try {
    const result = await callMcpTool("write_note", {
      text: body.text.trim(),
      account,
      kind,
      title
    });
    return NextResponse.json({
      success: true,
      result,
      savedAt: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Note write operation failed" },
      { status: 502 }
    );
  } finally {
    releaseMcpWindow();
  }
}
