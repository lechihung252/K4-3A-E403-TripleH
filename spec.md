# AI SPEC — AskOnce · Nhóm TripleH · Zone 5
Hướng: [ ] A — VLearn  [x] B — Trợ lý Học viên  [ ] C — Làn mở
Loại: [x] Tối ưu tính năng có sẵn  [ ] Tính năng mới

> Chốt trước 21:00 17/9 (CP4). Quality bar ở §7 giữ nguyên sau thời điểm nộp.
> Canvas 4 ô: `canvas-cp1.md` · Golden set + kết quả: `eval/` · Nhật ký dùng thử: `validation/`

## §1. User & Job
- Job executor + workflow (không có worksheet JTBD riêng — viết thẳng câu JTBD dưới đây; sơ đồ nhóm dùng là `canvas-cp1.md` §01): học viên K4 trong tuần đầu Build Phase, khi cần biết nhanh một quy định vận hành (điểm danh, XP, daily standup, lập team, deadline...), tag bot "Trợ lý" trên Discord bằng một câu hỏi tự nhiên đã đủ rõ, kỳ vọng nhận được câu trả lời dùng được ngay để làm tiếp việc trong ngày.
- Core JTBD: *"Khi mình cần biết một quy định vận hành để làm đúng việc ngay, mình muốn hỏi một lần là ra câu trả lời dùng được, để không phải dừng việc đang làm đi tra hỏi lại."*
- Problem statement: học viên hỏi một câu đã đủ rõ nhưng nhận lại danh sách bắt chọn lại ngữ cảnh (menu 1/2/3) hoặc câu trả lời không dùng được, phải gõ lại/tự tìm/hỏi bạn, mất 3–10 phút mỗi lần, có trường hợp không bao giờ nhận được câu trả lời và làm sai hoặc lỡ việc tính điểm.
- Evidence (chuẩn A và B — log đầy đủ trong repo):
  - **B — Mining `discord-pack/`** (1.092 tin, 12–14/09, đếm tự động — `canvas-cp1.md` §02): **63/313 (20%)** câu trả lời của bot là menu hỏi lại; **53/61** người hỏi phải nhắn thêm trong 30 phút sau menu; **28/120** người tag bot ≥3 lần trong 30 phút.
  - **B — Gán nhãn tay kiểm lại mining** (`docs/nhan-tay-63-menu.md`, `docs/menu-labels.csv`, phương pháp đếm ghi rõ trong file): đánh giá được 62/64 tin dạng menu, hành động đúng theo flow-v2 là **ANSWER 52 · CLARIFY 5 · ESCALATE 5** — nghĩa là **52/62 ≈ 84%** case trong mẫu này là hỏi lại thừa cho câu đã đủ rõ để trả lời thẳng, khớp hướng bằng chứng B ở CP1.
  - **A — Khảo sát học viên K4**, hiện **n = 5 người ngoài nhóm** (mục tiêu ≥20 trước CP4, đang thu tiếp — xem mục "Tự khai phần chưa xong" cuối spec): 1/5 xác nhận đúng tiêu chí pain (menu/không có info/lạc đề **và** phải nhắn thêm ≥1 lượt), 2/5 không có câu trả lời dùng được ngay, 2/5 từng lỡ việc vì không nhận được câu trả lời (`canvas-cp1.md` §02, bảng R01–R05).
  - ≥5 quote/ví dụ nguyên văn + nguồn:
    1. Bot trả lời thẳng khi hỏi cách tạo ticket — "Hướng dẫn 3 bước dùng lệnh `/ticket create` (chọn Type → Subject → mô tả chi tiết)" (`docs/quan-sat-truc-tiep-bot-hien-tai.md`, case 1) — ví dụ hành vi ANSWER đúng, dùng làm nguồn thật cho `kb/DOC-04.md`.
    2. Bot tự nhận không có căn cứ khi hỏi hạn nộp PRD chưa công bố — *"Vì câu này mình chưa có đủ thông tin, nên để tránh đưa thông tin sai, mình xin phép tag Mod hỗ trợ trả lời câu hỏi này cho bạn nhé"* (`docs/quan-sat-truc-tiep-bot-hien-tai.md`, case 2) — đúng tinh thần "không đoán khi thiếu nguồn" mà nhóm muốn ép bằng code ở §6.
    3. R01 (khảo sát A): hỏi cách check điểm danh, bot trả menu 1/2/3, phải nhắn thêm 2 lượt trong 3–10 phút, **có lỡ việc**.
    4. R02 (khảo sát A): hỏi cách dùng daily-standup, bot không trả lời được, **không bao giờ có** câu trả lời dùng được, **có lỡ việc**.
    5. M49945, M58070, M30724, M00499, M20574 (`canvas-cp1.md` §02) — 5 msg_id mẫu cho các case menu thừa dùng làm ví dụ mining B, tra chi tiết ở `docs/menu-labels.csv`.

