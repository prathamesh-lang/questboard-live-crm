import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const envPath = path.join(root, '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}
const token = process.env.AQ_TOKEN;
if (!token || token.includes('replace_with')) {
  console.error('Missing AQ_TOKEN. Create .env.local from .env.example and set the token there. Do not paste it into chat or commit it.');
  process.exit(1);
}
const url = 'https://questathon.aihackerscollective.com/api/public/mcp';
const dataDir = path.join(root, 'data');
fs.mkdirSync(dataDir, { recursive: true });
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function callTool(name, args = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream', authorization: `Bearer ${token}` },
    body: JSON.stringify({ jsonrpc: '2.0', id: Date.now(), method: 'tools/call', params: { name, arguments: args } })
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}: ${text.slice(0, 500)}`);
  let payload;
  try { payload = JSON.parse(text); }
  catch {
    const line = text.split('\n').find(x => x.startsWith('data:'));
    if (!line) throw new Error(`${name}: unreadable response ${text.slice(0, 500)}`);
    payload = JSON.parse(line.slice(5).trim());
  }
  if (payload.error || payload.result?.isError) throw new Error(payload.error?.message ?? payload.result?.content?.[0]?.text ?? `${name} failed`);
  const resultText = payload.result?.content?.find(x => x.type === 'text')?.text;
  if (typeof resultText === 'string') {
    try { return JSON.parse(resultText); } catch { return resultText; }
  }
  return payload.result;
}
const jobs = [
  ['get_my_accounts', {}, 'accounts.json'],
  ['get_all_paperwork', { account: 'A' }, 'paperwork-A.json'],
  ['get_all_paperwork', { account: 'B' }, 'paperwork-B.json'],
  ['get_signals', {}, 'signals.json'],
  ['get_data_format', {}, 'data-format.json']
];
for (let i = 0; i < jobs.length; i++) {
  const [tool, args, filename] = jobs[i];
  if (i > 0) {
    console.log('Rate limit: waiting 61 seconds before the next MCP call...');
    await sleep(61_000);
  }
  console.log(`Fetching ${tool}...`);
  const result = await callTool(tool, args);
  fs.writeFileSync(path.join(dataDir, filename), JSON.stringify(result, null, 2));
  console.log(`Saved data/${filename}`);
}
fs.writeFileSync(path.join(dataDir, 'fetched-at.json'), JSON.stringify({ fetchedAt: new Date().toISOString() }, null, 2));
console.log('Initial snapshot complete. Token was not written to disk by this script. Keep .env.local out of Git.');
