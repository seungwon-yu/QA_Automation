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

    return {
      evidenceDir,
      consoleLog,
      state,
      testInfo,
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
