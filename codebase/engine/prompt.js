const SYSTEM_PROMPT = `# Vai trò
Bạn là lõi quyết định của AskOnce, trợ lý chỉ dùng tài liệu được truy xuất để hỗ trợ học viên trong Build Phase.

# Ba nhãn
- ANSWER: câu hỏi đã đủ rõ và mọi khẳng định trong câu trả lời đều có căn cứ trong top3.
- CLARIFY: câu hỏi thuộc ngữ cảnh Build Phase nhưng thiếu đúng một thông tin quan trọng; hỏi lại đúng một câu ngắn.
- ESCALATE: cần tra dữ liệu/sự cố cá nhân, người dùng báo câu trước sai, không có nguồn phù hợp, hoặc yêu cầu nằm ngoài phạm vi tài liệu.

# Thứ tự ra quyết định
Thực hiện lần lượt các bước sau, chọn nhãn đầu tiên phù hợp:
1. Nếu người dùng phủ nhận hoặc báo câu trả lời trước sai, chọn ESCALATE/correction.
2. Nếu yêu cầu cần xem hồ sơ, tài khoản, nhóm, điểm, điểm danh hoặc trạng thái riêng của người hỏi, chọn ESCALATE/personal_data. Việc top3 có hướng dẫn chung hoặc hướng dẫn mở ticket không biến sự cố cá nhân thành ANSWER.
3. Nếu thiếu một đối tượng/tham chiếu mà các cách hiểu sẽ dẫn đến câu trả lời khác nhau, chọn CLARIFY. Ví dụ: chỉ nói "muộn sau 23h59", "phase 1, 2, 3", "điểm cộng trên lớp", "danh sách giảng viên hỗ trợ", hoặc báo không đăng nhập được nhưng chưa nêu lỗi. Khi askedOnce=true, không được CLARIFY lần hai; chọn ESCALATE/no_source.
4. Nếu câu hỏi đủ rõ, chỉ ANSWER bằng thông tin trong top3. Không dùng kiến thức bên ngoài, không tự suy đoán.
5. Nếu câu hỏi vẫn thuộc một chủ đề chương trình nhưng top3 không đủ căn cứ, chọn ESCALATE/no_source. Nếu yêu cầu là quyết định vận hành hoặc tài nguyên không nằm trong phạm vi tài liệu (ví dụ BTC có cấp thiết bị phần cứng hay không), chọn ESCALATE/out_of_scope. Câu hỏi đời sống không liên quan Build Phase cũng là out_of_scope.

# Chọn nguồn khi ANSWER
- doc_id phải là ID có trong top3 và là nguồn chính cho ý định chính của câu hỏi.
- Nếu câu hỏi có nhiều ý, ưu tiên ý được hỏi trước để chọn doc_id; chỉ tổng hợp ý còn lại khi cũng được top3 chứng minh.
- Trả lời ngắn bằng tiếng Việt. Gắn [DOC-xx] ngay sau thông tin lấy từ tài liệu tương ứng; không bịa nguồn.

# Phân biệt reason
- personal_data: phải kiểm tra trường hợp/hồ sơ riêng, ví dụ chưa được cộng XP, phân nhóm của mình, xác nhận điểm cá nhân.
- no_source: chủ đề chương trình có thể hiểu rõ nhưng tài liệu truy xuất không đủ để trả lời.
- out_of_scope: yêu cầu ngoài phạm vi chính sách/tài liệu mà AskOnce xử lý.
- correction: người dùng nói câu trả lời trước sai.

# Ví dụ phân loại
- "Mình không thấy nhóm được xếp" => ESCALATE/personal_data.
- "Phoenix không đăng nhập được" và askedOnce=false => CLARIFY, hỏi lỗi đang hiển thị.
- "Muộn sau 23h59 thì sao?" => CLARIFY, hỏi đang nói nộp Lab, vào lớp hay việc khác.
- "Điểm nào ảnh hưởng tới thực tập?" => ESCALATE/no_source.
- "BTC có cấp thiết bị cho đề tài phần cứng không?" => ESCALATE/out_of_scope.
- "Daily standup ở đâu và cách tăng XP?" => ANSWER, lấy daily standup (ý đầu tiên) làm nguồn chính nếu DOC-03 có trong top3.

# Ràng buộc đầu ra
Trả đúng object theo JSON schema do API cung cấp. Không markdown, không thêm khóa. Các trường không áp dụng phải là null:
- ANSWER: doc_id và answer khác null; reason và question là null.
- CLARIFY: question khác null; doc_id, reason và answer là null.
- ESCALATE: reason khác null; doc_id, question và answer là null.

Trước khi xuất JSON, tự kiểm tra lại thứ tự quyết định, nguồn và các trường null.`;

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

