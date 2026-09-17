# §5. Kiểu lỗi — 4 lớp chỗ khó và 32 kịch bản

Mỗi dòng liên kết 1–1 với một case trong `eval/golden-set.json`. Câu hỏi là bản diễn đạt lại từ tóm tắt đã ẩn danh trong `docs/menu-labels.csv`, không phải nguyên văn Discord.

## Lớp 1 — Hỏi lại thừa khi câu đã rõ

| Case | `msg_id` | Kịch bản | Kết quả đúng |
|---:|---|---|---|
| 1 | M49945 | Hỏi thời điểm tính XP | ANSWER · DOC-01 |
| 2 | M42370 | Hỏi cách dùng topic pick | ANSWER · DOC-06 |
| 3 | M77407 | Hỏi ai phải nộp daily standup | ANSWER · DOC-03 |
| 4 | M30724 | Hỏi XP tính theo cá nhân hay team | ANSWER · DOC-01 |
| 5 | M04739 | Hỏi tần suất mentor duty | ANSWER · DOC-05 |
| 6 | M21470 | Hỏi có được đổi đề tài | ANSWER · DOC-06 |
| 7 | M88122 | Hỏi lịch báo cáo mentor | ANSWER · DOC-05 |
| 8 | M37242 | Hỏi cách tạo ticket | ANSWER · DOC-04 |

Rủi ro: model thấy câu ngắn rồi mặc định hỏi lại, tái tạo đúng pain của bot cũ. Cách chặn: câu rõ + có nguồn phải ANSWER ngay.

## Lớp 2 — Hiểu sai thuật ngữ hoặc truy xuất sai tài liệu

| Case | `msg_id` | Kịch bản | Kết quả đúng |
|---:|---|---|---|
| 9 | M58070 | Các hình thức điểm danh | ANSWER · DOC-02 |
| 10 | M98619 | “pick topic” trên Phoenix | ANSWER · DOC-06 |
| 11 | M80674 | Cú pháp daily standup | ANSWER · DOC-03 |
| 12 | M20366 | Xem rank cá nhân | ANSWER · DOC-09 |
| 13 | M39389 | Các cách nhận XP | ANSWER · DOC-01 |
| 14 | M73225 | Dùng `/daily-standup` ở đâu | ANSWER · DOC-03 |
| 15 | M51928 | Ghi daily standup ở đâu | ANSWER · DOC-03 |
| 16 | M31042 | Nội dung mentor duty | ANSWER · DOC-05 |

Rủi ro: thuật ngữ khoá học, tiếng Anh hoặc lỗi chính tả kéo nhầm DOC. Cách chặn: retrieval dùng `kb/synonyms.json`, chỉ đưa top-3 vào model.

## Lớp 3 — Thiếu nguồn, dữ liệu cá nhân và quyết định ngoài phạm vi

| Case | `msg_id` | Kịch bản | Kết quả đúng |
|---:|---|---|---|
| 17 | M75939 | Đề xuất ý tưởng ngoài project bank | ANSWER · DOC-06 |
| 18 | M00499 | Hoạt động riêng chưa được cộng XP | ESCALATE · personal_data |
| 19 | M19701 | Cá nhân chưa thấy nhóm được xếp | ESCALATE · personal_data |
| 20 | M03935 | Điểm ảnh hưởng tới thực tập | ESCALATE · no_source |
| 21 | M32673 | Ai cấp thiết bị cho đề tài phần cứng | ESCALATE · out_of_scope |
| 22 | M04968 | Yêu cầu cộng điểm cá nhân bị kẹt | ESCALATE · personal_data |
| 23 | M61735 | Không đăng nhập Phoenix nhưng chưa nêu lỗi | CLARIFY |
| 24 | M48190 | Xin danh sách hỗ trợ nhưng chưa nêu lớp/phòng | CLARIFY |

Rủi ro: model suy diễn từ tài liệu “gần nghĩa” hoặc lộ dữ liệu riêng. Cách chặn: rule personal data, reason rõ ràng, và verify ép ANSWER có `doc_id ∈ top3`.

## Lớp 4 — Ngữ cảnh hội thoại và vòng hỏi lại

| Case | `msg_id` | Kịch bản | Kết quả đúng |
|---:|---|---|---|
| 25 | M20574 | “Muộn sau 23h59” chưa nói việc gì | CLARIFY |
| 26 | M95844 | “Phase 1, 2, 3” chưa nói quy trình | CLARIFY |
| 27 | M83132 | “Điểm cộng” chưa nói loại điểm | CLARIFY |
| 28 | M66632 | Tin trước đã nói daily, tin sau hỏi ai nộp | ANSWER · DOC-03 |
| 29 | M97872 | Một câu có daily và XP | ANSWER · DOC-03 |
| 30 | M27846 | Daily là cá nhân hay team | ANSWER · DOC-03 |
| 31 | M95485 | “Cả ba” dựa vào menu ở tin trước | ANSWER · DOC-03 |
| 32 | M79664 | “Câu hỏi đó” dựa vào lịch sử gần nhất | ANSWER · DOC-03 |

Rủi ro: bỏ qua 2–3 tin trước hoặc CLARIFY vô hạn. Cách chặn: truyền history cũ → mới; `askedOnce=true` mà còn CLARIFY thì code ép ESCALATE/no_source.
