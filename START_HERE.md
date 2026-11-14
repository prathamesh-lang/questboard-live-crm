# START HERE — do these steps in order

1. In the Questathon Build → Connect tab, click **Show my token**. Do not paste the token into chat, Antigravity prompts, source files, or GitHub.
2. Extract this project into a folder, open it in Antigravity, and create `.env.local` by copying `.env.example`.
3. Put the token only in `.env.local` as `AQ_TOKEN=...`. The file is git-ignored.
4. Ask Antigravity to read `ANTIGRAVITY_PROMPT.md` and implement the five evidence-backed account answers using the real MCP response shapes.
5. In the terminal run `npm install`, then `npm run ingest`. The script waits 61 seconds between each of five MCP calls. Do not start other MCP calls at the same time.
6. After ingestion, inspect the `data/` files. They contain the account snapshot and source paperwork, not the token. Upload the JSON files here if you want help mapping the real IDs and facts.
7. Run `npm run dev` and verify the app locally.
8. For hosting, configure `AQ_TOKEN` only in the host's server-side environment settings. Commit no `.env.local` and no token.
9. Complete the hosted link, public repository, Google Doc thinking page, and 3-minute Google Drive walkthrough in the event's Hand in tab. Verify every link in a private window.
