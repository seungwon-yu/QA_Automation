import { mkdir, appendFile, writeFile } from "node:fs/promises";
import path from "node:path";

export class DecisionLogger {
  constructor(options = {}) {
    this.logDir = options.logDir ?? "artifacts/agent";
    this.logFile = options.logFile ?? path.join(this.logDir, "decision-log.jsonl");
  }

  async write(entry) {
    await mkdir(this.logDir, { recursive: true });
    await appendFile(this.logFile, `${JSON.stringify(entry)}\n`, "utf8");
    return this.logFile;
  }

  async writeSummary(summary) {
    await mkdir(this.logDir, { recursive: true });
    const summaryFile = path.join(this.logDir, "last-summary.json");
    await writeFile(summaryFile, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
    return summaryFile;
  }
}
