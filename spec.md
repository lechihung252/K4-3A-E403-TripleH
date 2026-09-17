# AI SPEC — AskOnce · Nhóm TripleH · Zone 5
Hướng: [ ] A — VLearn  [x] B — Trợ lý Học viên  [ ] C — Làn mở
Loại: [x] Tối ưu tính năng có sẵn  [ ] Tính năng mới

> Chốt trước 21:00 17/9 (CP4). Quality bar ở §7 giữ nguyên sau thời điểm nộp.
> Canvas 4 ô: `canvas-cp1.md` · Golden set + kết quả: `eval/` · Nhật ký dùng thử: `validation/`

## §1. User & Job
- Job executor + workflow (đính kèm worksheet JTBD / ảnh sơ đồ):
- Core JTBD (không tên sản phẩm/AI trong câu):
- Problem statement (KHÔNG chữ AI):
- Evidence (chuẩn A và/hoặc B — log đầy đủ trong repo):
  - Số liệu mining / kết quả khảo sát (n = ?, % xác nhận):
  - ≥5 quote/ví dụ nguyên văn + nguồn:

## §2. Impact & quyết định chọn
- Bảng impact ≥3 ứng viên (bao nhiêu người · tần suất · tốn gì mỗi lần · khả thi):
- Ứng viên ĐÃ LOẠI + vì sao:
- Ứng viên CHỌN + vì sao (bằng số):

## §3. Giải pháp tương tự đã nghiên cứu
- [Sản phẩm 1]: flow / đáng học / đáng né / mình khác gì
- [Sản phẩm 2]: ...

## §4. Thiết kế
- Lát cắt MỘT CÂU (1 user · 1 việc · 1 quyết định AI · 1 kết quả): Một học viên K4 · hỏi bot một câu về quy định Build Phase · AI quyết định **trả lời ngay** (câu đã rõ và có căn cứ trong `kb/`), **hỏi lại đúng một câu** (thật sự thiếu thông tin), hoặc **chuyển TA** (không có căn cứ hoặc hỏi dữ liệu cá nhân) · học viên nhận câu trả lời có dẫn nguồn (DOC-xx) trong một lượt, không phải chọn menu 1/2/3.
- Non-goals (≥3 thứ KHÔNG build):
  1. Không hỗ trợ tạo/nộp ticket thay học viên — chỉ đưa mẫu điền sẵn (`docs/mau-ticket-escalate.md`), học viên tự xác nhận và gửi.
  2. Không hỏi lại quá 1 lần trong CLARIFY — lần 2 vẫn không rõ thì ép thành ESCALATE (chốt bằng code, không để LLM tự quyết định lặp).
  3. Không trả lời (ANSWER) khi `doc_id` không nằm trong top-3 tài liệu tra được — kể cả khi AI "tự tin" muốn trả lời, code vẫn ép chuyển ESCALATE (`reason: no_source`).
  4. Không trả dữ liệu cá nhân (điểm, điểm danh, XP của riêng một học viên) — luôn chuyển ticket TA (`reason: personal_data`), không tra `kb/` cho loại câu hỏi này.
- Mức prototype nhắm tới: [ ] Sketch [x] Mock [ ] Working — Mock: flow bấm được trọn (nhận câu hỏi → tra `kb/` → hiện kết quả), **AI thật ở lõi** (bước ③ gọi LLM 1 lần, trả JSON `label/doc_id/reason/question/answer` — `doc_id` là **một** mã DOC-xx, phải nằm trong top-3 bước ②); phần "gửi ticket thật cho TA" và nguồn `kb/` là tự dựng/mô phỏng, ghi rõ trong `codebase/README.md`.
- Automation: [ ] augment [x] conditional [ ] automate — lý do theo cost-of-error: trả lời sai về XP/điểm danh/deadline khiến học viên mất điểm hoặc lỡ việc (đắt, khó sửa) → không cho AI tự trả lời khi thiếu căn cứ; nhưng hỏi lại thừa cho câu đã rõ cũng có giá — đang chiếm 20% câu trả lời của bot cũ, khiến học viên mất 3-10 phút mỗi lần (bằng chứng B, `canvas-cp1.md` §02) → nên để AI tự trả lời khi có nguồn, chỉ hỏi lại/chuyển người khi thật sự cần.
- §4b. Nguyên tắc đã áp dụng (≥4 — HAX/PAIR, xem guide):
  | Nguyên tắc | Áp cụ thể vào đâu trong prototype |
  |---|---|
  | **G2** — làm rõ nó làm tốt đến đâu | Mọi câu ANSWER hiện kèm "trả lời dựa trên [DOC-xx]"; nếu không có DOC-xx phù hợp thì không trả lời liều mà nói rõ chuyển TA — học viên biết khi nào nên tin. |
  | **G10** — thu hẹp phạm vi khi nghi ngờ *(bắt buộc)* | Bước ③④⑤: `doc_id` ngoài top-3 → ép `ESCALATE (no_source)`; nghi ngờ do thiếu ngữ cảnh → `CLARIFY` tối đa 1 câu, không "làm liều" đoán câu trả lời. |
  | **G11** — giải thích vì sao | Nhánh ANSWER và mẫu ticket (`docs/mau-ticket-escalate.md`) đều hiện dòng lý do cụ thể ("dựa trên DOC-xx" / "chưa tìm thấy tài liệu nói đúng câu này"), không chỉ báo kết quả suông. |
  | **G9** — sửa dễ dàng | Nhánh Correction: học viên phản hồi câu trả lời sai → quay lại bước ① với câu hỏi cũ, hoặc chọn thẳng ESCALATE — không phải mở lại từ đầu. |

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản (≥8) [bảng theo guide §2.5]

