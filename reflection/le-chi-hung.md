# Reflection cá nhân — Lê Chí Hùng · 2A202602863

> Nhóm TripleH · Zone 5 · Track B · Sản phẩm: **AskOnce** — trợ lý Discord trả lời quy định Build Phase, AI quyết định ANSWER / CLARIFY / ESCALATE trong một lượt thay vì bắt học viên chọn menu 1/2/3.

## 1. Vai trò trong nhóm

Tôi phụ trách **Prototype + Validation**: dựng giao diện demo bấm được, vẽ sơ đồ luồng để cả nhóm cùng tham chiếu, quay video CP3, và tổ chức phiên dùng thử với người ngoài nhóm (`validation/`). Ngoài ra tôi là người tạo repo và giữ cấu trúc thư mục từ CP1, nên cũng là người "khâu" spec, engine và UI lại với nhau ở các đoạn cần đồng bộ.

## 2. Phần mình đã làm

| Việc | Bằng chứng trong repo | Kết quả / con số |
|---|---|---|
| Khởi tạo repo, cấu trúc thư mục chuẩn, canvas CP1 + evidence log | commit `63719cc`, `c21d5b3`; `canvas-cp1.md` | Nộp CP1, CP2 đúng hạn |
| Sơ đồ luồng **flow-v2** (6 bước, chỉ ③ là AI) + bảng so sánh với 2 luồng cũ | `docs/flow-v2.html`, `docs/flow-v2.png`; commit `621533b`, `7dd2bba` | Cả nhóm chốt luồng 2 (tra `kb/` trước → AI trả JSON → code kiểm nguồn) thay vì luồng 1 (AI phân loại trước, không kiểm nguồn) |
| Prototype UI AskOnce: nhận câu hỏi + history ①, cờ `askedOnce` ⑤, đọc `reason` → màn hình kết thúc ⑥, vòng "Sai rồi" (correction) | `codebase/index.html`, `app.js`, `style.css`; commit `2d8a473`, `89fc5ab` | Flow bấm hết được; mọi reason ESCALATE đều kèm mẫu ticket điền sẵn; badge báo đang chạy model thật hay local adapter |
| Chốt **hợp đồng `decide({question, history, askedOnce})`** giữa UI và engine để 3 người làm song song không conflict | `codebase/README.md` bảng "Cấu trúc và người sở hữu"; changelog 17/9 10:40 | UI không biết gì về prompt/kb; Hưởng làm engine, tôi làm UI độc lập |
| Đồng bộ spec §4, mẫu ticket với hợp đồng engine (`doc_ids` → `doc_id`, thêm reason `correction`) | commit `3332c7c` | Spec, UI, engine nói cùng một ngôn ngữ |
| Chạy lượt AI thật đầu tiên, ghi kết quả | commit `049885c`; `eval/run-openai-1.md`, `run-gemini-1.md` | 26/32 (81,3%); Gemini rụng 21 case vì rate-limit |
| Điền spec §5, §7, §8, §9 từ số liệu eval | commit `9116ea5` | Quality bar chốt ≥85% + Factuality fail = 0 |
| Nghiên cứu **NotebookLM** làm giải pháp tương tự (spec §3) | commit `d72f10f`; ảnh `validation/notebooklm-*.png` | 3 điểm đáng học, 3 điểm đáng né, 1 đoạn "mình khác gì" |
| Video CP3 30 giây | [điền link/file] | Nộp CP3 đúng hạn |
| Validation với ≥2 willing user | `validation/` — [đang làm, cập nhật sau phiên thử] | [số người thử · quote · thay đổi] |

**Một quyết định tôi tự đưa ra:** ở `app.js` tôi **kiểm lại ④ và ⑤ một lần nữa phía UI** (ANSWER mà `doc_id ∉ top-3` → ép ESCALATE/no_source; CLARIFY lần 2 → ép ESCALATE) dù engine đã có `verify.js`. Lý do: UI là lớp cuối cùng trước khi tới học viên, và cost-of-error của nhóm là "sai về XP/điểm danh thì mất điểm" — tôi không muốn một bug ở engine hay một adapter mới nào đó lọt ra màn hình mà không bị chặn.