## §2. Impact & quyết định chọn
- Bảng impact ≥3 ứng viên (ước lượng từ phân bố gán nhãn tay 62 case ở `docs/menu-labels.csv`, chưa tách cột chủ đề trong file nên số người/tần suất là ước lượng theo tỷ trọng câu hỏi quan sát được, không phải đếm chính xác từng DOC):

  | Ứng viên (nhóm chủ đề hay hỏi) | Bao nhiêu người | Tần suất | Tốn gì mỗi lần | Khả thi với 1 lát cắt Mock trong ~48h |
  |---|---|---|---|---|
  | 1. Chỉ riêng **điểm danh** (DOC-02) | Toàn bộ ~230 học viên phòng E403, nhưng chỉ tính người hỏi lại bot trong tuần đầu | Rộ vào ngày có workshop, thấp ngày thường | 3–10 phút/lần hỏi lại + rủi ro bị tính vắng oan | Cao (phạm vi hẹp, dễ viết đủ `kb/`) nhưng **impact thấp** — bỏ sót phần lớn 20% pain nằm ở các chủ đề khác |
  | 2. Chỉ riêng **XP/Mentor duty** (DOC-01, DOC-05) | Tương tự, tập trung học viên đang làm Mentor Duty | Đều theo lịch Thứ 4/Thứ 7 | 3–10 phút + có thể mất XP nếu hiểu sai deadline | Cao nhưng cũng **hẹp** — không giải quyết pain ở điểm danh/deadline/daily standup |
  | 3. **Toàn bộ 9 chủ đề hay hỏi** (9 DOC theo `kb/`, khớp phân bố gán nhãn tay) | Toàn bộ học viên K4 từng tag bot | 20% tổng số câu trả lời của bot là menu thừa (63/313), rải đều nhiều chủ đề | 3–10 phút/lần + nguy cơ lỡ việc/mất điểm khi không nhận được câu trả lời | Trung bình — phải viết đủ 9 DOC và giữ prompt tổng quát, nhưng vẫn nằm trong 1 lát cắt (1 quyết định AI/câu hỏi), không phình phạm vi |
  | 4. Mở rộng sang **chat tự do ngoài quy định vận hành** (hỏi ý kiến, tư vấn đề tài) | Không rõ quy mô, không đo được bằng mining B | Không đếm được | Không đếm được | Thấp — không có bằng chứng B/A nào đo được, dễ vượt phạm vi "trợ lý quy định vận hành" |
- Ứng viên ĐÃ LOẠI + vì sao:
  - Ứng viên 1 (chỉ điểm danh) và ứng viên 2 (chỉ XP/mentor duty): loại vì mỗi ứng viên chỉ chạm 1–2/9 chủ đề, trong khi mining B cho thấy pain (63/313 menu thừa) rải đều nhiều chủ đề — chọn 1 chủ đề hẹp sẽ để lại phần lớn pain chưa được giải quyết, không tận dụng hết 62 case đã gán nhãn tay.
  - Ứng viên 4 (chat tự do): loại vì không có bằng chứng A/B nào đo được quy mô hay tần suất, và vi phạm cost-of-error đã chốt ở canvas — mở rộng phạm vi ngoài "quy định vận hành có căn cứ trong `kb/`" làm tăng rủi ro AI trả lời bịa cho câu không có nguồn chính thức.
- Ứng viên CHỌN + vì sao (bằng số): **Ứng viên 3 — toàn bộ 9 chủ đề hay hỏi**, vì đây là phạm vi duy nhất phủ được phần lớn bằng chứng đã thu: 84% (52/62) case gán nhãn tay là hỏi lại thừa nằm rải trên nhiều chủ đề chứ không dồn vào 1 DOC, và 20% (63/313) mining B cũng là số tổng trên toàn bộ câu trả lời của bot, không phải của riêng 1 chủ đề — chọn phạm vi hẹp hơn sẽ chỉ giải được một phần nhỏ trong số đó.

