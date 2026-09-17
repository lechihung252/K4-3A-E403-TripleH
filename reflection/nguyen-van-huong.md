# Reflection cá nhân — Nguyễn Văn Hưởng · 2A202602743

> Nhóm TripleH · Zone 5 · Track B · Sản phẩm: **AskOnce** — trợ lý Discord
> dùng tài liệu truy xuất để quyết định ANSWER / CLARIFY / ESCALATE và luôn
> kiểm nguồn trước khi hiển thị câu trả lời.

## 1. Vai trò trong nhóm

Vai trò chính của tôi là **Prompt + Eval**. Tôi phụ trách bước truy xuất top-3,
prompt quyết định ba nhãn, kiểm nguồn sau model và bộ đánh giá. Tôi nhận vai trò
này vì phần việc phù hợp với thế mạnh về logic, kiểm thử và phân tích lỗi: không
chỉ làm model trả kết quả, mà còn phải chứng minh kết quả đó đúng đến đâu và
không được che giấu case sai.

Ngoài phần được phân công, tôi còn tích hợp nhiều provider theo cùng hợp đồng
JSON, thêm trace và retry có giới hạn cho HTTP 429/503, đồng thời bổ sung form
soạn nội dung ticket khi người dùng nhập đúng hoặc gần đúng `/ticket create`.

## 2. Phần mình đã làm

| Việc | Bằng chứng trong repo | Kết quả / con số |
|---|---|---|
| Xây engine gồm truy xuất top-3, prompt và kiểm nguồn | `codebase/engine/retrieve.js`, `prompt.js`, `verify.js`; commit `aad4491` | `decide()` trả đúng hợp đồng ANSWER / CLARIFY / ESCALATE; ANSWER phải dùng `doc_id` thuộc top-3 |
| Tích hợp OpenAI và Gemini theo cùng JSON schema | `codebase/engine/prompt.js`; commit `b3fad2f`, `2d4418e` | Một lời gọi model cho mỗi quyết định; output được parse an toàn theo schema |
| Tách test khỏi biến môi trường và thêm retry provider | `eval/engine.test.js`; commit `5a43fe1`, `37f24cf` | 11/11 unit test pass; retry tối đa 2 lần cho HTTP 429/503 |
| Xây golden set và bốn lớp rủi ro | `eval/golden-set.json`, `eval/risk-cases.md` | 32 case: 4 lớp × 8 case; phân bố nhãn 22 ANSWER · 5 CLARIFY · 5 ESCALATE |
| Chạy và lưu bằng chứng AI thật | `eval/run-model-1.md`, `eval/trace/run-model-1.jsonl` | `gpt-4.1-mini` đúng 28/32 = **87,5%**; ANSWER sai nguồn = **0** |
| Thử hai biến thể prompt tổng quát | `eval/run-model-2.md`, `eval/run-model-3.md` | Kết quả 75% và 71,9%; đều bị loại vì dưới quality bar |
| Bàn giao số liệu CP4 cho phần spec | `docs/cp4-huong-ban-giao.md`; commit `fd9aea4` | Chốt quality bar ≥85% và 0 ANSWER sai nguồn; ghi rõ cả các thử nghiệm thất bại |
| Bổ sung form hỗ trợ soạn ticket | `codebase/app.js`, `codebase/style.css`; commit `9e26a4a`, PR #10 | Khi model chọn DOC-04, UI hiện form loại hỗ trợ, tiêu đề, mô tả và bằng chứng để người dùng sao chép |

**Một quyết định tôi tự đưa ra:** tôi chọn giữ `run-model-1` đạt 87,5% làm bản
chính thức, thay vì dùng kết quả 100% có regex hoặc tiếp tục chỉnh prompt theo
đúng 32 câu đã biết. Lý do là 87,5% là số đo AI thật, vượt quality bar 85% và
không có ANSWER sai nguồn; còn tối ưu tiếp trên cùng golden set sẽ làm tăng nguy
cơ overfit và không phản ánh khả năng xử lý câu lạ ở CP6.

