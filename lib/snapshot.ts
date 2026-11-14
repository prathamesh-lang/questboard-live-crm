import fs from "node:fs";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");
function readJson(name: string): any {
  try { return JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8")); }
  catch { return { _status: "missing", message: `${name} has not been fetched yet.` }; }
}
export function getSnapshot() {
  return {
    accounts: readJson("accounts.json"),
    paperworkA: readJson("paperwork-A.json"),
    paperworkB: readJson("paperwork-B.json"),
    signals: readJson("signals.json"),
    fetchedAt: readJson("fetched-at.json")
  };
}
