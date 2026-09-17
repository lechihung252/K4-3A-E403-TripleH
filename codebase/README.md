# codebase/ — Prototype AskOnce

Prototype trợ lý Discord: học viên hỏi → AI quyết định ANSWER / CLARIFY / ESCALATE.
Luồng theo `docs/flow-v2` (6 bước, chỉ ③ là AI).

## Chạy

```bash
# chạy từ GỐC repo (engine đọc ../kb/), không phải từ codebase/
python3 -m http.server 8765
# mở http://localhost:8765/codebase/
```

Không có build step. HTML + JS thuần (`type="module"`), nên phải chạy qua http server, không mở file trực tiếp.
Để bước ③ gọi model thật trong UI: copy `engine/config.example.js` → `engine/config.local.js` (đã gitignore) và điền `apiKey`, `baseUrl`, `model`. Khi chạy eval bằng Node, có thể dùng `.env` với `ASKONCE_PROVIDER=openai`, `OPENAI_API_KEY` và `ASKONCE_MODEL`. Không có cấu hình model thì engine chạy `deterministic-local-adapter` — chỉ để test UI, **không phải số đo AI**.

## Cấu trúc và người sở hữu

| File | Bước trong flow-v2 | Người |
|---|---|---|
| `index.html` `app.js` `style.css` | ① gom history · ⑤ cờ đã_hỏi_lại · ⑥ đọc reason → màn hình kết thúc · vòng "Sai rồi" | Hùng |
| `engine/index.js` | Hợp đồng `decide()`: ② → ③ → ④⑤, không đụng DOM | Hưởng |
| `engine/retrieve.js` `prompt.js` `verify.js` | ② tra `kb/` → top-3 · ③ đúng 1 lời gọi AI trả JSON schema · guardrail an toàn · ④⑤ kiểm doc_id ∈ top-3, gắn nguồn, chặn CLARIFY lần 2 | Hưởng |
| `../eval/` | Golden set 32 case, `run.js` gọi đúng `decide()` như UI, trace `.jsonl` | Hưởng |
| `../kb/DOC-xx.md` | Nội dung tài liệu Build Phase | Hoàng |

UI chỉ gọi `decide({ question, history, askedOnce })` và không biết gì về prompt hay kb/. `app.js` kiểm lại ④⑤ một lần nữa phía UI và làm ⑥ (đọc reason → mẫu ticket).

## Phần nào mock, phần nào thật

| Thành phần | Trạng thái | Ghi chú |
|---|---|---|
| Giao diện + state ①⑤⑥ | Thật | `app.js` kiểm lại ④ và ⑤ một lần nữa phía UI, không tin AI |
| ② tra `kb/` → top-3 | Thật (code) | Từ khoá + `kb/synonyms.json`, không AI |
| ③ quyết định 3 nhãn | **Thật khi có `config.local.js`** | 1 lời gọi model trả JSON; thiếu key → `deterministic-local-adapter` (mock, chỉ để test UI) |
| Guardrail + ④⑤ kiểm sau AI | Thật (code) | Khóa dữ liệu cá nhân/câu mơ hồ/ngoài phạm vi; `verify.js` kiểm nguồn và `app.js` kiểm lại |
| Tài liệu `kb/` | Tự dựng, ghi rõ | 9 DOC do nhóm soạn theo chủ đề hay hỏi trong `data/discord-pack/`, không phải văn bản chính thức |
| Ticket TA | Mẫu điền sẵn (`docs/mau-ticket-escalate.md`) | Mọi reason ESCALATE đều kèm mẫu; học viên tự gửi `/ticket create`, bot không tạo thay (non-goal) |

## API key

Không commit key. UI có thể dùng `engine/config.local.js`; eval Node dùng `.env`. Cả hai đều đã `.gitignore`; mẫu cấu hình ở `engine/config.example.js`. Lượt đo chính hiện dùng OpenAI `gpt-4.1-mini`.