## 3. AI đã hỗ trợ mình thế nào

- **Tool đã dùng:** Codex trong VS Code để hỗ trợ viết và review code, tạo test,
  phân tích trace, cập nhật tài liệu và thao tác Git; OpenAI/Gemini là các model
  provider được tích hợp và đánh giá trong sản phẩm.
- **Dùng ở bước nào:** AI giúp dựng phần boilerplate gọi provider, JSON schema,
  test retry, các biến thể prompt, bảng tổng hợp kết quả eval và form ticket.
- **Chỗ AI làm tốt:** viết nhanh phần khung lặp lại, phát hiện sai khác giữa
  config trình duyệt và config Node, gom số liệu từ report/trace thành bảng có
  thể kiểm tra lại.
- **Chỗ AI làm sai hoặc tôi phải tự sửa:** một phiên bản đã thêm
  `policyGuardrail` dùng regex khớp các cụm từ trong golden set rồi đè kết quả
  model. Lượt đó đạt 100% nhưng bốn case model sai đã bị code sửa thành đúng, nên
  không còn là bằng chứng AI thật và vi phạm yêu cầu không hardcode.
- **Cách tôi kiểm tra output AI:** đọc diff trước khi commit, chạy `npm test`,
  chạy eval thật với provider, kiểm tra `mode`, `provider`, `model` trong report,
  đọc từng trace sai và xác nhận mọi ANSWER có nguồn thuộc top-3. Tôi cũng kiểm
  tra `.env` và API key không được Git theo dõi trước khi push.

## 4. Một bài học từ case fail của chính nhóm

- **Chuyện gì xảy ra:** một lượt `run-model-final` đạt 32/32 (100%), nhưng kết
  quả đến từ `policyGuardrail` chứa regex viết theo các câu trong golden set như
  “thực tập”, “phần cứng”, “phase 1 2 3”, “giảng viên” và “không đăng nhập”. Bốn
  case model trả sai đã bị lớp code này đè thành đúng.
- **Nhóm phát hiện bằng cách nào:** khi so sánh với `run-model-1` chỉ đạt 87,5%
  và đọc lại đường đi của output, nhóm thấy chênh lệch không đến từ prompt hay
  model mà từ rule chạy sau model. Việc xem trace và review diff giúp chỉ ra
  chính xác các case bị sửa nhãn.
- **Đã sửa ra sao:** commit `37f24cf` xoá `policyGuardrail`; `verify.js` chỉ giữ
  hai luật bất biến là `doc_id` phải thuộc top-3 và không được CLARIFY lần hai.
  Nhóm xoá report 100% gây hiểu nhầm, dùng lại `run-model-1` 28/32 và giữ nguyên
  các report 75%/71,9% để thể hiện cả thử nghiệm không thành công.
- **Bài học rút ra:** số đẹp bất thường là tín hiệu phải kiểm tra, không phải lý
  do để công bố ngay. Eval chỉ có giá trị khi model được chạy thật, case sai được
  giữ lại và code an toàn không học thuộc đáp án của golden set.

## 5. Nếu làm lại / có thêm 1 tuần

Tôi sẽ tách một **holdout set** gồm cách hỏi mới và chỉ mở sau khi đã chốt prompt,
thay vì tiếp tục tối ưu trên 32 case hiện tại. Tôi cũng sẽ bổ sung thêm câu hỏi
thật về triệu chứng tài khoản, phạm vi người hỗ trợ và các loại điểm — ba nhóm mà
model vẫn dễ nhầm CLARIFY với ESCALATE. Cuối cùng, tôi sẽ đo retry bằng lỗi mạng
thật và điều chỉnh backoff theo provider thay vì chỉ dùng 250/500 ms phù hợp cho
buổi demo OpenAI.