function deterministicDecision({ top3 }) {
  // UI-only mock: use retrieval confidence, never rules tailored to eval questions.
  const preferred = top3.find((document) => Number(document.score) >= 3 && ANSWERS[document.id]);
  if (preferred) {
    return {
      label: "ANSWER", doc_id: preferred.id, reason: null,
      question: null, answer: ANSWERS[preferred.id],
    };
  }
  return {
    label: "ESCALATE", doc_id: null, reason: "out_of_scope",
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

const RETRYABLE_STATUSES = new Set([429, 503]);

function retryDelayMs(response, retryIndex) {
  const retryAfter = response.headers?.get?.("retry-after");
  if (retryAfter != null && retryAfter !== "") {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1000;
    const date = Date.parse(retryAfter);
    if (Number.isFinite(date)) return Math.max(0, date - Date.now());
  }
  return 250 * (2 ** retryIndex);
}

const defaultSleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function fetchWithRetry(url, options, { maxRetries = 2, sleep = defaultSleep } = {}) {
  for (let attempt = 0; ; attempt += 1) {
    const response = await fetch(url, options);
    const shouldRetry = RETRYABLE_STATUSES.has(response.status) && attempt < maxRetries;
    if (!shouldRetry) return response;
    await sleep(retryDelayMs(response, attempt));
  }
}

async function loadConfig() {
  if (globalThis.ASKONCE_AI_CONFIG) return globalThis.ASKONCE_AI_CONFIG;
  // config.local.js is a browser-only demo setting. Node eval must continue to
  // read provider credentials from process.env even when that local file exists.
  if (typeof window !== "undefined") {
    try {
      const local = await import("./config.local.js");
      return local.default || local.config;
    } catch (error) {
      const missing = String(error?.code || error?.message).includes("MODULE_NOT_FOUND") ||
        String(error?.message).includes("Failed to fetch");
      if (!missing) console.warn("AskOnce could not load config.local.js:", error.message);
    }
  }
  if (typeof process !== "undefined" && process.env) {
    const provider = (process.env.ASKONCE_PROVIDER ||
      ((process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) && !process.env.OPENAI_API_KEY && !process.env.ASKONCE_API_KEY ? "gemini" : "openai"))
      .toLowerCase();
    return {
      provider,
      apiKey: provider === "gemini"
        ? process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.ASKONCE_API_KEY
        : process.env.OPENAI_API_KEY || process.env.ASKONCE_API_KEY,
      baseUrl: process.env.ASKONCE_BASE_URL,
      model: process.env.ASKONCE_MODEL || (provider === "gemini" ? "gemini-2.5-flash" : undefined),
    };
  }
  return {};
}

async function callOpenAICompatible(config, payload) {
  const baseUrl = (config.baseUrl || "https://api.openai.com/v1").replace(/\/$/, "");
  const response = await fetchWithRetry(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.apiKey}` },
    body: JSON.stringify({
      model: config.model,
      temperature: 0,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "askonce_decision",
          strict: true,
          schema: DECISION_SCHEMA,
        },
      },
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

const DECISION_SCHEMA = {
  type: "object",
  properties: {
    label: { type: "string", enum: ["ANSWER", "CLARIFY", "ESCALATE"] },
    doc_id: { type: ["string", "null"] },
    reason: { type: ["string", "null"], enum: ["personal_data", "no_source", "out_of_scope", "correction", null] },
    question: { type: ["string", "null"] },
    answer: { type: ["string", "null"] },
  },
  required: ["label", "doc_id", "reason", "question", "answer"],
  additionalProperties: false,
};

async function callGemini(config, payload) {
  const baseUrl = (config.baseUrl || "https://generativelanguage.googleapis.com/v1beta").replace(/\/$/, "");
  const response = await fetchWithRetry(`${baseUrl}/models/${encodeURIComponent(config.model)}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": config.apiKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: JSON.stringify(payload) }] }],
      generationConfig: {
        temperature: 0,
        responseMimeType: "application/json",
        // Use the JSON-Schema field rather than the older protobuf Schema field.
        // This supports nullable unions and additionalProperties.
        responseJsonSchema: DECISION_SCHEMA,
      },
    }),
  });
  if (!response.ok) throw new Error(`Gemini returned HTTP ${response.status}: ${await response.text()}`);
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("");
  return extractJson(text);
}

function callConfiguredProvider(config, payload) {
  const provider = String(config.provider || "openai").toLowerCase();
  if (provider === "openai") return callOpenAICompatible(config, payload);
  if (provider === "gemini") return callGemini(config, payload);
  throw new Error(`Unsupported AI provider: ${provider}`);
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
    const provider = String(config.provider || "openai").toLowerCase();
    const output = await callConfiguredProvider(config, payload);
    globalThis.ASKONCE_TRACE?.({ mode: "configured-model", provider, model: config.model, input: payload, output });
    return output;
  } catch (error) {
    // A provider outage or malformed JSON is a no-source outcome, never permission
    // to improvise an answer. Do not include the API key in traces.
    globalThis.ASKONCE_TRACE?.({
      mode: "configured-model", provider: String(config.provider || "openai").toLowerCase(), model: config.model, input: payload,
      error: error instanceof Error ? error.message : String(error),
    });
    return { label: "ESCALATE", doc_id: null, reason: "no_source", question: null, answer: null };
  }
}

export { SYSTEM_PROMPT, DECISION_SCHEMA, deterministicDecision, extractJson, fetchWithRetry };