## §6. Bốn đường đi của trải nghiệm
- **Happy path:** câu hỏi rõ, ② tra `kb/` ra ≥1 DOC-xx đúng chủ đề → ③ AI trả `ANSWER`, `doc_id` nằm trong top-3 → hiện câu trả lời kèm dẫn nguồn trong một lượt, không cần chọn menu.
- **Low-confidence (②) — thiếu ngữ cảnh:** câu hỏi thiếu thông tin thật (vd "muộn sau 23h59" không nói muộn việc gì) → ③ trả `CLARIFY` + 1 câu hỏi lại gợi từ top-3 DOC → học viên trả lời → quay lại ① với ngữ cảnh mới. Đã hỏi lại 1 lần (`askedOnce=true`) mà vẫn `CLARIFY` → code ép thành `ESCALATE`, không hỏi lại lần 2.
- **Failure/không căn cứ (①):** ② không tra ra DOC-xx nào khớp, hoặc ③ trả `doc_id` không nằm trong top-3 → ④ code kiểm và ép `ESCALATE (reason: no_source)` — không để AI tự bịa câu trả lời khi thiếu căn cứ.
- **Correction (user sửa):** học viên phản hồi câu ANSWER là sai/chưa đúng ý → quay lại bước ① kèm câu hỏi cũ + phản hồi, hoặc học viên chọn thẳng ESCALATE nếu muốn hỏi TA luôn — không bắt gõ lại câu hỏi từ đầu (G9).
- **Khi bị đòi ngoài phạm vi (③):** câu hỏi là quyết định của BTC/mentor (vd "chủ đề phần cứng tự chuẩn bị hay BTC cấp") mà `kb/` không có căn cứ chính thức → `ESCALATE (reason: out_of_scope)`, mẫu ticket ghi rõ lý do (`docs/mau-ticket-escalate.md`).
- **Case đặc thù domain (④):** câu hỏi đụng dữ liệu cá nhân của học viên (điểm, điểm danh, sự cố tài khoản riêng — vd "sao mình không thấy thuộc nhóm G nào") → luôn `ESCALATE (reason: personal_data)` ngay từ bước ③, không tra `kb/` cho loại này dù có vẻ liên quan đến chủ đề chung.

## §7. Kiểm thử
- Chiều chất lượng + định nghĩa kiểm chứng được:
  - **Nhãn đúng (Relevance):** pass nếu `label` (ANSWER/CLARIFY/ESCALATE) AI trả khớp `expected.label` trong golden set; fail nếu lệch.
  - **Có căn cứ, không bịa (Factuality):** với mọi case `ANSWER`, pass chỉ khi `doc_id` trả về nằm trong top-3 mà bước ② tra ra (kiểm bằng code, không chấm cảm tính) và trùng `expected.doc_id`; nếu AI trả `ANSWER` mà không có `doc_id` hợp lệ → tự động fail case đó dù nhãn đúng.
- Golden set (≥20 case theo cơ cấu trong guide §2.6, file trong `eval/`): dựng từ danh sách msg_id đã gán nhãn tay ở `docs/golden-set-msg-ids-cho-huong.md` (62 case: 52 ANSWER · 5 CLARIFY · 5 ESCALATE, gán theo phương pháp ở `docs/nhan-tay-63-menu.md`) — Hưởng chọn lọc đủ đa dạng chủ đề (khớp `kb/DOC-01..09`) và giữ toàn bộ 10 case CLARIFY/ESCALATE để không lệch hẳn về 1 lớp, bổ sung thêm case tự viết cho ≥8 kịch bản rủi ro ở CP4 (spec §5).
- Quality bar (chốt từ hạn chốt spec của khoá, giữ nguyên sau đó): "Đạt khi ≥ ___% qua bộ, và **không case nào ANSWER sai nguồn (Factuality fail = 0)**" — **[nhóm chốt số % cụ thể trước 21:00 17/9, dựa trên kết quả lượt chạy đầu tại CP3]**.
- Kết quả các lượt chạy (bảng % — cập nhật đến trước CP6): **[chờ Hưởng chạy `eval/run.js` trên golden set — điền bảng `lượt | ngày giờ | số case | số đúng | %  | 1 failure đáng kể nhất` sau khi có kết quả thật, không điền số khi chưa chạy]**.

## §8. Phân công & kế hoạch
- Phân công có tên: spec / evidence / prompt / code / demo
- Willing users (≥2 tên) + kế hoạch vòng validation *(bonus, nếu làm)*:
- Multi-prototype (nếu làm): trục khác biệt của ≥2 phương án + lý do chọn:

## §9. Changelog
| Thời điểm | Đổi gì | Vì sao (trỏ về feedback/case nào) |
|---|---|---|
