# Reflection cá nhân — Vũ Việt Hoàng · 2A202602398

> Nhóm TripleH · Zone 5 · Track B · Sản phẩm: **AskOnce** — trợ lý Discord trả lời quy định Build Phase, AI quyết định ANSWER / CLARIFY / ESCALATE trong một lượt thay vì bắt học viên chọn menu 1/2/3.

## 1. Vai trò trong nhóm

Tôi là **đội trưởng**, phụ trách **Spec + Evidence**: nộp cả 5 checkpoint, giữ `spec.md`, `kb/`, `docs/` không để ai đụng chéo (đúng nguyên tắc chia theo thư mục để tránh conflict git), thu bằng chứng (mining, gán nhãn tay, khảo sát) và khoá quality bar dựa trên số thật.

Ở CP1 tôi là người đề xuất ý tưởng AskOnce: thay vì xây một tính năng mới, tối ưu thẳng bot "Trợ lý" đang có, nhắm đúng vào việc nó trả menu 1/2/3 bắt chọn lại ngữ cảnh cho cả câu đã đủ rõ. Ý tưởng này bị phản biện ở hai điểm: (1) "tối ưu bot có sẵn" nghe nhỏ hơn xây tính năng mới, sợ giám khảo đánh giá thấp độ khó; (2) chưa chắc menu 1/2/3 là vấn đề thật hay chỉ là cảm giác chủ quan. Tôi bảo vệ bằng cách đưa ngay bằng chứng B (mining `discord-pack`) làm căn cứ trước khi tranh luận thêm — 63/313 (20%) câu trả lời của bot là menu hỏi lại, 53/61 người phải nhắn thêm trong 30 phút, có người tag bot ≥3 lần vẫn chưa xong việc; và chốt cost-of-error rõ ràng (trả sai XP/điểm danh đắt hơn hỏi lại thừa, nhưng 20% hỏi lại thừa cũng đang thật sự gây mất thời gian) để nhóm thấy đây là lát cắt có số đo được, khả thi trong ~48h, chứ không phải phỏng đoán. Nhóm đồng ý chốt theo hướng "tối ưu tính năng có sẵn" (đánh dấu ngay trên `spec.md` dòng 3) thay vì xây tính năng mới.

Ở CP2 tôi vẽ workflow đầu tiên: tra tài liệu trước → AI quyết định ANSWER/CLARIFY/ESCALATE → kiểm lại bằng code sau khi AI trả lời, thay vì để AI tự do trả lời hoặc tự quyết đã đủ nguồn chưa. Sau đó cả nhóm góp ý và Hùng dựng thành sơ đồ chính thức `docs/flow-v2.html`/`flow-v2.png` (6 bước ①–⑥, chỉ ③ là AI) — bản v2 giữ đúng khung 3 nhánh tôi đề xuất, nhóm bổ sung thêm nhánh Correction (⑥, khi học viên phản hồi câu trả lời sai) và cờ `askedOnce` để chặn CLARIFY hỏi lại quá 1 lần bằng code thay vì trông chờ AI tự nhớ. Nhận vai trò Spec + Evidence vì tôi là người theo sát nhất phần "đạt là gì" của sản phẩm — quality bar, bằng chứng, chuẩn nghiệm thu — thay vì phần code.

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