## 3. AI đã hỗ trợ mình thế nào

- **Tool:** Claude Code (trong VS Code) cho phần code UI, sơ đồ flow, và viết/đồng bộ spec; NotebookLM để làm §3 giải pháp tương tự.
- **Dùng ở đâu:**
  - Dựng khung `index.html`/`app.js`/`style.css` từ mô tả luồng ①–⑥ — AI viết nhanh phần boilerplate, tôi sửa logic rẽ nhánh và mẫu ticket.
  - Vẽ `flow-v2.html` (HTML tĩnh) và xuất PNG để nhúng vào spec.
  - Đọc `eval/run-*.md`, `trace/` rồi tóm lại thành bảng §5/§7 trong spec.
- **Chỗ AI làm tốt:** boilerplate UI, chuyển mô tả bằng lời thành sơ đồ, gom số liệu rải rác trong repo thành bảng có link.
- **Chỗ AI làm sai / tôi phải tự sửa:** [điền 1 ví dụ cụ thể — gợi ý: lần đầu AI viết UI tự đọc `kb/` trực tiếp thay vì qua `decide()`, làm vỡ hợp đồng với engine; hoặc AI nhét sẵn "policyGuardrail" kiểu regex vào UI; hoặc mẫu ticket AI sinh ra không khớp `docs/mau-ticket-escalate.md` của Hoàng]
- **Cách tôi kiểm output của AI:** chạy prototype qua `python3 -m http.server` và bấm thử 3 nhánh + vòng "Sai rồi" trước mỗi commit; so từng dòng reason/ticket với `docs/mau-ticket-escalate.md`; với phần spec, mọi con số đều phải trỏ được về một file trong `eval/` — cái nào AI viết mà không có nguồn thì bỏ.

## 4. Một bài học từ case fail của chính nhóm

**Chuyện gì xảy ra:** Sáng 17/9 engine có một lượt chạy **100%** trên golden set. Nhìn số đẹp cả nhóm mừng — nhưng khi soi lại, con số đó đến từ `policyGuardrail`: một lớp regex đè lên kết quả model, viết theo đúng các câu trong golden set. Tức là không phải AI đúng, mà là code "học thuộc" đáp án. Điều này vi phạm thẳng yêu cầu CP3 "lời gọi AI thật, không hardcode".

**Nhóm phát hiện bằng cách nào:** đối chiếu với lượt AI thật đầu tiên `run-openai-1` (26/32, 81,3%, 5/5 case CLARIFY sai) — chênh lệch quá lớn với 100% nên đọc lại `verify.js` và thấy regex.

**Đã sửa ra sao:** commit `37f24cf` bỏ `policyGuardrail`; `verify.js` chỉ giữ luật bất biến (doc_id ∈ top-3, chặn CLARIFY lần 2), không sửa nhãn model. Vấn đề CLARIFY được sửa **ở prompt** (thêm định nghĩa + ví dụ M20574, M61735) thay vì ở regex → `run-model-1` 28/32 (87,5%), 4 case sai đều lệch về phía ESCALATE, không bịa. Quality bar chốt ở 85% dựa trên con số thật này.

**Bài học:** số đẹp bất thường là dấu hiệu để nghi ngờ, không phải để ăn mừng. Một con số 81% trung thực có phân tích được vì sao sai có giá trị hơn 100% không giải thích được — và cũng là lý do tôi kiểm lại ④⑤ ở UI bằng luật bất biến chứ không bằng regex theo case.

## 5. Nếu có thêm 1 tuần

- Làm validation sớm hơn: đáng lẽ đưa prototype cho willing user bấm ngay khi flow chạy được (CP2/CP3) thay vì đợi engine hoàn thiện — feedback về màn hình ESCALATE/ticket không cần AI đúng 100% mới thu được.
- Cắm Discord API thật thay cho web mô phỏng, để đo pain "hỏi lại thừa" trên kênh thật.
