# run-openai-1 — Kết quả AskOnce

- Thời gian: 2026-09-17T06:33:55.200Z
- Chế độ: `configured-model`
- Model: `gpt-4o-mini` (OpenAI, temperature 0) — lỗi provider: 0/32
- Kết quả: **26/32 (81.3%)**
- ANSWER sai nguồn: **0**
- Nhãn đầu ra: ANSWER 24 · CLARIFY 0 · ESCALATE 8

## Case sai

| # | msg_id | Kỳ vọng | Thực tế | Lỗi |
|---:|---|---|---|---|
| 23 | M61735 | CLARIFY | ESCALATE | label |
| 24 | M48190 | CLARIFY | ESCALATE | label |
| 25 | M20574 | CLARIFY | ANSWER/DOC-08 | label |
| 26 | M95844 | CLARIFY | ESCALATE | label |
| 27 | M83132 | CLARIFY | ANSWER/DOC-09 | label |
| 29 | M97872 | ANSWER/DOC-03 | ANSWER/DOC-01 | doc_id |

## Khả năng kiểm tra lại

Toàn bộ input, top-3, output, từng tiêu chí pass/fail và thời gian chạy nằm tại `eval/trace/run-openai-1.jsonl`.

## Nhận xét

5/5 case CLARIFY đều sai (model chưa bao giờ chọn nhãn CLARIFY); 27 case còn lại đúng 26. Lỗi tập trung ở định nghĩa CLARIFY trong system prompt — xem case #23–27. Case #29 (M97872) hỏi 2 ý cùng lúc, chọn DOC-01 thay vì DOC-03.
