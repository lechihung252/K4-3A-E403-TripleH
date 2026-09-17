# Gán nhãn tay 64 câu trả lời dạng menu của bot cũ

Người làm: Vũ Việt Hoàng. Kết quả đầy đủ: `docs/menu-labels.csv` (mã tin + tóm tắt ý hỏi do nhóm viết lại + giải thích — không chép nguyên văn tin Discord, đúng luật §data/discord-pack).

## Phương pháp đếm (kiểm lại được)

1. **Nguồn:** `k4_messages.csv` trong `data/discord-pack/` (do BTC cấp).
2. **Tiêu chí xác định "câu trả lời dạng menu":** tin của bot (`is_bot=True`) có dấu `?` rồi ngay sau là danh sách đánh số bắt đầu `1.` hoặc `1)` trong 400 ký tự đầu → **64 tin khớp**.
3. **Với mỗi tin menu:** đọc câu hỏi gốc (`reply_to`), gán:
   - `nhan_menu`: **THỪA** (câu hỏi đã đủ rõ để trả lời/quyết định, không cần hỏi lại) hoặc **CẦN** (thật sự thiếu thông tin, hỏi lại là hợp lý) hoặc **LOẠI** (không có câu hỏi gốc trong pack).
   - `hanh_dong_dung`: hành động đúng theo flow-v2 nếu prototype nhóm xử lý câu này — `ANSWER` / `CLARIFY` / `ESCALATE`.
   - `ly_do_chinh` / `ly_do_phu`: mã R1-R7 (xem bảng dưới).
   - `do_chac`: cao/thấp — mức tự tin khi gán nhãn (case mơ hồ tự đánh "thấp" để nhóm khác kiểm lại).
   - `so_tin_nhan_them_30p`: đếm tự động bằng code — số tin cùng người hỏi trong 30 phút sau khi bot trả lời (bằng chứng "phải hỏi lại thêm").
4. **Đối chiếu lần 2:** case gắn `do_chac = thấp` cần người thứ hai trong nhóm đọc lại trước khi đưa vào golden set (đúng §2.6 bước 4 của guide — kiểm độ rõ bằng người thứ hai).

## Bảng mã lý do (R1-R7)

| Mã | Ý nghĩa |
|---|---|
| R1 | Câu hỏi đã rõ nhưng bot vẫn đưa menu |
| R2 | Hỏi nhiều ý cùng lúc, bot bắt chọn 1 thay vì trả lời hết |
| R3 | Bot hiểu sai thuật ngữ của khoá (XP, ticket, topic pick, rank, Phoenix) |
| R4 | Menu lạc đề hoặc bắt người hỏi tự chọn đáp án |
| R5 | Câu hỏi cá nhân / sự cố tài khoản: cần chuyển TA, không phải hỏi lại |
| R6 | Thiếu thông tin thật sự, hỏi lại là hợp lý |
| R7 | Bot bỏ qua ngữ cảnh ở tin trước hoặc lặp menu nhiều vòng |

## Kết quả tổng hợp

- Đánh giá được: **62/64** (loại 2 tin không có câu hỏi gốc trong pack).
- Theo hành động đúng: **ANSWER 52 · CLARIFY 5 · ESCALATE 5**.
- Ý nghĩa cho spec §1 (bằng chứng B): phần lớn menu của bot cũ (52/62 ≈ 84% trong mẫu này) là **hỏi lại thừa** cho câu đã đủ rõ để trả lời thẳng — đúng hướng pain đã nêu ở `canvas-cp1.md` §02 ("63/313 (20%) câu trả lời là menu hỏi lại").
- Danh sách msg_id theo 3 nhóm đã gửi Hưởng: `docs/golden-set-msg-ids-cho-huong.md`.
