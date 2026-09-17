const LABELS = new Set(["ANSWER", "CLARIFY", "ESCALATE"]);
const REASONS = new Set(["personal_data", "no_source", "out_of_scope", "correction"]);

function escalate(reason, top3) {
  return { label: "ESCALATE", doc_id: null, reason, question: null, answer: null, top3 };
}

export function verifyDecision(candidate, { top3 = [], askedOnce = false } = {}) {
  const safeTop3 = Array.isArray(top3)
    ? top3.slice(0, 3).map(({ id, title, snippet }) => ({ id, title, snippet }))
    : [];
  const value = candidate && typeof candidate === "object" ? candidate : {};

  if (!LABELS.has(value.label)) return escalate("no_source", safeTop3);
  if (value.label === "ANSWER") {
    if (!safeTop3.some((document) => document.id === value.doc_id)) return escalate("no_source", safeTop3);
    if (typeof value.answer !== "string" || !value.answer.trim()) return escalate("no_source", safeTop3);
    const cleanAnswer = value.answer.trim();
    const sourcedAnswer = cleanAnswer.includes(`[${value.doc_id}]`)
      ? cleanAnswer
      : `${cleanAnswer} [${value.doc_id}]`;
    return {
      label: "ANSWER", doc_id: value.doc_id, reason: null, question: null,
      answer: sourcedAnswer, top3: safeTop3,
    };
  }
  if (value.label === "CLARIFY") {
    if (askedOnce) return escalate("no_source", safeTop3);
    if (typeof value.question !== "string" || !value.question.trim()) return escalate("no_source", safeTop3);
    return {
      label: "CLARIFY", doc_id: null, reason: null,
      question: value.question.trim(), answer: null, top3: safeTop3,
    };
  }
  return escalate(REASONS.has(value.reason) ? value.reason : "no_source", safeTop3);
}
