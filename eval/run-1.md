# run-1 — Kết quả AskOnce

- Thời gian: 2026-09-17T03:27:57.341Z
- Chế độ: `deterministic-local-adapter`
- Kết quả: **28/32 (87.5%)**
- ANSWER sai nguồn: **0**
- Nhãn đầu ra: ANSWER 24 · CLARIFY 5 · ESCALATE 3

## Case sai

| # | msg_id | Kỳ vọng | Thực tế | Lỗi |
|---:|---|---|---|---|
| 17 | M75939 | ANSWER/DOC-06 | CLARIFY | label, doc_id |
| 20 | M03935 | ESCALATE | ANSWER/DOC-03 | label, reason |
| 21 | M32673 | ESCALATE | ANSWER/DOC-01 | label, reason |
| 27 | M83132 | CLARIFY | ANSWER/DOC-01 | label |

## Khả năng kiểm tra lại

Toàn bộ input, top-3, output, từng tiêu chí pass/fail và thời gian chạy nằm tại `eval/trace/run-1.jsonl`.
