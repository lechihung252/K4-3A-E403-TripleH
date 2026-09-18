# validation/ — Nhật ký người ngoài dùng thử (R6)

Người phụ trách: Lê Chí Hùng · Ngày thử: 18/9/2026 (sáng, trước CP5) · Bản thử: `codebase/` commit `4957f33` · engine `gpt-4.1-mini` (badge góc phải, không phải local adapter).

Đã thử với 2 willing user khai từ CP1 (Nguyễn Vũ Anh, Nguyễn Duy Phong) — đủ điều kiện R6 (≥2 người ngoài nhóm). Kế hoạch 5 người ban đầu không đạt vì thời gian trước CP5; nếu thử thêm sau CP5 sẽ chạy trên bản đã sửa `4da0a4e` và ghi tiếp vào bảng. Người thử tự gõ câu hỏi theo **tình huống** được giao, nhóm không đọc câu cho họ. Mỗi người 4 task, ứng với 4 đường đi ở `spec.md` §6.

> Ảnh `notebooklm/1.png`–`5.png` là phần nghiên cứu sản phẩm tương tự (spec §3), không phải nhật ký người dùng.

## Kịch bản giao cho người thử

| Task | Tình huống giao (nói đúng câu này) | Đường đi §6 | Bot "đúng thiết kế" khi |
|---|---|---|---|
| T1 | "Bạn muốn biết daily standup nộp thế nào, hỏi bot." | Happy path | ANSWER + dòng nguồn DOC-03, không menu |
| T2 | "Bạn nộp muộn một thứ gì đó, muốn hỏi bot hậu quả — đừng nói rõ muộn cái gì." | Low-confidence | CLARIFY đúng 1 câu + gợi ý; sau khi trả lời thì ANSWER, không hỏi lần 2 |
| T3 | "Bạn thấy XP của mình bị thiếu, hỏi bot." | Case đặc thù domain | ESCALATE `personal_data` + mẫu ticket điền sẵn |
| T4 | "Quay lại câu T1. Giả sử bạn nghĩ bot trả lời sai, hãy phản hồi lại." | Correction | Bấm "Sai rồi" → ESCALATE `correction`, ticket có "Câu trả lời cũ" |

Quan sát thêm ở mỗi task (PAIR 5.1 — hành động có hai nghĩa, ghi cả hành động lẫn ngữ cảnh): có đọc dòng nguồn không · chọn chip hay gõ tự do · có bấm "Sao chép" ticket không · có tìm thấy nút "Sai rồi" không hay gõ tay.

## Nhật ký

Cột theo mẫu BTC (Ngày 06 · "Một dòng nhật ký người dùng"): người thử · việc · quan sát · quote nguyên văn · mức độ · quyết định.
Quote ghi **nguyên văn**, kể cả câu ngắn. Bot chuyển TA đúng thiết kế là **thành công**, không phải lỗi.
*Mức độ:* `Cao` = học viên không hoàn thành việc / TA nhận thông tin sai · `Trung bình` = làm được nhưng vướng · `Thấp` = góp ý, không cản việc · `Không có` = làm xong việc, không vướng gì.
*Quyết định:* `Sửa trước demo` · `Giữ nguyên + lý do` · `Để dành sau`.

