// Public contract between the UI and the AskOnce engine.
// This module deliberately has no DOM dependency, so eval/run.js can call it too.

import { retrieve } from "./retrieve.js";
import { decideWithModel } from "./prompt.js";
import { verifyDecision } from "./verify.js";

export async function decide({ question, history = [], askedOnce = false } = {}) {
  const cleanQuestion = typeof question === "string" ? question.trim() : "";
  const cleanHistory = Array.isArray(history)
    ? history.filter((item) => typeof item === "string").slice(-3)
    : [];

  if (!cleanQuestion) {
    return {
      label: "ESCALATE", doc_id: null, reason: "no_source",
      question: null, answer: null, top3: [],
    };
  }

  // ② deterministic keyword/synonym retrieval
  const top3 = await retrieve({ question: cleanQuestion, history: cleanHistory, limit: 3 });

  // ③ exactly one model call when configured; reproducible local adapter otherwise
  const proposed = await decideWithModel({
    question: cleanQuestion,
    history: cleanHistory,
    askedOnce: Boolean(askedOnce),
    top3,
  });

  // ④⑤ safety invariants belong to code, not to the model
  return verifyDecision(proposed, { top3, askedOnce: Boolean(askedOnce) });
}

export { retrieve } from "./retrieve.js";
export { verifyDecision } from "./verify.js";
