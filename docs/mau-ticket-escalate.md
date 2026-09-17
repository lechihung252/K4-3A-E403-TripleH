# Mẫu ticket điền sẵn — màn hình ESCALATE (bước ⑥)

Khi `decide()` trả `label: "ESCALATE"`, prototype hiện khung này cho học viên bấm "Tạo ticket" — nội dung đã điền sẵn từ `question`, `reason`, danh sách DOC-xx đã tra ở bước ② (`top3`), để học viên chỉ cần xác nhận và gửi, không phải gõ lại từ đầu.

## Khung điền sẵn (text, Hùng ghép vào UI)

```
[Ticket hỗ trợ — tạo tự động từ Trợ lý]

Câu hỏi gốc: {{question}}

Lý do chuyển TA: {{ly_do_hien_thi}}

Đã tra: {{các DOC-xx trong top3 bước ②, hoặc "không tìm thấy tài liệu liên quan"}}

Câu trả lời cũ: {{chỉ khi reason = correction — câu ANSWER học viên vừa phủ nhận}}

--- Học viên bổ sung thêm nếu cần ---


```

## Map `reason` (JSON bước ③) → dòng "Lý do chuyển TA" hiển thị cho học viên

| `reason` | Dòng hiển thị |
|---|---|
| `no_source` | "Trợ lý chưa tìm thấy tài liệu nào nói đúng câu hỏi này, cần TA xác nhận trực tiếp." |
| `personal_data` | "Đây là thông tin/sự cố riêng của bạn (điểm, điểm danh, tài khoản...), cần TA kiểm trên hệ thống." |
| `out_of_scope` | "Câu hỏi ngoài phạm vi Trợ lý có thể trả lời (ví dụ quyết định của BTC), chuyển TA/BTC xử lý." |
| `correction` | "Bạn báo câu trả lời trước chưa đúng — Trợ lý không đoán lại lần nữa, cần TA kiểm tra." — ticket kèm thêm câu trả lời cũ để TA đối chiếu (flow-v2 ⑥, spec §6 Correction). |

Cả 4 reason đều kèm mẫu ticket (nhóm chốt sáng 17/9). Không có reason nào kết thúc mà không đưa mẫu.

## Nguyên tắc khi ghép (đối chiếu spec §4b)

- **G9 — sửa dễ dàng:** khung để trống phần "bổ sung thêm" — học viên sửa/thêm ngay tại đây trước khi gửi, không phải mở form khác.
- **G11 — giải thích vì sao:** dòng "Lý do chuyển TA" luôn hiển thị, không chỉ nói "đã chuyển ticket".
- Không tự ý điền dữ liệu cá nhân nào ngoài câu hỏi gốc của chính học viên (đúng Non-goal §4: "Không trả dữ liệu cá nhân").
