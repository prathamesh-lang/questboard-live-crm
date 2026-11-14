# Questboard — live customer intelligence CRM

A Next.js app for the Questathon two-account CRM task. It keeps the MCP token server-side, ingests account and paperwork snapshots once, polls `get_signals` at a controlled cadence, and writes notes back with `write_note`.

## Security

- Never put the MCP token in browser code or any `NEXT_PUBLIC_*` variable.
- Never commit `.env.local`.
- Set `AQ_TOKEN` only in the local server environment and the hosting provider's server environment variables.
- The app does not expose a token field in the UI.

## Setup

```bash
cp .env.example .env.local
# Edit .env.local and set AQ_TOKEN=your_token (do not commit this file)
npm install
npm run ingest
npm run dev
```

`npm run ingest` makes five MCP calls in sequence, waiting 61 seconds between calls to respect the one-call-per-minute token limit:

1. `get_my_accounts`
2. `get_all_paperwork` for account `A`
3. `get_all_paperwork` for account `B`
4. `get_signals`
5. `get_data_format`

It writes the results under `data/`. Inspect the returned shape before writing any account-specific conclusions. The generated files are safe to commit only after checking that they contain no token or private credentials.

## Run

```bash
npm run dev
```

Open http://localhost:3000.

## Live connection

The server route `/api/signals` calls `get_signals`; the UI checks at approximately 65-second intervals. `/api/write-note` calls `write_note`. All calls are server-side and share a simple in-process 60.5-second cooldown. On a multi-instance serverless host, use a shared rate limiter before enabling simultaneous users.

## Deployment

Deploy as a Next.js application to Vercel or another Node-compatible host. Add `AQ_TOKEN` as a server-only environment variable in the hosting dashboard. Do not place it in source files, build logs, or the browser. Commit the fetched JSON snapshots in `data/` so judges can read the account facts immediately; keep `.env.local` ignored.

## Important product limitation

The initial UI is an ingestion and evidence-inspection scaffold. It does **not** claim to have completed the five account answers until the MCP snapshots have been inspected and mapped. In particular, never display a monetary or usage figure without its actual source ID. Do not infer a deal value from a champion's unverified claim.
