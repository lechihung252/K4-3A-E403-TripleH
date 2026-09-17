# Reflection cá nhân — Vũ Việt Hoàng · 2A202602398

> Nhóm TripleH · Zone 5 · Track B · Sản phẩm: **AskOnce** — trợ lý Discord trả lời quy định Build Phase, AI quyết định ANSWER / CLARIFY / ESCALATE trong một lượt thay vì bắt học viên chọn menu 1/2/3.

## 1. Vai trò trong nhóm

Tôi là **đội trưởng**, phụ trách **Spec + Evidence**: nộp cả 5 checkpoint, giữ `spec.md`, `kb/`, `docs/` không để ai đụng chéo (đúng nguyên tắc chia theo thư mục để tránh conflict git), thu bằng chứng (mining, gán nhãn tay, khảo sát) và khoá quality bar dựa trên số thật.

Ở CP1 tôi là người đề xuất ý tưởng AskOnce và bảo vệ hướng đi này trong buổi thảo luận nhóm. Ở CP2 tôi vẽ workflow đầu tiên (tra tài liệu trước → AI quyết định → kiểm lại bằng code), sau đó cả nhóm cùng góp ý và Hùng dựng thành sơ đồ chính thức `docs/flow-v2.html`/`flow-v2.png` — bản v2 giữ đúng khung 3 nhánh ANSWER/CLARIFY/ESCALATE tôi đề xuất, thêm nhánh Correction và bước kiểm nguồn bằng code sau AI mà nhóm bổ sung khi thảo luận. Nhận vai trò này vì tôi là người theo sát nhất phần "đạt là gì" của sản phẩm — quality bar, evidence, chuẩn nghiệm thu — thay vì phần code.

## 2. Phần mình đã làm

| Việc | Bằng chứng trong repo | Kết quả / con số |
|---|---|---|
| Đề xuất ý tưởng AskOnce, bảo vệ trước nhóm (CP1) | `canvas-cp1.md`; changelog spec §9 dòng "16/9 20:30 — Chốt AskOnce, canvas 4 ô" | Nhóm chốt hướng "tối ưu bot Trợ lý có sẵn" thay vì xây tính năng mới |
| Vẽ workflow cơ bản đầu tiên (CP2), cùng nhóm cải tiến thành flow-v2 | spec §9 dòng "17/9 08:30 — Luồng v2: tra `kb/` trước AI, code kiểm DOC ∈ top-3..."; sơ đồ chốt tại `docs/flow-v2.html` | Từ ý tưởng "AI phân loại trước" (luồng 1) sang "tra nguồn trước, code kiểm sau AI" (luồng 2) — nền tảng cho toàn bộ prototype |
| Viết 9 file tri thức `kb/DOC-01..09.md` + `kb/synonyms.json` để `retrieve.js` khớp từ khoá/đồng nghĩa | `kb/`; commit `cc87b3d` | ≥8 DOC theo yêu cầu CP3, đủ cho `retrieve.js` tra top-3 |
| Gán nhãn tay 64 câu trả lời dạng menu của bot cũ, kiểm lại số mining tự động | `docs/nhan-tay-63-menu.md`, `docs/menu-labels.csv`; commit `1a0facd`, `cc87b3d` | Đánh giá được 62/64; theo hành động đúng flow-v2: **ANSWER 52 · CLARIFY 5 · ESCALATE 5** → 52/62 ≈ 84% là hỏi lại thừa, khớp hướng mining B (63/313 = 20%) ở CP1 |
| Gửi danh sách `msg_id` đã gán nhãn theo 3 nhóm cho Hưởng dựng golden set | `docs/golden-set-msg-ids-cho-huong.md` | Golden set 32 case rút từ đây, giữ đủ 10 case CLARIFY/ESCALATE thay vì lệch hẳn về ANSWER |
| Soạn mẫu ticket điền sẵn cho màn hình ESCALATE, map 4 loại `reason` → dòng hiển thị cho học viên | `docs/mau-ticket-escalate.md` | Hùng ghép thẳng vào UI (`app.js`), cả 4 reason đều có ticket, không nhánh nào "cụt" |
| Viết `spec.md` §1 (User & Job, evidence A/B, ≥5 quote có nguồn), §4/§6/§7 khung ban đầu (CP3); §1 §2 §3 hoàn thiện + dán bàn giao §7 §9 của Hưởng, tự khai phần chưa xong (CP4) | commit `cc87b3d`, `179a3c3` | Nộp CP3 15:30, CP4 20:45 đúng hạn |
| Dọn trùng lặp file evidence trong repo | commit `ab09b85` | Tránh 2 nguồn số liệu lệch nhau (`menu-labels.csv` gốc vs `docs/menu-labels.csv`) |

