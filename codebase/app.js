// codebase/app.js — phần UI của flow-v2: ① nhận tin, ⑤ cờ đã_hỏi_lại, ⑥ đọc reason.
// Chỉ gọi decide() từ engine/, không biết prompt hay kb/ ở trong.
import { decide } from "./engine/index.js";

const $ = (id) => document.getElementById(id);
const chat = $("chat"), chips = $("chips"), input = $("input"), composer = $("composer");

// ---- state của một chuỗi hỏi-đáp ----
const state = {
  history: [],       // ① 2–3 tin gần nhất (cả học viên lẫn bot), cũ → mới
  askedOnce: false,  // ⑤ đã CLARIFY trong chuỗi này chưa — code giữ, không tin AI nhớ
  lastAnswer: null,  // câu ANSWER gần nhất, để điền mẫu ticket khi correction
  lastTop3: [],      // DOC đã tra, để điền mẫu ticket
};

const REASON_TEXT = {
  personal_data: "Câu này cần xem dữ liệu cá nhân (điểm, điểm danh của riêng bạn) — mình không tra được, TA sẽ hỗ trợ.",
  no_source:     "Mình không tìm thấy quy định nào trong tài liệu khớp với câu hỏi, nên không tự trả lời để tránh sai.",
  correction:    "Bạn báo câu trả lời trước chưa đúng — mình không đoán lại lần nữa mà chuyển TA kiểm tra.",
  out_of_scope:  "Mình chỉ hỗ trợ các quy định của Build Phase (XP, điểm danh, hạn nộp, ticket…).",
};

function pushHistory(text) {
  state.history.push(text);
  if (state.history.length > 3) state.history.shift();
}

