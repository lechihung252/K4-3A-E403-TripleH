# eval/ — Golden set + kết quả các lượt chạy

Người phụ trách: Nguyễn Văn Hưởng.

## Thành phần

- `golden-set.json`: 32 case dùng `msg_id` thật, câu hỏi được diễn đạt lại từ bảng gán nhãn (không chép nguyên văn Discord), chia đều 4 lớp rủi ro × 8 case.
- `risk-cases.md`: bảng markdown để đưa vào `spec.md` §5.
- `run.js`: chạy từng case qua đúng hàm `decide()` mà UI sử dụng; chấm nhãn, nguồn, grounding và reason.
- `run-1.md`: baseline 28/32 (87,5%), giữ lại 4 lỗi để chứng minh vòng cải thiện.
- `run-2.md`: sau khi sửa nguyên nhân, 32/32 (100%), ANSWER sai nguồn = 0.
- `trace/*.jsonl`: input, top-3, output, từng check và thời gian của mọi case; từ run-2 có thêm `model_trace` trước verify.

## Chạy lại

```bash
npm test
npm run eval -- --name=run-local
```

Nếu không cấu hình model, engine chạy `deterministic-local-adapter` để test lặp lại được. Để chạy một model OpenAI-compatible thật, copy `codebase/engine/config.example.js` thành `config.local.js` và điền `apiKey`, `baseUrl`, `model`; hoặc đặt ba biến `ASKONCE_API_KEY`, `ASKONCE_BASE_URL`, `ASKONCE_MODEL`. File chứa key đã được gitignore.

Không được trình bày kết quả local adapter là số đo AI thật. Khi có credential, chạy lại bằng tên mới (ví dụ `--name=run-model-1`) và dùng chính report/trace đó cho video CP3.
