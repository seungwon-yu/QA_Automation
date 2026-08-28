import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { EvidenceCollector } from "./evidenceCollector.js";
import { FailureClassifier } from "./failureClassifier.js";
import { DecisionEngine } from "./decisionEngine.js";
import { DecisionLogger } from "./decisionLogger.js";
import { RetryEvidenceComparator } from "./retryEvidenceComparator.js";
import { DECISION } from "./failureTypes.js";

const DEFAULT_COMMAND = "npm test";
const DEFAULT_TEST_ID = "AGENT-LOOP-COMMAND";

export class AgentLoopRunner {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries ?? 3;
    this.evidenceCollector = options.evidenceCollector ?? new EvidenceCollector();
    this.failureClassifier = options.failureClassifier ?? new FailureClassifier();
    this.decisionEngine = options.decisionEngine ?? new DecisionEngine({ maxRetries: this.maxRetries });
    this.decisionLogger = options.decisionLogger ?? new DecisionLogger();
    this.retryEvidenceComparator = options.retryEvidenceComparator ?? new RetryEvidenceComparator();
    this.commandExecutor = options.commandExecutor ?? executeCommand;
  }

  async run(options = {}) {
    const command = options.command ?? DEFAULT_COMMAND;
    const testId = options.testId ?? DEFAULT_TEST_ID;
    const attempts = [];

    for (let attempt = 1; attempt <= this.maxRetries; attempt += 1) {
      const execution = await this.commandExecutor(command, attempt);
      const classification = this.failureClassifier.classify(execution);
      const evidence = execution.exitCode === 0
        ? null
        : await this.evidenceCollector.collect({
          ...execution,
          testId,
          attempt,
          command
        });
      const decision = this.decisionEngine.decide({
        ...classification,
        attempt
      });
      const entry = {
        testId,
        attempt,
        command,
        result: classification.result,
        classification: classification.classification,
        observations: classification.observations,
        evidenceDir: evidence?.evidenceDir ?? null,
        decision: decision.decision,
        reason: decision.reason,
        nextAction: decision.nextAction,
        createdAt: new Date().toISOString()
      };

      await this.decisionLogger.write(entry);
      attempts.push(entry);

      if (decision.decision !== DECISION.RETRY) {
        const summary = {
          testId,
          command,
          finalResult: entry.result,
          finalClassification: entry.classification,
          finalDecision: entry.decision,
          retryEvidenceComparison: this.retryEvidenceComparator.compare(attempts),
          attempts
        };
        await this.decisionLogger.writeSummary(summary);
        return summary;
      }
    }

    const lastAttempt = attempts.at(-1);
    return {
      testId,
      command,
      finalResult: lastAttempt.result,
      finalClassification: lastAttempt.classification,
      finalDecision: lastAttempt.decision,
      retryEvidenceComparison: this.retryEvidenceComparator.compare(attempts),
      attempts
    };
  }
}

export function executeCommand(command) {
  return new Promise((resolve) => {
    const child = spawn(command, {
      shell: true,
      cwd: process.cwd(),
      env: process.env
    });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("close", (exitCode) => {
      resolve({
        exitCode,
        stdout,
        stderr
      });
    });
  });
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  const command = process.argv.slice(2).join(" ") || DEFAULT_COMMAND;
  const runner = new AgentLoopRunner();
  const summary = await runner.run({ command });
  console.log(JSON.stringify(summary, null, 2));
  process.exit(summary.finalResult === "PASS" ? 0 : 1);
}
