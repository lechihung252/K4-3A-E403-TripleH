import { normalize } from "./retrieve.js";

const SYSTEM_PROMPT = `Bạn là lõi quyết định của AskOnce, trợ lý quy định Build Phase.
Chọn đúng một nhãn:
- ANSWER: câu hỏi rõ và câu trả lời được chứng minh hoàn toàn bởi một tài liệu trong top3.
- CLARIFY: thiếu đúng một thông tin quan trọng; chỉ hỏi lại một câu ngắn.
- ESCALATE: cần dữ liệu cá nhân, không có nguồn, ngoài phạm vi, hoặc người dùng báo câu trước sai.

Luật bắt buộc:
1. Chỉ ANSWER với doc_id có trong top3. Không dùng kiến thức ngoài top3.
2. Dữ liệu/sự cố riêng của học viên => ESCALATE/personal_data.
3. Người dùng báo câu trước sai => ESCALATE/correction.
4. Ngoài quy định Build Phase => ESCALATE/out_of_scope.
5. Không có tài liệu đủ căn cứ => ESCALATE/no_source.
6. Trả đúng một JSON object, không markdown, đủ 6 khóa:
{"label":"ANSWER|CLARIFY|ESCALATE","doc_id":"DOC-xx|null","reason":"personal_data|no_source|out_of_scope|correction|null","question":"string|null","answer":"string|null"}

Nếu ANSWER, trả lời ngắn bằng tiếng Việt và kết thúc bằng [DOC-xx].`;

const ANSWERS = {
  "DOC-01": "XP được tính theo từng cá nhân qua các hoạt động Build Phase được công bố; mức XP tùy từng hoạt động. Nếu XP chưa được cộng sau 24 giờ, bạn nên mở ticket hỗ trợ. [DOC-01]",
  "DOC-02": "Điểm danh được ghi nhận qua QR tại lớp, Zoom khi học online hoặc trạng thái hoàn thành trên VLearn; dữ liệu thường cập nhật trong 24–48 giờ. [DOC-02]",
  "DOC-03": "Mỗi học viên nộp daily standup một lần mỗi ngày bằng /daily-standup, gồm việc hôm qua và kế hoạch hôm nay, trước khi buổi học trong ngày bắt đầu. [DOC-03]",
  "DOC-04": "Bạn tạo ticket bằng lệnh /ticket create, chọn loại ticket, điền tiêu đề rồi mô tả chi tiết vấn đề trong kênh ticket riêng. [DOC-04]",
  "DOC-05": "Mentor duty thường diễn ra 1 lần mỗi tuần, đôi khi 2 lần tùy mentor; báo cáo gồm việc đã xong, vướng mắc và hỗ trợ cần thiết. [DOC-05]",
  "DOC-06": "Bạn chọn đề tài trên Phoenix từ project bank; đề tài ngoài danh sách phải được BTC duyệt, và đổi đề tài sau hạn ghép đội cần duyệt riêng. [DOC-06]",
  "DOC-07": "Học viên tự lập team trên Phoenix trong thời hạn ghép đội và các thành viên phải cùng level; nếu chưa có team, BTC hoặc mentor sẽ hỗ trợ ghép. [DOC-07]",
  "DOC-08": "Mỗi Lab có hạn riêng trên VLearn hoặc thông báo, thường là 23:59 giờ Việt Nam; tài liệu chung không quy định mức trừ cố định khi nộp muộn. [DOC-08]",
  "DOC-09": "Bạn xem bảng xếp hạng XP bằng lệnh xem rank trên Discord hoặc trên Phoenix; bảng có thể trễ vài phút khi đang cập nhật. [DOC-09]",
};

function includesAny(text, expressions) {
  return expressions.some((expression) => expression.test(text));
}

