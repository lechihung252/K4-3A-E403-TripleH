# Reflection — Nguyễn Văn Hưởng

## Phần tôi phụ trách

Tôi phụ trách bước truy xuất top-3, prompt quyết định ANSWER/CLARIFY/ESCALATE,
kiểm nguồn sau model và bộ eval. Tôi cũng tích hợp OpenAI/Gemini theo cùng hợp
đồng JSON, thêm trace và retry có giới hạn cho HTTP 429/503.

## Kết quả kiểm chứng

- Golden set: 32 case, chia đều 4 lớp rủi ro.
- Lượt OpenAI được chọn: `run-model-1`, model `gpt-4.1-mini`.
- Kết quả: 28/32 (87,5%), đạt quality bar ≥85%.
- ANSWER sai nguồn: 0.
- Unit test: 11/11 pass tại thời điểm bàn giao CP4.

## Điều tôi học được

Điểm 100% từ rule/regex đè output model không phản ánh năng lực thật và không
thể dùng làm evidence. Tôi đã xoá `policyGuardrail`, giữ `verify.js` chỉ cho các
luật bất biến (`doc_id` thuộc top-3 và không CLARIFY lần hai), rồi công bố lại số
87,5% thật. Hai vòng prompt tiếp theo giảm còn 75% và 71,9%; tôi giữ lại report
thay vì xoá hoặc ghi đè để nhóm thấy cả thử nghiệm thất bại.

## Giới hạn còn lại

Model vẫn khó phân biệt câu thiếu ngữ cảnh với câu cần chuyển người, đặc biệt ở
triệu chứng tài khoản, phạm vi người hỗ trợ và loại điểm. Golden set còn nhỏ và
có thể không đại diện cho cách hỏi mới ở CP6. Retry 250/500 ms phù hợp demo
OpenAI nhưng có thể chưa đủ cho quota miễn phí của provider khác.

## Quyết định tiếp theo

Giữ prompt của `run-model-1` cho prototype, chốt quality bar 85% + 0 sai nguồn,
và ưu tiên mở rộng eval bằng case mới thay vì tối ưu tiếp trên 32 case hiện tại.
