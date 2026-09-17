import { readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { decide } from "../codebase/engine/index.js";

const here = dirname(fileURLToPath(import.meta.url));
const golden = JSON.parse(await readFile(join(here, "golden-set.json"), "utf8"));
const now = new Date();
const runName = process.argv.find((arg) => /^--name=/.test(arg))?.split("=")[1] || "run-1";
const traceDirectory = join(here, "trace");
await mkdir(traceDirectory, { recursive: true });

function judge(expected, actual) {
  const checks = {
    label: actual.label === expected.label,
    doc_id: expected.label !== "ANSWER" || actual.doc_id === expected.doc_id,
    grounded: actual.label !== "ANSWER" || actual.top3.some((document) => document.id === actual.doc_id),
    reason: expected.label !== "ESCALATE" || !expected.reason || actual.reason === expected.reason,
  };
  return { pass: Object.values(checks).every(Boolean), checks };
}

const results = [];
for (const testCase of golden) {
  const startedAt = new Date();
  const modelTrace = [];
  globalThis.ASKONCE_TRACE = (entry) => modelTrace.push(entry);
  try {
    const actual = await decide(testCase);
    const verdict = judge(testCase.expected, actual);
    results.push({ ...testCase, actual, model_trace: modelTrace, ...verdict, started_at: startedAt.toISOString(), duration_ms: Date.now() - startedAt.getTime() });
  } catch (error) {
    results.push({ ...testCase, actual: null, model_trace: modelTrace, pass: false, checks: {}, error: error.stack || error.message, started_at: startedAt.toISOString(), duration_ms: Date.now() - startedAt.getTime() });
  }
}
delete globalThis.ASKONCE_TRACE;

const passed = results.filter((result) => result.pass).length;
const answerSourceFailures = results.filter((result) => result.actual?.label === "ANSWER" && !result.checks.grounded).length;
const labelCounts = Object.fromEntries(["ANSWER", "CLARIFY", "ESCALATE"].map((label) => [label, results.filter((result) => result.actual?.label === label).length]));
const observedTrace = results.find((result) => result.model_trace?.[0])?.model_trace[0] || {};
const observedMode = observedTrace.mode || "unknown";
const guardrailApplied = results.filter((result) =>
  result.model_trace?.some((entry) => entry.guardrail)
).length;
const summary = {
  run: runName,
  generated_at: now.toISOString(),
  mode: observedMode,
  provider: observedTrace.provider || (observedMode === "deterministic-local-adapter" ? "local" : "unknown"),
  model: observedTrace.model || null,
  total: results.length,
  passed,
  failed: results.length - passed,
  accuracy: Number((passed / results.length * 100).toFixed(1)),
  answer_source_failures: answerSourceFailures,
  guardrail_applied: guardrailApplied,
  actual_labels: labelCounts,
};

await writeFile(join(traceDirectory, `${runName}.jsonl`), results.map((result) => JSON.stringify(result)).join("\n") + "\n");

const failedRows = results.filter((result) => !result.pass).map((result) =>
  `| ${result.id} | ${result.msg_id} | ${result.expected.label}${result.expected.doc_id ? `/${result.expected.doc_id}` : ""} | ${result.actual ? `${result.actual.label}${result.actual.doc_id ? `/${result.actual.doc_id}` : ""}` : "ERROR"} | ${result.error ? result.error.split("\n")[0] : Object.entries(result.checks).filter(([, ok]) => !ok).map(([name]) => name).join(", ")} |`
);
const report = `# ${runName} — Kết quả AskOnce\n\n` +
  `- Thời gian: ${summary.generated_at}\n- Chế độ: \`${summary.mode}\`\n- Provider: \`${summary.provider}\`\n- Model: \`${summary.model || "n/a"}\`\n- Kết quả: **${passed}/${results.length} (${summary.accuracy}%)**\n- ANSWER sai nguồn: **${answerSourceFailures}**\n- Guardrail áp dụng: **${guardrailApplied}**\n- Nhãn đầu ra: ANSWER ${labelCounts.ANSWER} · CLARIFY ${labelCounts.CLARIFY} · ESCALATE ${labelCounts.ESCALATE}\n\n` +
  `## Case sai\n\n` +
  (failedRows.length ? `| # | msg_id | Kỳ vọng | Thực tế | Lỗi |\n|---:|---|---|---|---|\n${failedRows.join("\n")}\n` : "Không có case sai trong lượt chạy này.\n") +
  `\n## Khả năng kiểm tra lại\n\nToàn bộ input, top-3, output, từng tiêu chí pass/fail và thời gian chạy nằm tại \`eval/trace/${runName}.jsonl\`.\n`;
await writeFile(join(here, `${runName}.md`), report);
console.log(JSON.stringify(summary, null, 2));
process.exitCode = passed === results.length ? 0 : 1;
