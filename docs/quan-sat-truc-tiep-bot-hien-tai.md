# Quan sát trực tiếp bot "Trợ lý Kute" hiện tại (test tay, không phải mining data pack)

Khác nguồn với bằng chứng B ở `canvas-cp1.md` §02 (mining `discord-pack/`, 1.092 tin ngày 12-14/09) — đây là **2 case Vũ Việt Hoàng tự hỏi trực tiếp bot cùng server, ngày ghi log bên dưới**, dùng để đối chiếu chứ không thay thế bằng chứng mining.

| # | Câu hỏi | Bot trả lời | Nhãn theo flow-v2 | Nhận xét |
|---|---|---|---|---|
| 1 | "làm sao để tạo ticket hỏi TA" | Hướng dẫn 3 bước dùng lệnh `/ticket create` (chọn Type → Subject → mô tả chi tiết) | `ANSWER` | Trả lời thẳng, không đưa menu 1/2/3 — dùng làm nguồn thật cho `kb/DOC-04.md`. |
| 2 | "PRD phải nộp ngày 20 có cần chi tiết, cụ thể không? Hay chỉ là một bản tạm thời..." | "Vì câu này mình chưa có đủ thông tin, nên để tránh đưa thông tin sai, mình xin phép tag Mod hỗ trợ trả lời câu hỏi này cho bạn nhé" | `ESCALATE (reason: no_source)` | Đúng tinh thần G10 (thu hẹp phạm vi khi nghi ngờ) — bot không đoán khi không có căn cứ, giống hành vi nhóm đang thiết kế ở bước ④⑤. |

**Không mâu thuẫn với bằng chứng B** (63/313 câu trả lời là menu hỏi lại thừa): hai case này rơi vào phần còn lại — có thể là case bot xử lý đúng, hoặc bot đã được BTC chỉnh sửa sau 14/09 (thời điểm data pack dừng thu). Không đủ mẫu để kết luận bot đã hết vấn đề — vẫn giữ nguyên bằng chứng B làm căn cứ chính cho pain.

**Dùng để làm gì:**
- Case 1 → sửa `kb/DOC-04.md` cho đúng lệnh thật (đã cập nhật).
- Case 2 → ví dụ tham khảo cho hành vi ESCALATE khi không có nguồn (đối chiếu spec §6 "Failure/không căn cứ (①)"), có thể dùng làm 1 trong ≥8 kịch bản rủi ro ở spec §5 (CP4): "học viên hỏi hạn/nội dung PRD chưa công bố chính thức" → lớp ① nguồn sự thật → hành vi mong đợi: ESCALATE, không đoán ngày/nội dung.