function addMsg(who, html) {
  const el = document.createElement("div");
  el.className = `msg ${who}`;
  el.innerHTML = `<div class="who">${who === "user" ? "Bạn" : "AskOnce"}</div><div class="bubble">${html}</div>`;
  chat.appendChild(el);
  chat.scrollTop = chat.scrollHeight;
  return el;
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

// ---- bước ④⑤⑥ phía UI: code kiểm sau AI, rồi rẽ nhánh ----
function route(res) {
  const notes = [];
  let { label, doc_id, reason } = res;
  const top3Ids = (res.top3 || []).map((d) => d.id);

  // ④ phòng hờ: engine đã kiểm, UI kiểm lại lần nữa — ANSWER không có DOC trong top-3 thì không trả lời
  if (label === "ANSWER" && !top3Ids.includes(doc_id)) {
    notes.push(`④ doc_id=${doc_id} ∉ top-3 → ép ESCALATE/no_source`);
    label = "ESCALATE"; reason = "no_source"; doc_id = null;
  }
  // ⑤ đã hỏi lại rồi mà AI vẫn CLARIFY → ESCALATE, không hỏi lần 2
  if (label === "CLARIFY" && state.askedOnce) {
    notes.push("⑤ đã_hỏi_lại=true mà vẫn CLARIFY → ép ESCALATE/no_source");
    label = "ESCALATE"; reason = "no_source";
  }
  if (label === "ESCALATE") notes.push(`⑥ reason=${reason} → ${reason === "out_of_scope" ? "không kèm ticket" : "kèm mẫu ticket"}`);
  if (!notes.length) notes.push(`${label} · AI và code đồng ý`);
  return { label, doc_id, reason, notes };
}

function renderAnswer(res) {
  const doc = res.top3.find((d) => d.id === res.doc_id);
  const html = `${esc(res.answer)}
    <div class="source">Nguồn: <b>${esc(res.doc_id)}</b> · ${esc(doc?.title || "")}</div>
    <div class="actions"><button type="button" class="ghost small" data-say="Sai rồi">Sai rồi</button></div>`;
  state.lastAnswer = res.answer;
  return html;
}

function renderClarify(res) {
  state.askedOnce = true; // ⑤ đặt cờ ngay khi gửi câu hỏi lại
  showChips(res.top3.slice(0, 3).map((d) => d.title));
  return `${esc(res.question)}<div class="hint">Gõ tự do hoặc chọn một gợi ý bên dưới.</div>`;
}

function renderEscalate(reason, question) {
  let html = esc(REASON_TEXT[reason] || REASON_TEXT.no_source);
  if (reason === "out_of_scope") return html + `<div class="end">Kết thúc · không tạo ticket</div>`;
  const ticket = [
    "[Ticket TA] AskOnce chuyển tiếp",
    `Câu hỏi: ${question}`,
    `Đã tra: ${state.lastTop3.map((d) => d.id).join(", ") || "(không có)"}`,
    `Câu trả lời cũ: ${state.lastAnswer || "(không có)"}`,
    `Lý do: ${reason}`,
  ].join("\n");
  html += `<div class="ticket"><div class="ticket-h">Mẫu ticket điền sẵn — bạn tự gửi vào #support</div><pre>${esc(ticket)}</pre>
    <button type="button" class="ghost small" data-copy="${esc(ticket)}">Sao chép</button></div>
    <div class="end">Bạn tạo ticket · TA sẽ hỗ trợ</div>`;
  return html;
}

function showChips(list) {
  chips.innerHTML = list.map((t) => `<button type="button" data-say="${esc(t)}">${esc(t)}</button>`).join("");
  chips.hidden = list.length === 0;
}

function trace(res, routed) {
  $("t-history").textContent = state.history.length ? state.history.map((h) => `· ${h}`).join("\n") : "—";
  $("t-asked").textContent = String(state.askedOnce);
  $("t-top3").textContent = res.top3.length ? res.top3.map((d) => `${d.id} ${d.title}`).join("\n") : "(rỗng)";
  $("t-json").textContent = JSON.stringify({ label: res.label, doc_id: res.doc_id, reason: res.reason, question: res.question }, null, 1);
  $("t-route").textContent = routed.notes.join("\n");
}

// ---- ① nhận tin: câu hỏi + history → decide → rẽ nhánh ----
async function ask(text) {
  addMsg("user", esc(text));
  showChips([]);
  input.value = "";
  const thinking = addMsg("bot", `<span class="dots">…</span>`);

  let res;
  try {
    res = await decide({ question: text, history: [...state.history], askedOnce: state.askedOnce });
  } catch (e) {
    res = { label: "ESCALATE", doc_id: null, reason: "no_source", question: null, answer: null, top3: [] };
    console.error(e);
  }
  res.top3 = res.top3 || [];
  state.lastTop3 = res.top3;

  const routed = route(res);
  let html;
  if (routed.label === "ANSWER") html = renderAnswer(res);
  else if (routed.label === "CLARIFY") html = renderClarify(res);
  else html = renderEscalate(routed.reason, text);

  thinking.querySelector(".bubble").innerHTML = html;
  trace(res, routed);

  // ① lưu vào history cả câu học viên lẫn câu bot, để lượt sau bắt được "cái hai" / "sai rồi"
  pushHistory(text);
  const botLine = thinking.querySelector(".bubble").innerText.split("\n")[0];
  pushHistory(routed.label === "ANSWER" && !botLine.includes(`[${res.doc_id}]`) ? `${botLine} [${res.doc_id}]` : botLine);
}

composer.addEventListener("submit", (e) => { e.preventDefault(); const t = input.value.trim(); if (t) ask(t); });
document.addEventListener("click", (e) => {
  const say = e.target.dataset?.say, copy = e.target.dataset?.copy;
  if (say) ask(say);
  if (copy) navigator.clipboard?.writeText(copy).then(() => (e.target.textContent = "Đã chép"));
});
$("reset").addEventListener("click", () => {
  Object.assign(state, { history: [], askedOnce: false, lastAnswer: null, lastTop3: [] });
  chat.innerHTML = ""; showChips([]);
  ["t-history", "t-top3", "t-json", "t-route"].forEach((id) => ($(id).textContent = "—"));
  $("t-asked").textContent = "false";
  addMsg("bot", "Chào bạn, hỏi mình về quy định Build Phase nhé.");
});

$("reset").click();
