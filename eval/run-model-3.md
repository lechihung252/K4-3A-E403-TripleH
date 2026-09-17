# run-model-3 — Kết quả AskOnce

- Thời gian: 2026-09-17T09:22:14.973Z
- Chế độ: `configured-model`
- Provider: `openai`
- Model: `gpt-4.1-mini`
- Kết quả: **23/32 (71.9%)**
- ANSWER sai nguồn: **0**
- Nhãn đầu ra: ANSWER 24 · CLARIFY 2 · ESCALATE 6

## Case sai

| # | msg_id | Kỳ vọng | Thực tế | Lỗi |
|---:|---|---|---|---|
| 19 | M19701 | ESCALATE | CLARIFY | label, reason |
| 20 | M03935 | ESCALATE | CLARIFY | label, reason |
| 21 | M32673 | ESCALATE | ESCALATE | reason |
| 23 | M61735 | CLARIFY | ANSWER/DOC-04 | label |
| 24 | M48190 | CLARIFY | ESCALATE | label |
| 25 | M20574 | CLARIFY | ANSWER/DOC-08 | label |
| 26 | M95844 | CLARIFY | ESCALATE | label |
| 27 | M83132 | CLARIFY | ANSWER/DOC-09 | label |
| 31 | M95485 | ANSWER/DOC-03 | ESCALATE | label, doc_id |

## Khả năng kiểm tra lại

Toàn bộ input, top-3, output, từng tiêu chí pass/fail và thời gian chạy nằm tại `eval/trace/run-model-3.jsonl`.