## §3. Giải pháp tương tự đã nghiên cứu
- **NotebookLM** — Lê Chí Hùng thử 17/9, nguồn là 4 file `kb/` của nhóm (DOC-01, 02, 04, 08), 5 câu ứng với 3 nhánh + correction (ảnh: `validation/notebooklm-*.png`):
  - *Flow:* upload tài liệu → hỏi tự do → trả lời dài có số cite [1][2] cạnh từng ý, bấm cite nhảy về đoạn gốc; cuối câu gợi ý 2–3 câu hỏi tiếp.
  - *Đáng học:* (1) cite đặt **ngay sau từng ý**, không gom cuối bài — kiểm được từng câu; (2) tài liệu thiếu thì nói thẳng "chưa quy định" (câu "khi nào tính XP", "học bổng"), không bịa; (3) bị phản bác "sai rồi, XP tính từ tuần 2" nó **không đổi theo người dùng** — nói tài liệu không đề cập, nhắc lại nguồn, chỉ về kênh BTC.
  - *Đáng né:* (1) câu mơ hồ "muộn sau 23h59" nó **không hỏi lại** mà tự chọn cách hiểu (daily standup) rồi trả lời một đoạn, cite DOC-01 trong khi DOC-08 mới nói về hạn 23:59 — đúng kiểu "tự tin sai nguồn" mà cost-of-error của nhóm sợ nhất; (2) câu ngoài phạm vi nó đề nghị **tìm trên internet** — với bot quy định khoá học, web không phải nguồn chính thức; (3) mọi kết thúc đều là "bạn tự đi kiểm tra / tự tạo ticket", không có bước chuyển người cụ thể.
  - *Mình khác gì:* AskOnce không để AI tự quyết đã đủ nguồn chưa — code kiểm `doc_id ∈ top-3` sau AI (④); thiếu ngữ cảnh thì hỏi lại **đúng 1 câu** với gợi ý từ tài liệu thay vì đoán (⑤); không nguồn hoặc bị phản bác thì **chuyển TA kèm mẫu ticket điền sẵn** (câu hỏi, DOC đã tra, câu trả lời cũ) thay vì bảo học viên tự đi hỏi; và không bao giờ ra ngoài `kb/`.
- **Bot "Trợ lý" hiện tại của khoá** (bằng chứng trực tiếp trong repo, không phải sản phẩm ngoài — dùng để so sánh đối lập với NotebookLM):
  - *Flow:* học viên tag bot bằng câu hỏi tự nhiên → bot phân loại và trả về danh sách đánh số ("Bạn muốn hỏi về…? 1. 2. 3.") bắt chọn lại ngữ cảnh, hoặc trả lời thẳng nếu nhận diện được câu hỏi dạng lệnh cố định.
  - *Đáng học:* (1) khi thật sự không có căn cứ, bot **từ chối đoán** và chuyển Mod thay vì bịa (`docs/quan-sat-truc-tiep-bot-hien-tai.md` case 2) — đúng hướng G10 nhóm muốn giữ; (2) câu hỏi dạng lệnh rõ ràng (`/daily-standup`, `/rank`) được trả lời dưới 1 phút, không hỏi lại — cho thấy vấn đề không nằm ở việc bot "không biết trả lời" mà ở cách xử lý câu hỏi viết tự nhiên.
  - *Đáng né:* (1) mặc định hỏi lại bằng **menu cố định 1/2/3** ngay cả khi câu hỏi đã đủ rõ để trả lời thẳng — nguồn gốc của 63/313 (20%) câu trả lời là menu thừa; (2) không phân biệt "câu thiếu ngữ cảnh thật" với "câu đã rõ nhưng lạ với bot" — cả hai đều rơi vào cùng một mẫu câu hỏi lại, khiến 53/61 người phải nhắn thêm; (3) không có cơ chế nào ép "chỉ hỏi lại tối đa 1 lần" — quan sát mining cho thấy có người tag lại ≥3 lần trong 30 phút (28/120) mà vẫn chưa xong việc.
  - *Mình khác gì:* AskOnce thay menu cố định bằng quyết định 3 nhánh do AI đưa ra dựa trên có/không có căn cứ trong `kb/` (không phải bảng quyết định cứng theo từ khoá); giới hạn hỏi lại đúng 1 lần bằng code (`askedOnce`), không để việc "hỏi lại vô hạn" lặp lại như bot cũ; và mọi câu ANSWER đều kèm dẫn nguồn DOC-xx cụ thể, thay vì trả lời không rõ dựa trên đâu.