| # | Người thử | Việc | Quan sát (kết quả bot + hành vi người thử) | Quote nguyên văn | Mức độ | Quyết định |
|---|---|---|---|---|---|---|
| 1 | Nguyễn Vũ Anh (HV K4, willing user CP1) | T1 · hỏi cách nộp daily standup | Gõ "Daily standup nộp như nào" → **ANSWER · DOC-03** trong 1 lượt, không menu, trace "AI và code đồng ý". Có đọc dòng nguồn, muốn bấm vào để xem đoạn gốc trong DOC nhưng dòng nguồn không bấm được | "Cái này không xem được trích dẫn ở đâu trong nguồn" | Trung bình — vẫn dùng được câu trả lời nhưng không tự kiểm được nguồn | Để dành sau — hiện đoạn trích DOC dưới dòng nguồn (engine đã trả `snippet` trong top-3, chỉ sửa UI); đúng điểm "đáng học" từ NotebookLM ở spec §3 |
| 2 | Nguyễn Vũ Anh | T2 · nộp muộn, không nói muộn gì | Gõ "Tôi nộp muộn" → **CLARIFY** "nộp muộn bài Lab, daily standup hay hoạt động nào khác?" + 3 chip. Chọn chip "Deadline & nộp bài Lab" (không gõ) → **ANSWER · DOC-08**; cờ đã_hỏi_lại true → hạ về false, không hỏi lần 2. Câu trả lời DOC-08 có nói hậu quả nộp muộn ("không có mức trừ cố định, trình bày với mentor/BTC qua ticket") nhưng nằm ở câu thứ 3, phần đầu là thông tin hạn nộp | "Chưa đúng trọng tâm lắm" | Thấp — có thông tin cần, phải đọc hết đoạn mới thấy | Giữ nguyên luồng CLARIFY (đúng §6, không lặp menu như bot cũ) · Để dành sau: prompt yêu cầu ý trả lời trực tiếp đứng đầu — đổi prompt là phải đo lại golden set nên không sửa trước demo |
| 3 | Nguyễn Vũ Anh | T3 · XP cá nhân bị thiếu | Gõ "XP của tôi bị thiếu ?" → **ESCALATE · personal_data** + ticket điền sẵn (Đã tra: DOC-01, 09, 07). Không tra kb để đoán. Bấm "Sao chép" ticket. Hỏi vì sao bot không tự gửi ticket | "Cái này không tự gửi luôn mà phải gửi thủ công à ?" | Thấp — thêm 1 thao tác dán vào `/ticket create` | Giữ nguyên — non-goal 1 (§4): bot chỉ soạn, học viên tự kiểm tra rồi gửi, vì ticket sai nội dung là TA xử lý sai; chuyển TA cho câu XP cá nhân là đúng non-goal 4 |
| 4 | Nguyễn Vũ Anh | T4 · phản hồi câu trả lời sai | Gõ "nộp daily stand up ở đâu" → ANSWER DOC-03 · bấm "Sai rồi" → **ESCALATE · correction**, ticket có "Câu trả lời cũ". Tìm thấy và bấm nút "Sai rồi" ngay, không gõ tay. **Lỗi:** ticket ghi `Câu hỏi gốc: Sai rồi` thay vì câu hỏi trước — TA đọc ticket không biết học viên hỏi gì | "Cứ bấm sai là gửi ticket luôn" | **Cao** — TA nhận ticket thiếu câu hỏi gốc | **Sửa trước demo** — `app.js` giữ câu hỏi gần nhất, ticket correction dùng câu đó làm "Câu hỏi gốc" (→ §9) |
| 5 | Nguyễn Duy Phong (HV K4, willing user CP1) | T1 · hỏi cách nộp daily standup | Gõ rất ngắn "nộp daily" → **ANSWER · DOC-03** thẳng, không hỏi lại dù câu chỉ 2 từ | "ok" | Không có — xong việc trong 1 lượt | Giữ nguyên — đúng happy path §6; câu ngắn vẫn không bị ép CLARIFY (lớp lỗi 1 không xảy ra ở đây) |
| 6 | Nguyễn Duy Phong | T2 · nộp muộn, không nói muộn gì | Gõ "Nộp muộn daily thì sao ?" — **đã nói rõ "daily"** — bot vẫn **CLARIFY** "daily standup hay bài Lab?" (top-3 chỉ có DOC-03, DOC-01). Gõ "daily standup" → **ANSWER · DOC-03**, nhưng nội dung chủ yếu là cách nộp, ý hậu quả nộp muộn chỉ 1 câu ở cuối (cùng vấn đề dòng 2) | "Bot vẫn phải hỏi lại dù tôi nghĩ đã rõ rồi, và câu trả lời cũng chưa đúng lắm" | Trung bình — hỏi lại thừa 1 lượt cho câu đã đủ rõ, đúng pain gốc của bot cũ (lớp lỗi 1, §5) | Để dành sau — lỗi prompt, không phải UI; thêm case này vào golden set/holdout (Hưởng), không sửa prompt trước demo vì phải đo lại |
| 7 | Nguyễn Duy Phong | T3 · XP cá nhân | Gõ "Kiểm tra XP hiện tại của tôi" → **ESCALATE · personal_data** + ticket (Đã tra: DOC-01, 09, 04). | "Soạn luôn ticket cũng tiện" | Không có — chuyển TA đúng, người thử thấy tiện | Giữ nguyên — non-goal 4 (§4), người thứ 2 liên tiếp được chuyển TA đúng cho câu dữ liệu cá nhân |
| 8 | Nguyễn Duy Phong | T4 · phản hồi câu trả lời sai | Gõ "Nộp dailystand up" → **CLARIFY** "cách nộp hay hạn nộp?" (khác T1: "nộp daily" được ANSWER thẳng — cùng ý, khác nhãn) → chọn chip → ANSWER DOC-03 · bấm "Sai rồi" → **ESCALATE · correction**. **Lỗi lặp lại lần 2:** ticket ghi `Câu hỏi gốc: Sai rồi` | "Phần Bot nhắn lại có lỗi rồi" | **Cao** — cùng lỗi dòng 4, 2/2 người gặp · Thấp — nhãn không ổn định giữa 2 câu gần giống | **Sửa trước demo** (cùng fix dòng 4) — **đã sửa và kiểm lại 18/9 ~10:50**: ticket ghi câu mở chuỗi ("Nộp dailystand up"), không phải chữ trên chip hay "Sai rồi" · Để dành sau: chạy golden set ≥3 lượt để đo độ ổn định nhãn (eval, Hưởng) |

## Tổng kết

| | |
|---|---|
| Chủ đề lặp nhiều nhất | Ticket correction thiếu câu hỏi gốc (dòng 4, 8 — 2/2 người). Thứ hai: muốn thấy nguồn/ý chính ngay (dòng 1, 2) |
| Sửa gì trước demo (→ ghi vào `spec.md` §9 changelog, trỏ về dòng # ở trên) | `app.js`: giữ câu hỏi gần nhất, ticket `correction` dùng câu đó làm "Câu hỏi gốc" (dòng 4, 8) |
| Giữ nguyên gì và vì sao | Không tự gửi ticket (dòng 3) — non-goal 1, học viên phải kiểm nội dung trước khi TA nhận · Chuyển TA cho câu XP cá nhân (dòng 3, 7) — non-goal 4 · Luồng CLARIFY 1 lần + chip (dòng 2) — đúng §6 |
| Để dành sau | Hiện đoạn trích DOC dưới dòng nguồn (dòng 1) · Prompt: ý trả lời trực tiếp đứng đầu (dòng 2) · Hỏi lại thừa khi câu đã nói rõ "daily" → thêm vào golden set (dòng 6) · Đo độ ổn định nhãn qua ≥3 lượt (dòng 8) |
