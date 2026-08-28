import { readFile } from "node:fs/promises";
import path from "node:path";

export class PlaywrightEvidenceReader {
  async read(evidenceDir) {
    const consoleLog = await readOptionalJson(path.join(evidenceDir, "console-log.json"), []);
    const state = await readOptionalJson(path.join(evidenceDir, "state.json"), {
      available: false,
      reason: "state.json 파일이 없음"
    });
    const testInfo = await readOptionalJson(path.join(evidenceDir, "test-info.json"), {
      available: false,
      reason: "test-info.json 파일이 없음"
    });
    const metadata = await readOptionalJson(path.join(evidenceDir, "metadata.json"), {
      available: false,
      reason: "metadata.json 파일이 없음"
    });
    const timeline = await readOptionalJson(path.join(evidenceDir, "timeline.json"), []);
    const assertionError = await readOptionalJson(path.join(evidenceDir, "assertion-error.json"), {
      available: false,
      reason: "assertion-error.json 파일이 없음",
      errors: []
    });

    return {
      evidenceDir,
      consoleLog,
      state,
      testInfo,
      metadata,
      timeline,
      assertionError,
      screenshotPath: testInfo.screenshotPath ?? path.join(evidenceDir, "screenshot.png")
    };
  }
}

async function readOptionalJson(filePath, fallback) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch {
    return fallback;
  }
}
