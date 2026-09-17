import test from "node:test";
import assert from "node:assert/strict";
import { decide, retrieve, verifyDecision } from "../codebase/engine/index.js";
import { extractJson, fetchWithRetry } from "../codebase/engine/prompt.js";

async function decideWithLocalAdapter(input) {
  const hadConfig = Object.prototype.hasOwnProperty.call(globalThis, "ASKONCE_AI_CONFIG");
  const previousConfig = globalThis.ASKONCE_AI_CONFIG;
  globalThis.ASKONCE_AI_CONFIG = {};
  try {
    return await decide(input);
  } finally {
    if (hadConfig) globalThis.ASKONCE_AI_CONFIG = previousConfig;
    else delete globalThis.ASKONCE_AI_CONFIG;
  }
}

test("retrieve maps synonyms and returns at most three documents", async () => {
  const top3 = await retrieve({ question: "Cách pick topic trên Phoenix?" });
  assert.equal(top3[0].id, "DOC-06");
  assert.ok(top3.length <= 3);
});

test("decide answers a grounded XP question", async () => {
  const result = await decideWithLocalAdapter({ question: "XP tính theo team hay cá nhân?" });
  assert.equal(result.label, "ANSWER");
  assert.equal(result.doc_id, "DOC-01");
  assert.ok(result.top3.some((document) => document.id === result.doc_id));
});

test("local adapter does not answer an unrelated question from top3[0]", async () => {
  const result = await decideWithLocalAdapter({ question: "Hôm nay ăn gì?" });
  assert.equal(result.label, "ESCALATE");
  assert.equal(result.reason, "out_of_scope");
  assert.equal(result.doc_id, null);
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

test("verify appends the selected source when the model omits its citation", () => {
  const result = verifyDecision(
    { label: "ANSWER", doc_id: "DOC-01", answer: "XP tính theo cá nhân." },
    { top3: [{ id: "DOC-01", title: "XP", snippet: "..." }] },
  );
  assert.equal(result.answer, "XP tính theo cá nhân. [DOC-01]");
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

test("configured OpenAI provider is called exactly once per decision", async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.ASKONCE_AI_CONFIG = { provider: "openai", apiKey: "test-key", baseUrl: "https://model.invalid/v1", model: "test-model" };
  globalThis.fetch = async (url, options) => {
    calls += 1;
    assert.equal(url, "https://model.invalid/v1/chat/completions");
    assert.equal(options.method, "POST");
    const body = JSON.parse(options.body);
    assert.equal(body.response_format.type, "json_schema");
    assert.equal(body.response_format.json_schema.name, "askonce_decision");
    assert.equal(body.response_format.json_schema.strict, true);
    assert.equal(body.response_format.json_schema.schema.additionalProperties, false);
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

test("provider transport retries 429 and 503 with a bounded policy", async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    if (calls === 1) return new Response("rate limited", { status: 429, headers: { "Retry-After": "0" } });
    if (calls === 2) return new Response("unavailable", { status: 503, headers: { "Retry-After": "0" } });
    return new Response("ok", { status: 200 });
  };
  try {
    const delays = [];
    const response = await fetchWithRetry("https://model.invalid", {}, {
      maxRetries: 2,
      sleep: async (milliseconds) => delays.push(milliseconds),
    });
    assert.equal(response.status, 200);
    assert.equal(calls, 3);
    assert.deepEqual(delays, [0, 0]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("provider transport stops after the retry budget is exhausted", async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    return new Response("rate limited", { status: 429, headers: { "Retry-After": "0" } });
  };
  try {
    const response = await fetchWithRetry("https://model.invalid", {}, {
      maxRetries: 2,
      sleep: async () => {},
    });
    assert.equal(response.status, 429);
    assert.equal(calls, 3);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("configured Gemini provider uses generateContent and structured JSON once", async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.ASKONCE_AI_CONFIG = {
    provider: "gemini", apiKey: "gemini-test-key",
    baseUrl: "https://generativelanguage.googleapis.test/v1beta", model: "gemini-test",
  };
  globalThis.fetch = async (url, options) => {
    calls += 1;
    assert.equal(url, "https://generativelanguage.googleapis.test/v1beta/models/gemini-test:generateContent");
    assert.equal(options.method, "POST");
    assert.equal(options.headers["x-goog-api-key"], "gemini-test-key");
    const body = JSON.parse(options.body);
    assert.equal(body.generationConfig.responseMimeType, "application/json");
    assert.equal(body.generationConfig.responseJsonSchema.type, "object");
    assert.equal(body.generationConfig.responseSchema, undefined);
    assert.match(body.systemInstruction.parts[0].text, /AskOnce/);
    return new Response(JSON.stringify({
      candidates: [{ content: { parts: [{ text: JSON.stringify({
        label: "ANSWER", doc_id: "DOC-01", reason: null,
        question: null, answer: "XP tính theo cá nhân. [DOC-01]",
      }) }] } }],
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