function deterministicDecision({ question, history, askedOnce, top3 }) {
  const q = normalize(question);
  const rawQuestion = String(question).toLowerCase();
  const context = normalize(history.join(" "));

  if (history.length > 0 && includesAny(q, [/^sai( roi)?$/, /khong dung/, /khong phai/, /tra loi sai/, /chua dung y/])) {
    return { label: "ESCALATE", doc_id: null, reason: "correction", question: null, answer: null };
  }

  const isPersonal = includesAny(q, [
    /\b(cua toi|cua minh|cho toi|sao minh|tai khoan cua|nhom cua)\b/,
    /\b(chua duoc cong|khong duoc cong|khong thay.*(xp|diem|nhom)|lo diem danh|bi thieu diem)\b/,
    /\b(xac nhan.*diem|hoat dong.*chua.*xp)\b/,
  ]);
  if (isPersonal) {
    return { label: "ESCALATE", doc_id: null, reason: "personal_data", question: null, answer: null };
  }

  // These decisions are not stated in any retrieved document. Similar words in a
  // document must never be treated as evidence for an answer.
  if (/\bthuc tap\b/.test(q)) {
    return { label: "ESCALATE", doc_id: null, reason: "no_source", question: null, answer: null };
  }
  if (/\bphan cung\b/.test(q) && /\b(tu chuan bi|btc cap|thiet bi)\b/.test(q)) {
    return { label: "ESCALATE", doc_id: null, reason: "out_of_scope", question: null, answer: null };
  }

  const mentionsLate = /muộn|trễ|23:59|23h59/.test(rawQuestion) || /\btre\b/.test(q);
  const ambiguous =
    (mentionsLate && !/\b(nop|bai|lab|vao lop|diem danh)\b/.test(q)) ||
    (/\b(phase 1|phase 2|phase 3|cac phase)\b/.test(q) && !/\bbuild|quy trinh|khoa hoc\b/.test(q)) ||
    (/\b(diem cong|xem diem)\b/.test(q) && !/\b(xp|vlearn|phoenix|rank|lab)\b/.test(q)) ||
    (/\b(giang vien|nguoi ho tro)\b/.test(q) && !/\b(lop|phong|mon|mentor)\b/.test(q)) ||
    (/\bkhong dang nhap duoc\b/.test(q) && !/\b(loi|ma loi|quen mat khau)\b/.test(q));
  if (ambiguous) {
    if (askedOnce) return { label: "ESCALATE", doc_id: null, reason: "no_source", question: null, answer: null };
    let followUp = "Bạn có thể nói rõ bạn đang hỏi về hoạt động hoặc hệ thống nào không?";
    if (mentionsLate) followUp = "Bạn đang hỏi nộp Lab muộn, vào lớp muộn, hay một việc khác?";
    else if (/diem cong|xem diem/.test(q)) followUp = "Bạn muốn xem XP, điểm Lab hay điểm trên VLearn?";
    else if (/giang vien|nguoi ho tro/.test(q)) followUp = "Bạn cần danh sách hỗ trợ của lớp hoặc phòng học nào?";
    else if (/khong dang nhap/.test(q)) followUp = "Phoenix đang hiện lỗi gì khi bạn đăng nhập?";
    return { label: "CLARIFY", doc_id: null, reason: null, question: followUp, answer: null };
  }

  const combined = `${context} ${q}`;
  const preferred = top3.find((document) => {
    if (/daily|standup|yesterday|today/.test(combined)) return document.id === "DOC-03";
    if (/ticket|ho tro/.test(combined)) return document.id === "DOC-04";
    if (/mentor duty|bao cao mentor/.test(combined)) return document.id === "DOC-05";
    if (/topic|de tai|project bank/.test(combined)) return document.id === "DOC-06";
    if (/team|ghep nhom|lap nhom|cung level/.test(combined)) return document.id === "DOC-07";
    if (/deadline|han nop|nop bai|nop lab|23:59|23h59/.test(combined)) return document.id === "DOC-08";
    if (/rank|bang xep hang/.test(combined)) return document.id === "DOC-09";
    if (/diem danh|attendance|qr|zoom/.test(combined)) return document.id === "DOC-02";
    if (/xp|diem kinh nghiem|tinh diem|cong diem/.test(combined)) return document.id === "DOC-01";
    return false;
  }) || top3[0];

  if (preferred && ANSWERS[preferred.id]) {
    return { label: "ANSWER", doc_id: preferred.id, reason: null, question: null, answer: ANSWERS[preferred.id] };
  }

  const buildPhaseTerms = /build|xp|diem|phoenix|vlearn|mentor|lab|workshop|team|nhom|de tai|daily|ticket|deadline/;
  return {
    label: "ESCALATE", doc_id: null,
    reason: buildPhaseTerms.test(q) ? "no_source" : "out_of_scope",
    question: null, answer: null,
  };
}

function extractJson(text) {
  const raw = String(text || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("Model did not return a JSON object");
  return JSON.parse(raw.slice(start, end + 1));
}

async function loadConfig() {
  if (globalThis.ASKONCE_AI_CONFIG) return globalThis.ASKONCE_AI_CONFIG;
  try {
    const local = await import("./config.local.js");
    return local.default || local.config;
  } catch (error) {
    const missing = String(error?.code || error?.message).includes("MODULE_NOT_FOUND") ||
      String(error?.message).includes("Failed to fetch");
    if (!missing) console.warn("AskOnce could not load config.local.js:", error.message);
  }
  if (typeof process !== "undefined" && process.env) {
    return {
      apiKey: process.env.ASKONCE_API_KEY,
      baseUrl: process.env.ASKONCE_BASE_URL,
      model: process.env.ASKONCE_MODEL,
    };
  }
  return {};
}

async function callOpenAICompatible(config, payload) {
  const baseUrl = (config.baseUrl || "https://api.openai.com/v1").replace(/\/$/, "");
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.apiKey}` },
    body: JSON.stringify({
      model: config.model,
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: JSON.stringify(payload) },
      ],
    }),
  });
  if (!response.ok) throw new Error(`AI provider returned HTTP ${response.status}: ${await response.text()}`);
  const data = await response.json();
  return extractJson(data.choices?.[0]?.message?.content);
}

export async function decideWithModel(input) {
  const config = await loadConfig();
  if (!config?.apiKey || !config?.model) {
    const output = deterministicDecision(input);
    globalThis.ASKONCE_TRACE?.({ mode: "deterministic-local-adapter", input, output });
    return output;
  }
  const payload = {
    question: input.question,
    history: input.history.slice(-3),
    askedOnce: input.askedOnce,
    top3: input.top3.map(({ id, title, content }) => ({ id, title, content })),
  };
  try {
    const output = await callOpenAICompatible(config, payload);
    globalThis.ASKONCE_TRACE?.({ mode: "configured-model", model: config.model, input: payload, output });
    return output;
  } catch (error) {
    // A provider outage or malformed JSON is a no-source outcome, never permission
    // to improvise an answer. Do not include the API key in traces.
    globalThis.ASKONCE_TRACE?.({
      mode: "configured-model", model: config.model, input: payload,
      error: error instanceof Error ? error.message : String(error),
    });
    return { label: "ESCALATE", doc_id: null, reason: "no_source", question: null, answer: null };
  }
}

export { SYSTEM_PROMPT, deterministicDecision, extractJson };
