# Danh sách msg_id gán nhãn tay → gửi Hưởng (bước "Golden set")

Nguồn: gán nhãn tay 64 câu trả lời dạng menu 1/2/3 của bot cũ trong `discord-pack` (`k4_messages.csv`), xếp theo 7 lý do R1-R7 (menu thừa/cần) rồi suy ra **hành động đúng theo flow-v2** (`ANSWER` / `CLARIFY` / `ESCALATE`). Phương pháp đếm và toàn bộ 64 dòng (kèm tóm tắt ý hỏi + giải thích, không chép nguyên văn) nằm ở `docs/nhan-tay-63-menu.md`.

Loại khỏi mẫu 2 dòng không có câu hỏi gốc trong pack (`M91156`, `M90031`) → còn **62 case đánh giá được**.

Copy 3 danh sách dưới gửi Hưởng qua Discord, để Hưởng chọn case đưa vào `eval/golden-set.json` (giữ nguyên format `{id, msg_id, question, history, askedOnce, expected}` đã chốt).

## Nhóm ANSWER — 52 msg_id (câu hỏi rõ, có căn cứ → nên trả lời thẳng)

```
M94466 M49945 M24294 M96789 M88727 M32171 M58070 M42370 M92442 M12561
M15979 M59124 M85508 M81645 M94849 M66632 M30724 M04739 M98619 M66633
M77407 M51773 M94107 M80674 M89758 M95485 M97872 M31759 M57734 M79664
M65121 M51928 M76319 M28018 M73225 M27846 M75939 M88122 M04524 M66575
M21470 M63545 M54714 M31042 M81204 M90994 M54695 M37242 M20366 M86498
M39389 M31751
```

## Nhóm CLARIFY — 5 msg_id (thiếu thông tin thật, hỏi lại 1 câu là hợp lý)

```
M61735 M48190 M20574 M95844 M83132
```

## Nhóm ESCALATE — 5 msg_id (sự cố cá nhân / dữ liệu cá nhân / ngoài phạm vi → chuyển TA)

```
M00499 M19701 M03935 M32673 M04968
```

## Hưởng cần lưu ý khi lên golden set (≥20 case, đủ cơ cấu theo guide §2.6)

- Nhóm ANSWER đang áp đảo (52/62) vì bot cũ hay đưa menu thừa cho câu đã rõ — **đừng lấy toàn bộ 52 case ANSWER**, chỉ chọn đủ đa dạng chủ đề (XP, điểm danh, daily standup, ticket, topic pick — khớp `kb/DOC-01..09`) để không lệch hẳn về 1 lớp.
- Nhóm CLARIFY và ESCALATE chỉ có 5 case mỗi nhóm trong mẫu 62 — theo guide mỗi lớp chỗ khó cần ≥2 case, nên **giữ hết cả 10 case này** rồi bổ sung thêm case tự viết cho đủ ≥8 kịch bản rủi ro (spec §5, làm ở CP4).
- Với mỗi case ANSWER chọn, cần biết `doc_id` kỳ vọng (tra theo chủ đề trong `kb/`) để điền `expected.doc_id` — ví dụ M49945 (hỏi khi nào tính XP) → `DOC-01`.
