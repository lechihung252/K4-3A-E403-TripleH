import test from "node:test";
import assert from "node:assert/strict";
import { decide, retrieve, verifyDecision } from "../codebase/engine/index.js";
import { extractJson } from "../codebase/engine/prompt.js";

test("retrieve maps synonyms and returns at most three documents", async () => {
  const top3 = await retrieve({ question: "Cách pick topic trên Phoenix?" });
  assert.equal(top3[0].id, "DOC-06");
  assert.ok(top3.length <= 3);
});

test("decide answers a grounded XP question", async () => {
  const result = await decide({ question: "XP tính theo team hay cá nhân?" });
  assert.equal(result.label, "ANSWER");
  assert.equal(result.doc_id, "DOC-01");
  assert.ok(result.top3.some((document) => document.id === result.doc_id));
});

test("verify rejects an ANSWER whose doc_id is outside top3", () => {
  const result = verifyDecision(
    { label: "ANSWER", doc_id: "DOC-09", answer: "Bịa" },
    { top3: [{ id: "DOC-01", title: "XP", snippet: "..." }] },
  );
  assert.deepEqual(result, {
    label: "ESCALATE", doc_id: null, reason: "no_source", question: null,
    answer: null, top3: [{ id: "DOC-01", title: "XP", snippet: "..." }],
  });
});

test("verify never asks a second clarification", () => {
  const result = verifyDecision(
    { label: "CLARIFY", question: "Bạn hỏi gì?" },
    { top3: [], askedOnce: true },
  );
  assert.equal(result.label, "ESCALATE");
  assert.equal(result.reason, "no_source");
});

test("safe parser accepts fenced JSON and rejects non-JSON", () => {
  assert.equal(extractJson("```json\n{\"label\":\"ANSWER\"}\n```").label, "ANSWER");
  assert.throws(() => extractJson("ANSWER"), /JSON object/);
});

test("configured provider is called exactly once per decision", async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.ASKONCE_AI_CONFIG = { apiKey: "test-key", baseUrl: "https://model.invalid/v1", model: "test-model" };
  globalThis.fetch = async (url, options) => {
    calls += 1;
    assert.equal(url, "https://model.invalid/v1/chat/completions");
    assert.equal(options.method, "POST");
    return new Response(JSON.stringify({
      choices: [{ message: { content: JSON.stringify({
        label: "ANSWER", doc_id: "DOC-01", reason: null,
        question: null, answer: "XP tính theo cá nhân. [DOC-01]",
      }) } }],
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  };
  try {
    const result = await decide({ question: "XP tính theo team hay cá nhân?" });
    assert.equal(calls, 1);
    assert.equal(result.label, "ANSWER");
    assert.equal(result.doc_id, "DOC-01");
  } finally {
    globalThis.fetch = originalFetch;
    delete globalThis.ASKONCE_AI_CONFIG;
  }
});
