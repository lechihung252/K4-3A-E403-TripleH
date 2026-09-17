# run-model-2 — Kết quả AskOnce

- Thời gian: 2026-09-17T09:20:39.846Z
- Chế độ: `configured-model`
- Provider: `openai`
- Model: `gpt-4.1-mini`
- Kết quả: **24/32 (75%)**
- ANSWER sai nguồn: **0**
- Nhãn đầu ra: ANSWER 25 · CLARIFY 0 · ESCALATE 7

## Case sai

| # | msg_id | Kỳ vọng | Thực tế | Lỗi |
|---:|---|---|---|---|
| 19 | M19701 | ESCALATE | ESCALATE | reason |
| 20 | M03935 | ESCALATE | ANSWER/DOC-03 | label, reason |
| 21 | M32673 | ESCALATE | ESCALATE | reason |
| 23 | M61735 | CLARIFY | ESCALATE | label |
| 24 | M48190 | CLARIFY | ESCALATE | label |
| 25 | M20574 | CLARIFY | ANSWER/DOC-08 | label |
| 26 | M95844 | CLARIFY | ESCALATE | label |
| 27 | M83132 | CLARIFY | ANSWER/DOC-09 | label |

## Khả năng kiểm tra lại

Toàn bộ input, top-3, output, từng tiêu chí pass/fail và thời gian chạy nằm tại `eval/trace/run-model-2.jsonl`.