## §4. Thiết kế
- Lát cắt MỘT CÂU (1 user · 1 việc · 1 quyết định AI · 1 kết quả): Một học viên K4 · hỏi bot một câu về quy định Build Phase · AI quyết định **trả lời ngay** (câu đã rõ và có căn cứ trong `kb/`), **hỏi lại đúng một câu** (thật sự thiếu thông tin), hoặc **chuyển TA** (không có căn cứ hoặc hỏi dữ liệu cá nhân) · học viên nhận câu trả lời có dẫn nguồn (DOC-xx) trong một lượt, không phải chọn menu 1/2/3.
- Sơ đồ luồng (①–⑥, chỉ ③ là AI; bản gốc + bảng so sánh hai luồng cũ ở `docs/flow-v2.html`):

  ![Sơ đồ luồng AskOnce v2](docs/flow-v2.png)
- Non-goals (≥3 thứ KHÔNG build):
  1. Không hỗ trợ tạo/nộp ticket thay học viên — chỉ đưa mẫu điền sẵn (`docs/mau-ticket-escalate.md`), học viên tự xác nhận và gửi.
  2. Không hỏi lại quá 1 lần trong CLARIFY — lần 2 vẫn không rõ thì ép thành ESCALATE (chốt bằng code, không để LLM tự quyết định lặp).
  3. Không trả lời (ANSWER) khi `doc_id` không nằm trong top-3 tài liệu tra được — kể cả khi AI "tự tin" muốn trả lời, code vẫn ép chuyển ESCALATE (`reason: no_source`).
  4. Không trả dữ liệu cá nhân (điểm, điểm danh, XP của riêng một học viên) — luôn chuyển ticket TA (`reason: personal_data`), không tra `kb/` cho loại câu hỏi này.
- Mức prototype nhắm tới: [ ] Sketch [x] Mock [ ] Working — Mock: flow bấm được trọn (nhận câu hỏi → tra `kb/` → hiện kết quả), **AI thật ở lõi** (bước ③ gọi LLM 1 lần, trả JSON `label/doc_id/reason/question/answer` — `doc_id` là **một** mã DOC-xx, phải nằm trong top-3 bước ②); phần mock, ghi rõ trong `codebase/README.md`: (a) kênh Discord mô phỏng bằng web — tag bot, lịch sử 2–3 tin, mẫu `/ticket create`; cắm Discord API là việc để dành sau, không thuộc lát cắt; (b) `kb/` 9 DOC do nhóm tự soạn theo chủ đề hay hỏi trong `discord-pack`, không phải văn bản chính thức; (c) ticket là mẫu điền sẵn, học viên tự gửi. Khi không có key, engine chạy adapter local chỉ để test UI — không dùng làm số đo.
- Automation: [ ] augment [x] conditional [ ] automate — lý do theo cost-of-error: trả lời sai về XP/điểm danh/deadline khiến học viên mất điểm hoặc lỡ việc (đắt, khó sửa) → không cho AI tự trả lời khi thiếu căn cứ; nhưng hỏi lại thừa cho câu đã rõ cũng có giá — đang chiếm 20% câu trả lời của bot cũ, khiến học viên mất 3-10 phút mỗi lần (bằng chứng B, `canvas-cp1.md` §02) → nên để AI tự trả lời khi có nguồn, chỉ hỏi lại/chuyển người khi thật sự cần.
- §4b. Nguyên tắc đã áp dụng (≥4 — HAX/PAIR, xem guide):
  | Nguyên tắc | Áp cụ thể vào đâu trong prototype |
  |---|---|
  | **G2** — làm rõ nó làm tốt đến đâu | Mọi câu ANSWER hiện kèm "trả lời dựa trên [DOC-xx]"; nếu không có DOC-xx phù hợp thì không trả lời liều mà nói rõ chuyển TA — học viên biết khi nào nên tin. |
  | **G10** — thu hẹp phạm vi khi nghi ngờ *(bắt buộc)* | Bước ③④⑤: `doc_id` ngoài top-3 → ép `ESCALATE (no_source)`; nghi ngờ do thiếu ngữ cảnh → `CLARIFY` tối đa 1 câu, không "làm liều" đoán câu trả lời. |
  | **G11** — giải thích vì sao | Nhánh ANSWER và mẫu ticket (`docs/mau-ticket-escalate.md`) đều hiện dòng lý do cụ thể ("dựa trên DOC-xx" / "chưa tìm thấy tài liệu nói đúng câu này"), không chỉ báo kết quả suông. |
  | **G9** — sửa dễ dàng | Nhánh Correction: học viên phản hồi câu trả lời sai → quay lại bước ① với câu hỏi cũ, hoặc chọn thẳng ESCALATE — không phải mở lại từ đầu. |

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản (≥8) [bảng theo guide §2.5]

