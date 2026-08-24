import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export class EvidenceCollector {
  constructor(options = {}) {
    this.baseDir = options.baseDir ?? "artifacts/evidence";
  }

  async collect(context) {
    const evidenceDir = this.buildEvidenceDir(context);
    await mkdir(evidenceDir, { recursive: true });

    const commandLog = {
      testId: context.testId,
      attempt: context.attempt,
      command: context.command,
      exitCode: context.exitCode,
      stdout: context.stdout ?? "",
      stderr: context.stderr ?? "",
      collectedAt: new Date().toISOString()
    };
    const consoleLog = {
      stdout: context.stdout ?? "",
      stderr: context.stderr ?? ""
    };
    const screenshot = context.screenshot ?? {
      available: false,
      reason: "브라우저 실행 컨텍스트가 아니므로 screenshot이 제공되지 않음"
    };

    const state = context.state ?? {
      available: false,
      reason: "테스트 실행 컨텍스트에서 state가 제공되지 않음"
    };

    const timeline = context.timeline ?? {
      available: false,
      reason: "테스트 실행 컨텍스트에서 timeline이 제공되지 않음"
    };

    await writeJson(path.join(evidenceDir, "command-log.json"), commandLog);
    await writeJson(path.join(evidenceDir, "console-log.json"), consoleLog);
    await writeJson(path.join(evidenceDir, "screenshot.json"), screenshot);
    await writeJson(path.join(evidenceDir, "state.json"), state);
    await writeJson(path.join(evidenceDir, "timeline.json"), timeline);

    return {
      evidenceDir,
      files: {
        commandLog: path.join(evidenceDir, "command-log.json"),
        consoleLog: path.join(evidenceDir, "console-log.json"),
        screenshot: path.join(evidenceDir, "screenshot.json"),
        state: path.join(evidenceDir, "state.json"),
        timeline: path.join(evidenceDir, "timeline.json")
      }
    };
  }

  buildEvidenceDir(context) {
    const safeTestId = sanitize(context.testId ?? "unknown-test");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    return path.join(this.baseDir, `${timestamp}-${safeTestId}-attempt-${context.attempt}`);
  }
}

async function writeJson(filePath, value) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function sanitize(value) {
  return value.replace(/[^a-zA-Z0-9가-힣_-]/g, "_");
}
