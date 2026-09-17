// codebase/engine/index.js — HỢP ĐỒNG giữa UI (Hùng) và engine (Hưởng)
//
// Đây là STUB trả dữ liệu cứng 3 case mẫu để UI chạy được trước.
// Hưởng thay phần thân hàm bằng ② retrieve → ③ AI → ④ verify,
// GIỮ NGUYÊN tên hàm, tham số và hình dạng kết quả.
//
// decide({ question, history, askedOnce })
//   question  : string   — câu học viên vừa gõ (bước ①)
//   history   : string[] — 2–3 tin trước của cùng người trong kênh, cũ → mới
//                          (kể cả câu bot vừa trả lời, để bắt "cái hai" / "sai rồi")
//   askedOnce : boolean  — cờ đã_hỏi_lại trong chuỗi này (bước ⑤, UI giữ)
//
// → Promise<{
//   label    : "ANSWER" | "CLARIFY" | "ESCALATE",
//   doc_id   : "DOC-xx" | null,          // bắt buộc khi ANSWER
//   reason   : "personal_data" | "no_source" | "out_of_scope" | "correction" | null,
//   question : string | null,            // bắt buộc khi CLARIFY (1 câu tự nhiên)
//   answer   : string | null,
//   top3     : { id: string, title: string, snippet: string }[]   // kết quả bước ②
// }>

const TOP3_XP = [
  { id: "DOC-01", title: "Cách tính XP", snippet: "XP bắt đầu tính từ buổi học đầu tiên của Build Phase…" },
  { id: "DOC-03", title: "Điểm danh & chuyên cần", snippet: "Check-in trước giờ học 15 phút…" },
  { id: "DOC-05", title: "Bảng xếp hạng /rank", snippet: "Lệnh /rank hiện XP và thứ hạng hiện tại…" },
];

const TOP3_LATE = [
  { id: "DOC-04", title: "Hạn nộp bài tập", snippet: "Bài nộp sau 23:59 ngày hạn bị trừ 50% XP…" },
  { id: "DOC-03", title: "Điểm danh & chuyên cần", snippet: "Vào lớp muộn quá 15 phút tính vắng…" },
  { id: "DOC-06", title: "Ticket hỗ trợ TA", snippet: "Tạo ticket tại kênh #support…" },
];

export async function decide({ question, history = [], askedOnce = false }) {
  const q = question.trim().toLowerCase();
  const last = (history[history.length - 1] || "").toLowerCase();

  // Học viên phủ nhận câu ANSWER vừa rồi → correction (flow-v2: về ① kèm câu cũ)
  if (/^(sai|sai rồi|không đúng|không phải)/.test(q) && last.includes("[doc-")) {
    return { label: "ESCALATE", doc_id: null, reason: "correction", question: null, answer: null, top3: TOP3_XP };
  }

  // Case ESCALATE · personal_data — R03 "Tôi cần xem điểm của tôi"
  if (/điểm của tôi|điểm của mình|xem điểm|xp của tôi/.test(q)) {
    return { label: "ESCALATE", doc_id: null, reason: "personal_data", question: null, answer: null, top3: TOP3_XP };
  }

  // Case CLARIFY · M20574 "muộn sau 23h59" — thiếu ngữ cảnh
  if (/muộn|trễ|23h59|23:59/.test(q) && !/nộp|bài|điểm danh|vào lớp/.test(q)) {
    if (askedOnce) {
      return { label: "ESCALATE", doc_id: null, reason: "no_source", question: null, answer: null, top3: TOP3_LATE };
    }
    return {
      label: "CLARIFY", doc_id: null, reason: null,
      question: "Bạn đang hỏi muộn khi nộp bài, muộn khi vào lớp, hay chuyện khác?",
      answer: null, top3: TOP3_LATE,
    };
  }

  // Sau CLARIFY, học viên trả lời "nộp bài" → ANSWER có nguồn
  if (/nộp|bài/.test(q) && /muộn|trễ|23/.test(q + " " + last)) {
    return {
      label: "ANSWER", doc_id: "DOC-04", reason: null, question: null,
      answer: "Bài nộp sau 23:59 ngày hạn vẫn được nhận nhưng bị trừ 50% XP của bài đó; sau 3 ngày thì không tính XP. [DOC-04]",
      top3: TOP3_LATE,
    };
  }

  // Case ANSWER · M49945 "khi nào bắt đầu tính điểm XP?"
  if (/xp|điểm kinh nghiệm|tính điểm/.test(q)) {
    return {
      label: "ANSWER", doc_id: "DOC-01", reason: null, question: null,
      answer: "XP bắt đầu tính từ buổi học đầu tiên của Build Phase, gồm điểm danh, nộp bài đúng hạn và hoạt động trên Discord. [DOC-01]",
      top3: TOP3_XP,
    };
  }

  // Chit-chat / ngoài phạm vi
  return { label: "ESCALATE", doc_id: null, reason: "out_of_scope", question: null, answer: null, top3: [] };
}