**Một quyết định mình đã tự đưa ra:** ở §7 tôi khoá quality bar là **"≥85% và Factuality fail = 0"** ngay sau khi thấy `run-model-1` đạt 87,5% — chứ không đợi thêm hay hạ chuẩn xuống để "chắc ăn". Lý do: theo luật CP4, chuẩn "đạt" phải chốt trước khi biết kết quả cuối cùng có ổn định hay không, và 4 case sai của `run-model-1` đều lệch về hướng an toàn (chuyển TA), không có case nào ANSWER bịa nguồn — đúng cost-of-error nhóm đặt ra từ canvas CP1 (sai XP/điểm danh đắt hơn hỏi lại thừa).

## 3. AI đã hỗ trợ mình thế nào

- **Tool đã dùng:** **[điền: Claude Code / ChatGPT / Gemini — công cụ thật đã dùng]**
- **Dùng ở bước nào, cho việc gì:** **[điền — ví dụ: soạn nháp 9 file `DOC-xx.md` từ `discord-pack` rồi tự biên tập lại; hỗ trợ viết `docs/nhan-tay-63-menu.md` (bảng mã lý do R1-R7); gom số liệu rải rác thành bảng §1/§7 trong spec]**
- **Chỗ AI làm tốt:** **[điền — ví dụ: tổng hợp nhanh câu hỏi hay gặp trong `discord-pack` thành cấu trúc DOC theo chủ đề, viết bảng đối chiếu số liệu]**
- **Chỗ AI làm sai hoặc mình phải tự kiểm/tự sửa (≥1 ví dụ cụ thể):** **[điền — ví dụ: AI gán nhãn mẫu ban đầu theo cảm tính thay vì theo tiêu chí "câu hỏi đã đủ rõ chưa", phải tự đọc lại và sửa tay theo phương pháp R1-R7; hoặc AI viết `kb/DOC-xx.md` lẫn thông tin không có trong nguồn `discord-pack`, phải cắt bỏ để không tạo evidence giả]**
- **Cách mình kiểm tra output của AI trước khi đưa vào repo:** mọi con số trong `spec.md` phải trỏ được về một file cụ thể (`docs/`, `eval/`) — cái nào AI viết mà không có nguồn kiểm lại được thì bỏ, không đưa vào evidence. Với `kb/DOC-xx.md`, đối chiếu lại với `discord-pack` gốc trước khi commit, không giữ nguyên bản AI viết nếu không tự xác minh được.

## 4. Một bài học từ case fail của chính nhóm

**Chuyện gì xảy ra:** Sáng 17/9, engine có một lượt chạy **100%** trên golden set — nhìn số đẹp thì rất muốn đưa thẳng vào §7 làm quality bar. Nhưng số đó đến từ `policyGuardrail`, một lớp regex đè lên kết quả model và viết đúng theo câu trong golden set — tức là số đẹp nhưng không phải AI đúng, vi phạm thẳng luật "phải có lời gọi AI thật, không hardcode".

**Nhóm phát hiện bằng cách nào:** đối chiếu với lượt AI thật đầu tiên `run-openai-1` (26/32, 81,3%) — chênh quá xa với 100% nên phải soi lại `verify.js` và thấy regex.

**Đã sửa ra sao:** Hưởng bỏ `policyGuardrail`, sửa prompt CLARIFY; nhóm chạy lại ra `run-model-1` = 87,5%. Phần của tôi là **không đưa con số 100% vào spec dù nó đến trước** — chờ số thật rồi mới viết §7 và khoá quality bar dựa trên 87,5%, đúng vai trò "Spec + Evidence": việc của tôi là giữ cho spec chỉ chứa số kiểm chứng được, không phải số đẹp nhất.

**Bài học rút ra cho lần sau:** số liệu đẹp bất thường là dấu hiệu để nghi ngờ trước, không phải để mừng rồi chốt ngay vào tài liệu chính thức — nhất là khi mình là người giữ evidence, một con số sai lọt vào `spec.md` thì cả nhóm bị đánh giá sai năng lực thật của sản phẩm.

## 5. Nếu làm lại / có thêm 1 tuần

- **[điền: ví dụ — thu khảo sát A sớm và rộng hơn ngay từ CP1 thay vì để n=5 kéo dài đến gần CP4 (mục tiêu ≥20 vẫn chưa đạt khi chốt spec); hoặc đối chiếu lần 2 (người thứ hai kiểm) cho toàn bộ case `do_chac = thấp` trong gán nhãn tay thay vì một phần.]**