32 kịch bản, mỗi kịch bản là một case trong `eval/golden-set.json` (8 case/lớp), bảng đầy đủ ở `eval/risk-cases.md`. Dưới đây mỗi lớp 3 kịch bản tiêu biểu, cột cuối là kết quả thật ở lượt `run-model-1` (gpt-4.1-mini).

| Lớp chỗ khó | Rủi ro | Kịch bản (`msg_id`) | Kết quả đúng | run-model-1 |
|---|---|---|---|---|
| **1. Hỏi lại thừa khi câu đã rõ** — chính pain của bot cũ | Model thấy câu ngắn rồi mặc định CLARIFY, tái tạo menu 1/2/3 | "Khi nào bắt đầu tính XP?" (M49945) | ANSWER · DOC-01 | ✅ |
| | | "Ai phải nộp daily standup?" (M77407) | ANSWER · DOC-03 | ✅ |
| | | "Tạo ticket thế nào?" (M37242) | ANSWER · DOC-04 | ✅ |
| **2. Hiểu sai thuật ngữ / truy xuất sai DOC** | Tiếng Anh, viết tắt, lỗi chính tả kéo nhầm tài liệu | "pick topic trên Phoenix" (M98619) | ANSWER · DOC-06 | ✅ |
| | | "Xem rank cá nhân" (M20366) | ANSWER · DOC-09 | ✅ |
| | | "Các hình thức điểm danh" (M58070) | ANSWER · DOC-02 | ✅ |
| **3. Thiếu nguồn, dữ liệu cá nhân, ngoài phạm vi** | Model suy diễn từ DOC "gần nghĩa" hoặc trả lời chuyện riêng của một người | "Hoạt động của mình chưa được cộng XP" (M00499) | ESCALATE · personal_data | ✅ |
| | | "Ai cấp thiết bị cho đề tài phần cứng?" (M32673) | ESCALATE · out_of_scope | ❌ đúng nhãn, trả no_source |
| | | "Không đăng nhập được Phoenix" (M61735) | CLARIFY (hỏi lỗi gì) | ❌ trả personal_data |
| **4. Ngữ cảnh hội thoại và vòng hỏi lại** | Bỏ qua 2–3 tin trước, hoặc CLARIFY vô hạn | "Muộn sau 23h59" chưa nói việc gì (M20574) | CLARIFY | ✅ |
| | | "Cả ba" sau menu bot cũ (M95485) | ANSWER · DOC-03 | ✅ |
| | | "Điểm cộng trên lớp xem ở đâu?" (M83132) | CLARIFY (điểm gì?) | ❌ trả ANSWER DOC-09 |

