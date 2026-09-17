# eval/ — Golden set + kết quả các lượt chạy

Người phụ trách: Nguyễn Văn Hưởng.

## Thành phần

- `golden-set.json`: 32 case dùng `msg_id` thật, câu hỏi được diễn đạt lại từ bảng gán nhãn (không chép nguyên văn Discord), chia đều 4 lớp rủi ro × 8 case.
- `risk-cases.md`: bảng markdown để đưa vào `spec.md` §5.
- `run.js`: chạy từng case qua đúng hàm `decide()` mà UI sử dụng; chấm nhãn, nguồn, grounding và reason.
- `run-1.md`: baseline local 28/32 (87,5%), không phải số đo AI.
- `run-2.md`: baseline local 32/32 (100%), không phải số đo AI.
- `run-model-1.md`: lượt OpenAI thật sau khi siết prompt, 28/32 (87,5%), ANSWER sai nguồn = 0; dùng bảng này cho CP3.
- `run-model-2.md`: thử bỏ few-shot để tăng khả năng khái quát, 24/32 (75%), bị loại.
- `run-model-3.md`: thử few-shot diễn đạt khác golden set, 23/32 (71,9%), bị loại.
- `trace/*.jsonl`: input, top-3, output, từng check và thời gian của mọi case; từ run-2 có thêm `model_trace` trước verify.

Luồng model không có regex hoặc rule viết riêng cho câu trong golden set. `verify.js`
chỉ thực thi hai luật bất biến sau AI: `doc_id` phải thuộc top-3 và không hỏi lại
lần thứ hai. Quality bar đề xuất cho CP4 là **≥ 85% đúng nhãn và 0 ANSWER sai
nguồn**; `run-model-1` đạt cả hai điều kiện.

Hai thử nghiệm `run-model-2` và `run-model-3` đều không có lỗi provider và vẫn giữ
0 ANSWER sai nguồn, nhưng accuracy giảm dưới quality bar. Vì vậy prompt sản phẩm
được khôi phục về bản đã tạo `run-model-1`; không chọn kết quả tốt nhất bằng cách
ghi đè report và không đưa rule/regex theo golden set vào runtime.

## Chạy lại

```bash
npm test
npm run eval -- --name=run-local
```

Nếu không cấu hình model, engine chạy `deterministic-local-adapter` để test lặp lại được. Nên cấu hình key qua biến môi trường, không đặt key vào code:

```bash
# OpenAI
ASKONCE_PROVIDER=openai
OPENAI_API_KEY=...
ASKONCE_MODEL=gpt-4.1-mini

# Hoặc Gemini (tùy chọn; không dùng cho run OpenAI)
ASKONCE_PROVIDER=gemini
GEMINI_API_KEY=...
ASKONCE_MODEL=gemini-2.5-flash
```

`ASKONCE_BASE_URL` là tùy chọn; engine tự dùng endpoint chính thức tương ứng. Gemini cũng nhận `GOOGLE_API_KEY`; `ASKONCE_API_KEY` vẫn được hỗ trợ để tương thích ngược. Nếu cả key OpenAI và Gemini cùng tồn tại, phải đặt `ASKONCE_PROVIDER` để chọn rõ provider. Nếu dùng `config.local.js` cho demo cục bộ, file này đã được gitignore; tuyệt đối không phục vụ key qua browser hoặc commit file.

Mỗi quyết định tạo một logical model request. Transport tự retry tối đa 2 lần với
exponential backoff khi provider trả HTTP 429 hoặc 503; các lỗi khác fail closed
thành `ESCALATE/no_source` và được ghi trong trace.

Không được trình bày kết quả local adapter là số đo AI thật. Khi có credential, chạy lại bằng tên mới và dùng chính report/trace đó cho video CP3.

Lượt chạy OpenAI chính của Hưởng dùng `ASKONCE_PROVIDER=openai`. Report phải hiện
`configured-model`, `provider: openai`, tên model thật và trace không có lỗi provider;
không dùng bảng `deterministic-local-adapter` làm số liệu CP3.
