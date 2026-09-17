# codebase/ — Prototype AskOnce

Prototype trợ lý Discord: học viên hỏi → AI quyết định ANSWER / CLARIFY / ESCALATE.
Luồng theo `docs/flow-v2` (6 bước, chỉ ③ là AI).

## Chạy

```bash
cd codebase && python3 -m http.server 8765
# mở http://localhost:8765
```

Không có build step. HTML + JS thuần (`type="module"`), nên phải chạy qua http server, không mở file trực tiếp.

## Cấu trúc và người sở hữu

| File | Bước trong flow-v2 | Người |
|---|---|---|
| `index.html` `app.js` `style.css` | ① gom history · ⑤ cờ đã_hỏi_lại · ⑥ đọc reason → màn hình kết thúc · vòng "Sai rồi" | Hùng |
| `engine/index.js` | Hợp đồng `decide()` — hiện là **stub** trả cứng 3 case mẫu | Hưởng thay thân hàm |
| `engine/retrieve.js` `prompt.js` `verify.js` | ② tra `kb/` → top-3 · ③ 1 lời gọi AI trả JSON · ④ kiểm doc_id ∈ top-3 | Hưởng |
| `../kb/DOC-xx.md` | Nội dung tài liệu Build Phase | Hoàng |

UI chỉ gọi `decide({ question, history, askedOnce })` và không biết gì về prompt hay kb/. Khi engine thật xong, UI **không cần sửa**; đổi badge `engine: stub` → `engine: live` trong `index.html`.

## Phần nào mock, phần nào thật

| Thành phần | Trạng thái | Ghi chú |
|---|---|---|
| Giao diện + state ①⑤⑥ | Thật | `app.js` kiểm lại ④ và ⑤ một lần nữa phía UI, không tin AI |
| ② ③ ④ trong `engine/` | **Stub** (CP3 sẽ gắn thật) | Trả cứng theo 3 case M49945 / M20574 / R03 + correction + out_of_scope |
| Tài liệu `kb/` | Tự dựng, ghi rõ | Không dùng data thật; DOC-01…06 trong stub là giả lập |
| Ticket TA | Mẫu điền sẵn | Học viên tự gửi, bot không tạo thay (non-goal) |

## API key

Không commit key. Hưởng để key ở `engine/config.local.js` (thêm vào `.gitignore`) và commit `engine/config.example.js`.