Cách chặn theo lớp: (1) prompt ép "câu rõ + có nguồn → ANSWER ngay"; (2) retrieval dùng `kb/synonyms.json`, chỉ đưa top-3 vào model; (3) `verify.js` ép ANSWER phải có `doc_id ∈ top-3`, reason phải thuộc 4 giá trị; (4) truyền history cũ → mới, `askedOnce=true` mà còn CLARIFY thì code ép ESCALATE/no_source. Lớp 3 và 4 là nơi 4/4 case sai tập trung — xem §7.
## §6. Bốn đường đi của trải nghiệm
- **Happy path:** câu hỏi rõ, ② tra `kb/` ra ≥1 DOC-xx đúng chủ đề → ③ AI trả `ANSWER`, `doc_id` nằm trong top-3 → hiện câu trả lời kèm dẫn nguồn trong một lượt, không cần chọn menu.
- **Low-confidence (②) — thiếu ngữ cảnh:** câu hỏi thiếu thông tin thật (vd "muộn sau 23h59" không nói muộn việc gì) → ③ trả `CLARIFY` + 1 câu hỏi lại gợi từ top-3 DOC → học viên trả lời → quay lại ① với ngữ cảnh mới. Đã hỏi lại 1 lần (`askedOnce=true`) mà vẫn `CLARIFY` → code ép thành `ESCALATE`, không hỏi lại lần 2.
- **Failure/không căn cứ (①):** ② không tra ra DOC-xx nào khớp, hoặc ③ trả `doc_id` không nằm trong top-3 → ④ code kiểm và ép `ESCALATE (reason: no_source)` — không để AI tự bịa câu trả lời khi thiếu căn cứ.
- **Correction (user sửa):** học viên phản hồi câu ANSWER là sai/chưa đúng ý → quay lại bước ① kèm câu hỏi cũ + phản hồi, hoặc học viên chọn thẳng ESCALATE nếu muốn hỏi TA luôn — không bắt gõ lại câu hỏi từ đầu (G9).
- **Khi bị đòi ngoài phạm vi (③):** câu hỏi là quyết định của BTC/mentor (vd "chủ đề phần cứng tự chuẩn bị hay BTC cấp") mà `kb/` không có căn cứ chính thức → `ESCALATE (reason: out_of_scope)`, mẫu ticket ghi rõ lý do (`docs/mau-ticket-escalate.md`).
- **Case đặc thù domain (④):** câu hỏi đụng dữ liệu cá nhân của học viên (điểm, điểm danh, sự cố tài khoản riêng — vd "sao mình không thấy thuộc nhóm G nào") → luôn `ESCALATE (reason: personal_data)` ngay từ bước ③, không tra `kb/` cho loại này dù có vẻ liên quan đến chủ đề chung.

## §7. Kiểm thử
- Chiều chất lượng + định nghĩa kiểm chứng được:
  - **Nhãn đúng (Relevance):** pass nếu `label` (ANSWER/CLARIFY/ESCALATE) AI trả khớp `expected.label` trong golden set; fail nếu lệch.
  - **Có căn cứ, không bịa (Factuality):** với mọi case `ANSWER`, pass chỉ khi `doc_id` trả về nằm trong top-3 mà bước ② tra ra (kiểm bằng code, không chấm cảm tính) và trùng `expected.doc_id`; nếu AI trả `ANSWER` mà không có `doc_id` hợp lệ → tự động fail case đó dù nhãn đúng.
- Golden set (≥20 case theo cơ cấu trong guide §2.6, file trong `eval/`): dựng từ danh sách msg_id đã gán nhãn tay ở `docs/golden-set-msg-ids-cho-huong.md` (62 case: 52 ANSWER · 5 CLARIFY · 5 ESCALATE, gán theo phương pháp ở `docs/nhan-tay-63-menu.md`) — Hưởng chọn lọc đủ đa dạng chủ đề (khớp `kb/DOC-01..09`) và giữ toàn bộ 10 case CLARIFY/ESCALATE để không lệch hẳn về 1 lớp, bổ sung thêm case tự viết cho ≥8 kịch bản rủi ro ở CP4 (spec §5).
- Quality bar (chốt 21:00 17/9, giữ nguyên sau đó): **"Đạt khi ≥ 85% qua bộ 32 case, và không case nào ANSWER sai nguồn (Factuality fail = 0)."** Chọn 85% vì lượt CP3 đạt 87,5% với 4 case sai đều thuộc lớp 3–4 (ranh giới CLARIFY/ESCALATE), là vùng chấp nhận được với cost-of-error: sai theo hướng chuyển TA, không sai theo hướng bịa.
- Kết quả các lượt chạy (bảng % — cập nhật đến trước CP6). Chấm tự động bằng `eval/run.js`, trace từng case ở `eval/trace/`:

  | Lượt | Giờ 17/9 | Model | Case | Đúng | % | Factuality fail | 1 failure đáng kể nhất |
  |---|---|---|---|---|---|---|---|
  | `run-gemini-1` | 11:18 | gemini-3.6-flash (free) | 32 | 5 | 15,6 | 0 | 21/32 case dính HTTP 429/503 → ép no_source; không dùng làm số đo, là lý do thêm retry |
  | `run-openai-1` | 13:33 | gpt-4o-mini | 32 | 26 | 81,3 | 0 | 5/5 case CLARIFY sai — model chưa bao giờ chọn CLARIFY |
  | `run-model-1` | 13:54 | gpt-4.1-mini, prompt thêm định nghĩa + ví dụ CLARIFY | 32 | 28 | **87,5** | 0 | M61735 "không đăng nhập được Phoenix" → personal_data thay vì hỏi lỗi gì |
  | `run-model-2` | — | gpt-4.1-mini, thử biến thể prompt tổng quát hơn | 32 | 24 | 75,0 | 0 | Lỗi hành vi prompt, không phải lỗi provider/parse — bị loại |
  | `run-model-3` | — | gpt-4.1-mini, thử biến thể prompt khác | 32 | 23 | 71,9 | 0 | Cùng nguyên nhân với run-model-2 — bị loại |

  Đối chiếu quality bar: `run-model-1` **đạt** (87,5 ≥ 85, Factuality fail = 0) và được giữ làm bản chọn. `run-model-2`/`run-model-3` là hai lần thử nghiệm prompt tổng quát hơn nhưng tụt điểm, nhóm quay lại prompt của `run-model-1`, không dùng regex/rule viết riêng theo golden set để nâng điểm. Hai lượt `run-1`/`run-2` trong `eval/` chạy adapter local, không phải AI, không tính.

