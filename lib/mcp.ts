const MCP_URL = "https://questathon.aihackerscollective.com/api/public/mcp";

export async function callMcpTool<T = unknown>(name: string, args: Record<string, unknown> = {}): Promise<T> {
  const token = process.env.AQ_TOKEN;
  if (!token) throw new Error("AQ_TOKEN is not configured on the server.");
  const response = await fetch(MCP_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json, text/event-stream",
      authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: { name, arguments: args }
    }),
    cache: "no-store"
  });
  const raw = await response.text();
  if (!response.ok) throw new Error(`MCP HTTP ${response.status}: ${raw.slice(0, 400)}`);
  let packet: any;
  try {
    packet = JSON.parse(raw);
  } catch {
    const dataLine = raw.split("\n").find(line => line.startsWith("data:"));
    if (!dataLine) throw new Error(`MCP returned an unreadable response: ${raw.slice(0, 400)}`);
    packet = JSON.parse(dataLine.slice(5).trim());
  }
  if (packet.error || packet.result?.isError) {
    const message = packet.error?.message ?? packet.result?.content?.[0]?.text ?? "Unknown MCP error";
    throw new Error(message);
  }
  const text = packet.result?.content?.find((item: any) => item.type === "text")?.text;
  if (typeof text === "string") {
    try { return JSON.parse(text) as T; } catch { return text as T; }
  }
  return packet.result as T;
}
