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

Nếu không cấu hình model, engine chạy `deterministic-local-adapter` để test lặp lại được. Nên cấu hình key qua biến môi trường, không đặt key vào code:

```bash
# OpenAI
ASKONCE_PROVIDER=openai
OPENAI_API_KEY=...
ASKONCE_MODEL=gpt-4.1-mini

# Hoặc Gemini
ASKONCE_PROVIDER=gemini
GEMINI_API_KEY=...
ASKONCE_MODEL=gemini-2.5-flash
```

`ASKONCE_BASE_URL` là tùy chọn; engine tự dùng endpoint chính thức tương ứng. Gemini cũng nhận `GOOGLE_API_KEY`; `ASKONCE_API_KEY` vẫn được hỗ trợ để tương thích ngược. Nếu cả key OpenAI và Gemini cùng tồn tại, phải đặt `ASKONCE_PROVIDER` để chọn rõ provider. Nếu dùng `config.local.js` cho demo cục bộ, file này đã được gitignore; tuyệt đối không phục vụ key qua browser hoặc commit file.

Không được trình bày kết quả local adapter là số đo AI thật. Khi có credential, chạy lại bằng tên mới (ví dụ `--name=run-model-1`) và dùng chính report/trace đó cho video CP3.