- Bốn lỗi còn lại của bản được chọn (`run-model-1`):

  | `msg_id` | Kỳ vọng | Thực tế | Nhận xét |
  |---|---|---|---|
  | M32673 | ESCALATE/out_of_scope | ESCALATE/no_source | Đúng nhãn, sai reason |
  | M61735 | CLARIFY | ESCALATE/personal_data | Chưa tách triệu chứng mơ hồ khỏi dữ liệu cá nhân |
  | M48190 | CLARIFY | ESCALATE/no_source | Chưa hỏi phạm vi lớp/phòng |
  | M83132 | CLARIFY | ANSWER/DOC-09 | Tự suy "điểm cộng" là XP |

## §8. Phân công & kế hoạch
- Phân công có tên:
  | Việc | Người | Ở đâu trong repo |
  |---|---|---|
  | Spec, evidence (mining 63 menu, khảo sát), `kb/` 9 DOC, mẫu ticket, nộp 5 checkpoint | **Vũ Việt Hoàng** (đội trưởng) | `spec.md`, `docs/`, `kb/` |
  | Prompt ③, retrieval ②, verify ④⑤, golden set 32 case, các lượt eval | **Nguyễn Văn Hưởng** | `codebase/engine/`, `eval/` |
  | Giao diện demo ①⑤⑥, sơ đồ flow-v2, video CP3, validation với người dùng | **Lê Chí Hùng** | `codebase/index.html` `app.js` `style.css`, `docs/flow-v2.html`, `validation/` |
  | Demo CP6: mỗi người trình bày phần có tên mình | cả nhóm | |
- Willing users: **Nguyễn Vũ Anh**, **Nguyễn Duy Phong** (khai từ CP1). Kế hoạch validation: tối 17/9 – sáng 18/9, 5 người ngoài nhóm (2 willing user + 3 bạn cùng lớp), mỗi người 3 câu tự nghĩ + 1 câu "bảo sai" trên prototype web; ghi nhật ký ai thử · task · kẹt ở đâu · quote · quyết định vào `validation/`; sửa trước demo những gì lặp ≥2 lần.
- Multi-prototype: 2 phương án luồng đã so trước khi chốt (`docs/flow-v2.html`, bảng "Đổi gì so với hai luồng cũ"). Luồng 1: AI phân loại trước, không tra nguồn, hỏi lại được 2 lần. Luồng 2: tra `kb/` trước → AI trả JSON → code kiểm nguồn. Chọn luồng 2 + thêm nhánh correction từ luồng 1, vì cost-of-error: sai XP/điểm danh là mất điểm nên phải chặn bằng code trước khi tới học viên, và canvas chốt "tối đa 1 câu hỏi lại" không thể phụ thuộc LLM nhớ.

