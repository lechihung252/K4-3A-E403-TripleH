# CP4 — Bàn giao phần Hưởng cho Hoàng

> Mục đích: nội dung markdown để Hoàng dán vào `spec.md`. Hưởng không trực tiếp
> sửa `spec.md` nhằm giữ đúng phân công sở hữu file.

## Nội dung cho §5

Dùng nguyên bảng **4 lớp lỗi × 8 case mỗi lớp** trong
[`eval/risk-cases.md`](../eval/risk-cases.md). Mỗi dòng đã liên kết 1–1 với
`msg_id` và expected output trong `eval/golden-set.json`.

Bốn lớp:

1. Hỏi lại thừa khi câu đã rõ.
2. Hiểu sai thuật ngữ hoặc truy xuất sai tài liệu.
3. Thiếu nguồn, dữ liệu cá nhân và quyết định ngoài phạm vi.
4. Ngữ cảnh hội thoại và vòng hỏi lại.

## Nội dung dán vào §7

### Quality bar

> Đạt khi **≥ 85% case đúng nhãn** và **không có case ANSWER sai nguồn
> (Factuality fail = 0)**. Ngưỡng được chốt từ kết quả AI thật đầu tiên đạt yêu
> cầu ở CP3 và giữ nguyên từ CP4.

### Kết quả các lượt chạy AI thật

| Lượt | Model | Tổng | Đúng | Tỷ lệ | ANSWER sai nguồn | Quyết định |
|---|---|---:|---:|---:|---:|---|
| `run-openai-1` | `gpt-4o-mini` | 32 | 26 | 81,3% | 0 | Baseline AI; chưa đạt quality bar |
| `run-model-1` | `gpt-4.1-mini` | 32 | 28 | **87,5%** | **0** | Đạt; dùng làm số CP3/quality bar |
| `run-model-2` | `gpt-4.1-mini` | 32 | 24 | 75,0% | 0 | Thử nghiệm prompt bị loại |
| `run-model-3` | `gpt-4.1-mini` | 32 | 23 | 71,9% | 0 | Thử nghiệm prompt bị loại |

`run-model-2` và `run-model-3` không có lỗi API/parse. Kết quả giảm là lỗi hành
vi prompt, không phải lỗi provider. Nhóm giữ prompt của `run-model-1`, không dùng
regex hoặc rule viết riêng cho câu trong golden set để nâng điểm.

### Bốn lỗi còn lại của bản được chọn

| `msg_id` | Kỳ vọng | Thực tế | Nhận xét |
|---|---|---|---|
| M32673 | ESCALATE/out_of_scope | ESCALATE/no_source | Đúng nhãn, sai reason |
| M61735 | CLARIFY | ESCALATE/personal_data | Chưa tách triệu chứng mơ hồ khỏi dữ liệu cá nhân |
| M48190 | CLARIFY | ESCALATE/no_source | Chưa hỏi phạm vi lớp/phòng |
| M83132 | CLARIFY | ANSWER/DOC-09 | Tự suy “điểm cộng” là XP |

## Nội dung dán vào §9 Changelog

| Thời điểm | Đổi gì | Vì sao |
|---|---|---|
| CP3 → CP4 | Siết prompt CLARIFY và Structured Outputs; thêm retry 429/503; loại `policyGuardrail` | `run-model-1` đạt 87,5%; feedback yêu cầu không hard-code golden set |
| CP4 | Thử hai biến thể prompt tổng quát rồi quay lại bản `run-model-1` | `run-model-2` 75% và `run-model-3` 71,9%, đều dưới quality bar |

## Checklist gửi nhóm

- [ ] Gửi link file này cho Hoàng qua Discord.
- [ ] Hoàng dán §5, §7 và changelog vào `spec.md` trước khi khoá CP4.
- [ ] Dùng `run-model-1.md` và trace tương ứng trên slide; không dùng baseline local.
- [ ] Nói rõ 87,5% là AI thật và Factuality fail = 0.
