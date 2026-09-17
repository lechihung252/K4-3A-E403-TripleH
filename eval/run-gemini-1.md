# run-gemini-1 — Kết quả AskOnce

- Thời gian: 2026-09-17T04:18:57.115Z
- Chế độ: `configured-model`
- Model: `gemini-3.6-flash` qua endpoint OpenAI-compatible, free tier
- Kết quả: **5/32 (15.6%)**
- ANSWER sai nguồn: **0**
- Nhãn đầu ra: ANSWER 5 · CLARIFY 0 · ESCALATE 27

## Case sai

| # | msg_id | Kỳ vọng | Thực tế | Lỗi |
|---:|---|---|---|---|
| 1 | M49945 | ANSWER/DOC-01 | ESCALATE | label, doc_id |
| 4 | M30724 | ANSWER/DOC-01 | ESCALATE | label, doc_id |
| 5 | M04739 | ANSWER/DOC-05 | ESCALATE | label, doc_id |
| 6 | M21470 | ANSWER/DOC-06 | ESCALATE | label, doc_id |
| 7 | M88122 | ANSWER/DOC-05 | ESCALATE | label, doc_id |
| 8 | M37242 | ANSWER/DOC-04 | ESCALATE | label, doc_id |
| 9 | M58070 | ANSWER/DOC-02 | ESCALATE | label, doc_id |
| 10 | M98619 | ANSWER/DOC-06 | ESCALATE | label, doc_id |
| 11 | M80674 | ANSWER/DOC-03 | ESCALATE | label, doc_id |
| 12 | M20366 | ANSWER/DOC-09 | ESCALATE | label, doc_id |
| 13 | M39389 | ANSWER/DOC-01 | ESCALATE | label, doc_id |
| 14 | M73225 | ANSWER/DOC-03 | ESCALATE | label, doc_id |
| 15 | M51928 | ANSWER/DOC-03 | ESCALATE | label, doc_id |
| 17 | M75939 | ANSWER/DOC-06 | ESCALATE | label, doc_id |
| 18 | M00499 | ESCALATE | ESCALATE | reason |
| 19 | M19701 | ESCALATE | ESCALATE | reason |
| 21 | M32673 | ESCALATE | ESCALATE | reason |
| 23 | M61735 | CLARIFY | ESCALATE | label |
| 24 | M48190 | CLARIFY | ESCALATE | label |
| 25 | M20574 | CLARIFY | ANSWER/DOC-08 | label |
| 26 | M95844 | CLARIFY | ESCALATE | label |
| 27 | M83132 | CLARIFY | ANSWER/DOC-09 | label |
| 28 | M66632 | ANSWER/DOC-03 | ESCALATE | label, doc_id |
| 29 | M97872 | ANSWER/DOC-03 | ESCALATE | label, doc_id |
| 30 | M27846 | ANSWER/DOC-03 | ESCALATE | label, doc_id |
| 31 | M95485 | ANSWER/DOC-03 | ESCALATE | label, doc_id |
| 32 | M79664 | ANSWER/DOC-03 | ESCALATE | label, doc_id |

## Khả năng kiểm tra lại

Toàn bộ input, top-3, output, từng tiêu chí pass/fail và thời gian chạy nằm tại `eval/trace/run-gemini-1.jsonl`.

## Nhận xét — KHÔNG dùng số này làm số đo prompt

21/32 case dính lỗi provider (19 × HTTP 429 rate-limit, 2 × HTTP 503) và bị engine ép thành `ESCALATE/no_source` theo nguyên tắc "lỗi thì không bịa". Chỉ 11 case model thật sự trả lời: đúng 5. Lượt này giữ lại làm bằng chứng cần retry/backoff; so sánh model chỉ có ý nghĩa sau khi `prompt.js` có retry.