## §9. Changelog
| Thời điểm | Đổi gì | Vì sao (trỏ về feedback/case nào) |
|---|---|---|
| 16/9 20:30 | Chốt AskOnce, canvas 4 ô, luồng CP2 (mermaid) | Mining: 63/313 câu trả lời của bot cũ là menu thừa |
| 17/9 08:30 | Luồng v2: tra `kb/` trước AI, code kiểm DOC ∈ top-3, cờ đã_hỏi_lại trong code, tách 4 reason ESCALATE | Luồng 1 không kiểm nguồn; luồng 2 gộp "không nguồn/cá nhân" làm một; spec §6 cần correction |
| 17/9 10:40 | Chốt hợp đồng `decide({question, history, askedOnce})` giữa UI và engine; chia repo theo thư mục | Để 3 người làm song song không conflict git |
| 17/9 11:30 | `out_of_scope` cũng kèm mẫu ticket; thêm reason `correction` vào mẫu ticket; `doc_ids` → `doc_id` | Spec §6 (quyết định BTC/mentor cần TA) khác flow-v2 (chit-chat không ticket) — nhóm chốt theo spec |
| 17/9 13:30 | Prompt thêm định nghĩa CLARIFY cụ thể + ví dụ M20574, M61735 | `run-openai-1`: 5/5 case CLARIFY sai, model không bao giờ chọn nhãn này |
| 17/9 14:13 | Bỏ `policyGuardrail` (regex đè kết quả model), thêm retry 429/503 | Lượt 100% là regex viết theo golden set, vi phạm "không hardcode"; `run-gemini-1` rụng 21 case vì rate-limit |
| 17/9 15:30 | Khoá quality bar ≥ 85% + Factuality fail = 0 | `run-model-1` 87,5%; 4 case sai đều lệch về phía ESCALATE, không bịa |
| CP3 → CP4 | Siết prompt CLARIFY và Structured Outputs; thêm retry 429/503; loại `policyGuardrail` | `run-model-1` đạt 87,5%; feedback yêu cầu không hard-code golden set |
| CP4 | Thử hai biến thể prompt tổng quát rồi quay lại bản `run-model-1` | `run-model-2` 75% và `run-model-3` 71,9%, đều dưới quality bar |

## Tự khai phần chưa xong (CP4)

- **Khảo sát A chưa đủ mẫu:** hiện n = 5/mục tiêu ≥20 người ngoài nhóm. Số liệu ở §1 dùng đúng n thật hiện có tại giờ chốt spec, không làm tròn/thêm để đạt mục tiêu — nếu thu thêm được trước CP5/CP6 sẽ cập nhật và ghi vào changelog, không đổi quality bar §7.
- **Dữ liệu quan sát trực tiếp bot mở rộng bị mất:** trước CP4, Hoàng đã hỏi tay bot thêm ~16 câu theo 4 lớp chỗ khó (nhóm 1 đối chiếu 9 DOC, nhóm 2 kịch bản rủi ro) và cập nhật `kb/DOC-02.md`, `kb/DOC-05.md`, `kb/DOC-08.md` với câu trả lời thật của bot, nhưng phần này **chưa kịp commit/push** và bị mất khi thao tác clone lại repo. Bằng chứng còn giữ được: 2 case gốc trong `docs/quan-sat-truc-tiep-bot-hien-tai.md`. Nếu còn thời gian trước CP5 sẽ hỏi lại bot để khôi phục, không tự bịa lại nội dung đã mất.
- **`kb/DOC-02.md`, `kb/DOC-05.md`, `kb/DOC-08.md` vẫn là nội dung minh hoạ tự soạn**, chưa được cập nhật bằng câu trả lời thật của bot (do mất dữ liệu ở trên) — không phải văn bản chính thức của BTC, đã ghi chú ngay trong từng file.
- **§3 "Sản phẩm 2" dùng chính bot của khoá làm đối chứng** thay vì một sản phẩm ngoài thứ hai, vì nhóm chưa có thời gian thử thêm một công cụ AI hỏi-đáp khác ngoài NotebookLM trước hạn chốt.
- **Chưa xác nhận đã nộp video CP3** (30 giây, quay màn hình) qua form — nộp qua form riêng nên không có bằng chứng trong repo; đội trưởng cần tự xác nhận lại trước hạn.
- **Reflection cá nhân của Vũ Việt Hoàng** (`reflection/vu-viet-hoang.md`) chưa viết — hai bạn còn lại đã có file, phần này không chặn khoá quality bar CP4 nhưng cần hoàn thành trước CP6.
