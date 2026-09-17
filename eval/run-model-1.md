# run-model-1 — Kết quả AskOnce

- Thời gian: 2026-09-17T06:54:22.357Z
- Chế độ: `configured-model`
- Provider: `openai`
- Model: `gpt-4.1-mini`
- Kết quả: **28/32 (87.5%)**
- ANSWER sai nguồn: **0**
- Nhãn đầu ra: ANSWER 23 · CLARIFY 2 · ESCALATE 7

## Case sai

| # | msg_id | Kỳ vọng | Thực tế | Lỗi |
|---:|---|---|---|---|
| 21 | M32673 | ESCALATE | ESCALATE | reason |
| 23 | M61735 | CLARIFY | ESCALATE | label |
| 24 | M48190 | CLARIFY | ESCALATE | label |
| 27 | M83132 | CLARIFY | ANSWER/DOC-09 | label |

## Khả năng kiểm tra lại

Toàn bộ input, top-3, output, từng tiêu chí pass/fail và thời gian chạy nằm tại `eval/trace/run-model-1.jsonl`.
