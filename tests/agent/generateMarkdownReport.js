import { MarkdownReportGenerator } from "./markdownReportGenerator.js";

const summaryFile = process.argv[2];
const outputFile = process.argv[3];
const generator = new MarkdownReportGenerator();
const result = await generator.generate({
  summaryFile,
  outputFile
});

console.log(`Markdown report generated: ${result.outputFile}`);
