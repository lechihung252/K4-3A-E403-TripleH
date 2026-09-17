# Mẫu ticket điền sẵn — màn hình ESCALATE (bước ⑥)

Khi `decide()` trả `label: "ESCALATE"`, prototype hiện khung này cho học viên bấm "Tạo ticket" — nội dung đã điền sẵn từ `question`, `reason`, `doc_ids`, để học viên chỉ cần xác nhận và gửi, không phải gõ lại từ đầu.

## Khung điền sẵn (text, Hùng ghép vào UI)

```
[Ticket hỗ trợ — tạo tự động từ Trợ lý]

Câu hỏi gốc: {{question}}

Lý do chuyển TA: {{ly_do_hien_thi}}

Đã tra: {{doc_ids đã kiểm, hoặc "không tìm thấy tài liệu liên quan"}}

--- Học viên bổ sung thêm nếu cần ---


```

## Map `reason` (JSON bước ③) → dòng "Lý do chuyển TA" hiển thị cho học viên

| `reason` | Dòng hiển thị |
|---|---|
| `no_source` | "Trợ lý chưa tìm thấy tài liệu nào nói đúng câu hỏi này, cần TA xác nhận trực tiếp." |
| `personal_data` | "Đây là thông tin/sự cố riêng của bạn (điểm, điểm danh, tài khoản...), cần TA kiểm trên hệ thống." |
| `out_of_scope` (giá trị khác `null`) | "Câu hỏi ngoài phạm vi Trợ lý có thể trả lời (ví dụ quyết định của BTC), chuyển TA/BTC xử lý." |

## Nguyên tắc khi ghép (đối chiếu spec §4b)

- **G9 — sửa dễ dàng:** khung để trống phần "bổ sung thêm" — học viên sửa/thêm ngay tại đây trước khi gửi, không phải mở form khác.
- **G11 — giải thích vì sao:** dòng "Lý do chuyển TA" luôn hiển thị, không chỉ nói "đã chuyển ticket".
- Không tự ý điền dữ liệu cá nhân nào ngoài câu hỏi gốc của chính học viên (đúng Non-goal §4: "Không trả dữ liệu cá nhân").
