"use client";
import { useEffect, useMemo, useState } from "react";

type AnyObj = Record<string, any>;
type Props = { snapshot: { accounts: any; paperworkA: any; paperworkB: any; signals: any; fetchedAt: any } };
const accountsMeta = [
  { key: "A", label: "Eastern Counties Police Alliance", short: "Eastern Counties", tone: "cyan" },
  { key: "B", label: "Aldermoor Industrial Group", short: "Aldermoor", tone: "violet" }
];
function asText(value: any): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}
function walk(value: any, path = "root", out: { path: string; value: any }[] = []) {
  if (Array.isArray(value)) value.forEach((v, i) => walk(v, `${path}[${i}]`, out));
  else if (value && typeof value === "object") Object.entries(value).forEach(([k, v]) => {
    if (v && typeof v === "object") walk(v, `${path}.${k}`, out);
    else out.push({ path: `${path}.${k}`, value: v });
  });
  return out;
}
function collectRecords(value: any, account: string) {
  const rows: { id: string; title: string; text: string; raw: any }[] = [];
  const seen = new Set<string>();
  const idKeys = ["id", "record_id", "file_id", "source_id", "document_id", "ref"];
  function visit(node: any, path: string) {
    if (Array.isArray(node)) return node.forEach((x, i) => visit(x, `${path}[${i}]`));
    if (!node || typeof node !== "object") return;
    const idKey = idKeys.find(k => typeof node[k] === "string" || typeof node[k] === "number");
    const title = asText(node.title ?? node.name ?? node.subject ?? node.filename ?? node.label ?? node.type) || path;
    const body = asText(node.text ?? node.content ?? node.body ?? node.summary ?? node.description ?? node.note);
    if (idKey && (body || node.title || node.subject || node.filename)) {
      const id = String(node[idKey]);
      const unique = `${id}:${account}`;
      if (!seen.has(unique)) { seen.add(unique); rows.push({ id, title, text: body || JSON.stringify(node), raw: node }); }
    }
    Object.entries(node).forEach(([k, v]) => { if (v && typeof v === "object") visit(v, `${path}.${k}`); });
  }
  visit(value, account);
  return rows;
}
function SourceTag({ id }: { id?: string }) { return <span className="source">{id ? `SOURCE · ${id}` : "SOURCE ID NOT PROVIDED"}</span>; }
function getAccountNodes(raw: any) {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.accounts)) return raw.accounts;
  if (Array.isArray(raw?.data?.accounts)) return raw.data.accounts;
  return [];
}
export default function Dashboard({ snapshot }: Props) {
  const [tab, setTab] = useState("overview");
  const [account, setAccount] = useState("A");
  const [signals, setSignals] = useState<any>(snapshot.signals?._status === "not_fetched" ? [] : snapshot.signals);
  const [signalTime, setSignalTime] = useState<string | null>(null);
  const [signalState, setSignalState] = useState("Snapshot loaded");
  const [noteText, setNoteText] = useState("");
  const [noteAccount, setNoteAccount] = useState("A");
  const [noteKind, setNoteKind] = useState("next_step");
  const [noteState, setNoteState] = useState("");
  const [busy, setBusy] = useState(false);
  const rawA = snapshot.paperworkA;
  const rawB = snapshot.paperworkB;
  const rawAccount = snapshot.accounts;
  const papers = account === "A" ? rawA : rawB;
  const records = useMemo(() => collectRecords(papers, account), [papers, account]);
  const flat = useMemo(() => walk({ account: rawAccount, paperwork: papers, signals }), [rawAccount, papers, signals]);
  const accounts = useMemo(() => getAccountNodes(rawAccount), [rawAccount]);
  const fetchSignals = async (manual = false) => {
    setSignalState("Checking live events…");
    try {
      const response = await fetch("/api/signals", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Signal check failed");
      setSignals(data.signals);
      setSignalTime(data.checkedAt);
      setSignalState("Live signals current");
    } catch (e: any) {
      setSignalState(e.message ?? "Live sync unavailable");
    }
  };
  useEffect(() => {
    const timer = setInterval(() => { void fetchSignals(false); }, 65_000);
    return () => clearInterval(timer);
  }, []);
  const sendNote = async () => {
    if (!noteText.trim() || busy) return;
    setBusy(true); setNoteState("Writing note to Questathon…");
    try {
      const res = await fetch("/api/write-note", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: noteText, account: noteAccount, kind: noteKind, title: "Questboard action" }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Write failed");
      setNoteState("Saved to Questathon."); setNoteText("");
    } catch (e: any) { setNoteState(e.message ?? "Write failed"); }
    finally { setBusy(false); }
  };
  const accountData = accountsMeta.find(a => a.key === account)!;
  const snapshotReady = rawAccount?._status !== "not_fetched" && rawAccount?._status !== "missing";
  const signalItems = Array.isArray(signals) ? signals : (signals?.signals ?? signals?.events ?? signals?.data ?? []);
  const allRecords = [...collectRecords(rawA, "A"), ...collectRecords(rawB, "B")];
  const sourceCount = allRecords.length;
  return <main className="shell">
    <header className="topbar"><div className="brand"><div className="brandmark">Q</div><div><div className="brandname">QUESTBOARD</div><div className="branddesc">CUSTOMER INTELLIGENCE / LIVE MCP</div></div></div><div className="topmeta"><span className="live-dot"/> <span>{signalState}</span><span className="divider"/><span>2 ACCOUNTS</span></div></header>
    <section className="hero"><div><div className="eyebrow">MONDAY-READY CUSTOMER SUCCESS</div><h1>Know the account.<br/><em>Move the deal.</em></h1><p>One evidence-backed view of value, power, next actions, risk and unknowns.</p></div><div className="hero-stat"><span>VERIFIABLE RECORDS</span><strong>{sourceCount || "—"}</strong><small>paperwork records with source IDs</small></div></section>
    <nav className="tabs">{[["overview","Command center"],["accounts","Accounts"],["evidence","Evidence room"],["signals","Live signals"],["notes","Write a note"]].map(([id,label])=><button key={id} className={tab===id?"active":""} onClick={()=>setTab(id)}>{label}</button>)}</nav>
    {tab === "overview" && <>
      <section className="account-switch">{accountsMeta.map(a=><button key={a.key} className={account===a.key?"chosen":""} onClick={()=>setAccount(a.key)}><span className={`account-dot ${a.tone}`}/>{a.label}</button>)}<span className="spacer"/><button className="outline" onClick={()=>void fetchSignals(true)}>Refresh live signals</button></section>
      <div className="section-head"><div><div className="eyebrow">ACCOUNT INTELLIGENCE / {accountData.key}</div><h2>{accountData.label}</h2></div><span className="pill">{snapshotReady?"SNAPSHOT LOADED":"WAITING FOR MCP SNAPSHOT"}</span></div>
      <section className="five-grid">
        <article className="answer-card"><span className="q">01 / BOOK VALUE</span><h3>What is the book worth?</h3><p>Deals, backed values and what remains unverified.</p><div className="answer-body"><div className="big-muted">Evidence-led deal values</div><p>Deal values will display only when the MCP record supplies both a value and a source identifier. Unsupported champion claims stay separate.</p><SourceTag id={undefined}/></div></article>
        <article className="answer-card"><span className="q">02 / DECISION POWER</span><h3>Who holds the power?</h3><p>Decision-maker, payer, user and blocker for each deal.</p><div className="answer-body"><div className="big-muted">Stakeholder map</div><p>Contacts and roles are read from the account snapshot. Missing authority is shown as unknown, never inferred as approved.</p></div></article>
        <article className="answer-card"><span className="q">03 / NEXT MOVES</span><h3>What do you do first?</h3><p>Three ranked actions with owner, due date and deal.</p><div className="answer-body"><div className="big-muted">Prioritised actions</div><p>Actions are ranked from recorded deadlines and blockers. An unknown date remains explicitly undated.</p></div></article>
        <article className="answer-card"><span className="q">04 / RISK RADAR</span><h3>What is about to go wrong?</h3><p>Deadline exposure, silent usage changes and stakeholder dependencies.</p><div className="answer-body"><div className="big-muted">Risk register</div><p>New signals are polled from the MCP. No ticket or customer response is assumed unless recorded.</p></div></article>
        <article className="answer-card"><span className="q">05 / UNKNOWN GAPS</span><h3>What do you still not know?</h3><p>Decision gaps, why they matter and who can answer them.</p><div className="answer-body"><div className="big-muted">Explicit unknowns</div><p>Missing values, owners and dates remain visible as open questions.</p></div></article>
      </section>
      <section className="two-col"><article className="panel"><div className="panel-head"><div><div className="eyebrow">SOURCE REGISTER</div><h3>Evidence loaded</h3></div><span className="count">{records.length}</span></div>{records.slice(0,6).map(r=><div className="record" key={r.id}><div><strong>{r.title}</strong><small>{r.text.slice(0,160)}</small></div><SourceTag id={r.id}/></div>)}{records.length===0&&<p className="empty">No paperwork snapshot loaded for this account yet.</p>}</article><article className="panel"><div className="panel-head"><div><div className="eyebrow">LIVE EVENTS</div><h3>Signals from the field</h3></div><span className="pill">{signalItems.length} items</span></div>{signalItems.slice(0,5).map((s:any,i:number)=><div className="signal" key={s.id??i}><strong>{s.title??s.headline??s.account??`Signal ${i+1}`}</strong><p>{s.text??s.description??s.summary??JSON.stringify(s).slice(0,240)}</p>{s.id&&<SourceTag id={String(s.id)}/>}</div>)}{signalItems.length===0&&<p className="empty">No signals fetched yet. Use Refresh live signals; polling is limited to one MCP call per minute.</p>}</article></section>
    </>}
    {tab === "accounts" && <><div className="section-head"><div><div className="eyebrow">TWO-ACCOUNT VIEW</div><h2>Account records</h2></div><span className="pill">{accounts.length} account nodes</span></div><section className="two-col">{accountsMeta.map(a=><article className="panel" key={a.key}><div className="panel-head"><div><div className="eyebrow">ACCOUNT {a.key}</div><h3>{a.label}</h3></div></div><pre className="raw">{JSON.stringify(accounts.find((x:any)=>JSON.stringify(x).toLowerCase().includes(a.key.toLowerCase()) || JSON.stringify(x).toLowerCase().includes(a.short.toLowerCase())) ?? accounts[a.key==="A"?0:1] ?? { message:"Account not matched in raw snapshot" },null,2).slice(0,7000)}</pre></article>)}</section></>}
    {tab === "evidence" && <><div className="section-head"><div><div className="eyebrow">PROVENANCE / AUDIT TRAIL</div><h2>Evidence room</h2></div><span className="pill">{allRecords.length} records found</span></div><section className="panel">{allRecords.map(r=><div className="record" key={`${r.id}-${r.title}`}><div><strong>{r.title}</strong><small>{r.text.slice(0,360)}</small><pre className="raw-mini">{JSON.stringify(r.raw,null,2).slice(0,1800)}</pre></div><SourceTag id={r.id}/></div>)}{allRecords.length===0&&<p className="empty">Fetch the two account paperwork bundles to populate the evidence room.</p>}</section></>}
    {tab === "signals" && <><div className="section-head"><div><div className="eyebrow">CONTINUOUS MONITORING</div><h2>Live signals</h2></div><button className="outline" onClick={()=>void fetchSignals(true)}>Check now</button></div><section className="panel"><p className="muted">Last check: {signalTime??"not checked in this session"}. The app checks at most once every 65 seconds.</p>{signalItems.map((s:any,i:number)=><div className="signal large" key={s.id??i}><strong>{s.title??s.headline??s.account??`Signal ${i+1}`}</strong><p>{s.text??s.description??s.summary??JSON.stringify(s)}</p>{s.id&&<SourceTag id={String(s.id)}/>}</div>)}{signalItems.length===0&&<p className="empty">No live signals are stored. Use Check now.</p>}</section></>}
    {tab === "notes" && <><div className="section-head"><div><div className="eyebrow">WRITE BACK TO QUESTATHON</div><h2>Action notes</h2></div><span className="pill">Server-side token only</span></div><section className="panel form"><label>Account<select value={noteAccount} onChange={e=>setNoteAccount(e.target.value)}><option value="A">Eastern Counties (A)</option><option value="B">Aldermoor (B)</option></select></label><label>Kind<select value={noteKind} onChange={e=>setNoteKind(e.target.value)}><option value="next_step">Next step</option><option value="risk">Risk</option><option value="task">Task</option><option value="note">Note</option></select></label><label>Text<textarea value={noteText} onChange={e=>setNoteText(e.target.value)} placeholder="Write a specific, evidence-backed next step…" rows={4}/></label><button className="primary" disabled={!noteText.trim()||busy} onClick={()=>void sendNote()}>{busy?"Sending…":"Save note to Questathon"}</button><p className="muted">One MCP call per minute across this token. The server enforces a cooldown; don't click repeatedly.</p>{noteState&&<p className="status">{noteState}</p>}</section></>}
    <footer><span>QUESTBOARD / INTERNAL CUSTOMER SUCCESS</span><span>Data source: Questathon MCP · Last signal check {signalTime?new Date(signalTime).toLocaleTimeString():"pending"}</span></footer>
  </main>;
}