- **Tool đã dùng:** Claude Code (VS Code), dùng xuyên suốt quá trình làm việc: `kb/`, `docs/`  và ghép `spec.md`.
- **Dùng ở bước nào, cho việc gì:** soạn khung 9 file `DOC-xx.md` từ nội dung tôi tự rút ra khi đọc `discord-pack` (tôi đưa chủ đề + nội dung thật, tham khảo nội dung trả lời từ trả lời discord, AI giúp viết lại thành định dạng `id/title/keywords` thống nhất cho `retrieve.js` đọc được); dựng bảng mã lý do R1-R7 và cấu trúc phương pháp đếm trong `docs/nhan-tay-63-menu.md`; gom số liệu rải rác ở nhiều file (`canvas-cp1.md`, `docs/menu-labels.csv`, `eval/`) thành các bảng ở §1 §2 §7 trong `spec.md`.
- **Chỗ AI làm tốt:** viết nhanh phần định dạng (9 file `DOC-xx.md` cùng khung, bảng mã R1-R7), và tổng hợp số liệu rải rác trong repo thành bảng có trích dẫn nguồn thay vì phải gõ tay từng dòng.
- **Chỗ AI làm sai hoặc mình phải tự kiểm/tự sửa:** ở bảng impact §2, lượt đầu AI viết ước lượng "bao nhiêu người/tần suất" nghe hợp lý nhưng suy diễn vượt quá những gì `docs/menu-labels.csv` thực sự đếm được (file đó không tách cột chủ đề) — nếu để nguyên sẽ thành số bịa trong đúng phần "Evidence" là trách nhiệm của tôi. Tôi phải tự sửa lại thành ghi rõ "ước lượng theo tỷ trọng câu hỏi quan sát được, không phải đếm chính xác từng DOC" ngay trong bảng, thay vì để con số trông như đã đếm chính xác.
- **Cách mình kiểm tra output của AI trước khi đưa vào repo:** mọi con số trong `spec.md` phải trỏ được về một file cụ thể (`docs/`, `eval/`) — cái nào AI viết mà không có nguồn kiểm lại được thì bỏ, không đưa vào evidence. Với `kb/DOC-xx.md`, đối chiếu lại với `discord-pack` gốc trước khi commit, không giữ nguyên bản AI viết nếu không tự xác minh được.

## 4. Một bài học từ case fail của chính nhóm

**Chuyện gì xảy ra:** Sáng 17/9, engine có một lượt chạy **100%** trên golden set — nhìn số đẹp thì rất muốn đưa thẳng vào §7 làm quality bar. Nhưng số đó đến từ `policyGuardrail`, một lớp regex đè lên kết quả model và viết đúng theo câu trong golden set — tức là số đẹp nhưng không phải AI đúng, vi phạm thẳng luật "phải có lời gọi AI thật, không hardcode".

**Nhóm phát hiện bằng cách nào:** đối chiếu với lượt AI thật đầu tiên `run-openai-1` (26/32, 81,3%) — chênh quá xa với 100% nên phải soi lại `verify.js` và thấy regex.

**Đã sửa ra sao:** Hưởng bỏ `policyGuardrail`, sửa prompt CLARIFY; nhóm chạy lại ra `run-model-1` = 87,5%. Phần của tôi là **không đưa con số 100% vào spec dù nó đến trước** — chờ số thật rồi mới viết §7 và khoá quality bar dựa trên 87,5%, đúng vai trò "Spec + Evidence": việc của tôi là giữ cho spec chỉ chứa số kiểm chứng được, không phải số đẹp nhất.

**Bài học rút ra cho lần sau:** số liệu đẹp bất thường là dấu hiệu để nghi ngờ trước, không phải để mừng rồi chốt ngay vào tài liệu chính thức — nhất là khi mình là người giữ evidence, một con số sai lọt vào `spec.md` thì cả nhóm bị đánh giá sai năng lực thật của sản phẩm.

## 5. Nếu làm lại / có thêm 1 tuần

- Thu khảo sát A sớm và rộng hơn ngay từ tối CP1, thay vì để n=5/mục tiêu ≥20 kéo dài đến gần CP4 mà vẫn chưa đạt khi chốt spec — đây là chỗ tôi tự khai "chưa xong" và là phần yếu nhất trong bằng chứng của mình.
- Đối chiếu lần 2 (người thứ hai trong nhóm kiểm lại) cho toàn bộ case `do_chac = thấp` trong gán nhãn tay 64 menu, thay vì chỉ làm được một phần do chạy deadline CP3/CP4 sát nhau.
- Commit/push ngay sau mỗi lần cập nhật `kb/`, không gom để cuối buổi — tránh lặp lại sự cố mất dữ liệu quan sát bot thật (đã ghi trong "Tự khai phần chưa xong" của `spec.md`) khi thao tác lại repo.
