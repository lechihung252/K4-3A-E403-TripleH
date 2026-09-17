const DOC_IDS = Array.from({ length: 9 }, (_, index) => `DOC-${String(index + 1).padStart(2, "0")}`);
const SYNONYMS_URL = new URL("../../kb/synonyms.json", import.meta.url);

let cachedKnowledgeBase;

function normalize(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9/:-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseDocument(markdown) {
  const header = markdown.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!header) throw new Error("KB document is missing front matter");
  const fields = {};
  for (const line of header[1].split("\n")) {
    const separator = line.indexOf(":");
    if (separator > 0) fields[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  }
  if (!/^DOC-\d{2}$/.test(fields.id || "") || !fields.title) {
    throw new Error("KB document has an invalid id/title");
  }
  const body = markdown.slice(header[0].length).trim();
  const paragraph = body.split(/\n\s*\n/)
    .map((part) => part.replace(/^>.*$/gm, "").trim()).find(Boolean) || body;
  return {
    id: fields.id,
    title: fields.title,
    keywords: (fields.keywords || "").split(",").map((word) => word.trim()).filter(Boolean),
    body,
    snippet: paragraph.replace(/\s+/g, " ").slice(0, 180),
  };
}

async function readText(url) {
  if (url.protocol === "file:") {
    const { readFile } = await import("node:fs/promises");
    return readFile(url, "utf8");
  }
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Cannot load ${url.pathname}: HTTP ${response.status}`);
  return response.text();
}

async function loadKnowledgeBase() {
  if (!cachedKnowledgeBase) {
    cachedKnowledgeBase = (async () => {
      const [synonymText, ...documents] = await Promise.all([
        readText(SYNONYMS_URL),
        ...DOC_IDS.map((id) => readText(new URL(`../../kb/${id}.md`, import.meta.url))),
      ]);
      return { synonyms: JSON.parse(synonymText), documents: documents.map(parseDocument) };
    })().catch((error) => {
      cachedKnowledgeBase = undefined;
      throw error;
    });
  }
  return cachedKnowledgeBase;
}

function phrasesForDocument(document, synonyms) {
  const keywords = document.keywords.map(normalize);
  const related = Object.values(synonyms)
    .filter((group) => group.some((term) => keywords.some((keyword) => normalize(term).includes(keyword) || keyword.includes(normalize(term)))))
    .flat();
  return [...new Set([...document.keywords, ...related])];
}

function scoreDocument(document, query, synonyms) {
  const normalizedQuery = normalize(query);
  const queryTokens = new Set(normalizedQuery.split(" ").filter((token) => token.length > 1));
  const documentTokens = new Set(normalize(`${document.title} ${document.keywords.join(" ")} ${document.body}`).split(" "));
  let score = 0;
  for (const phrase of phrasesForDocument(document, synonyms)) {
    const normalizedPhrase = normalize(phrase);
    if (normalizedPhrase && normalizedQuery.includes(normalizedPhrase)) score += normalizedPhrase.includes(" ") ? 8 : 5;
  }
  for (const token of queryTokens) {
    if (documentTokens.has(token)) score += token.length >= 5 ? 1.5 : 0.5;
  }
  if (normalizedQuery.includes(normalize(document.title))) score += 10;
  return score;
}

// Below this score the question cannot be retrieved on its own ("cái hai", "sai rồi", "mình cần cả ba"),
// so recent history is blended in. Standalone questions score >= 4 on the current kb/, references <= 1.5.
const WEAK_QUESTION_SCORE = 3;

function rank(documents, query, synonyms) {
  return documents
    .map((document) => ({ document, score: scoreDocument(document, query, synonyms) }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score || left.document.id.localeCompare(right.document.id));
}

export async function retrieve({ question, history = [], limit = 3 }) {
  const { documents, synonyms } = await loadKnowledgeBase();
  // Retrieve on the question alone first: history scored as an equal peer lets a long previous
  // answer outrank the new question (e.g. a DOC-09 answer pushing DOC-09 to the top of a login question).
  let ranked = rank(documents, question, synonyms);
  if (history.length && (!ranked.length || ranked[0].score < WEAK_QUESTION_SCORE)) {
    ranked = rank(documents, `${history.slice(-2).join(" ")} ${question}`, synonyms);
  }
  return ranked
    .slice(0, Math.max(0, limit))
    .map(({ document, score }) => ({
      id: document.id,
      title: document.title,
      snippet: document.snippet,
      content: document.body,
      score: Number(score.toFixed(2)),
    }));
}

export { normalize };
