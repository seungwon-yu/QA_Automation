import { PlaywrightEvidenceAnalyzer } from "./playwrightEvidenceAnalyzer.js";

const evidenceDir = process.argv[2];
const analyzer = new PlaywrightEvidenceAnalyzer();
const result = await analyzer.analyze({
  evidenceDir
});

console.log(JSON.stringify(result, null, 2));
process.exit(0);
