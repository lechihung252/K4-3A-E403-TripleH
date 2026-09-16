# AskOnce · Canvas 4 ô

**Mini Hackathon AI · Checkpoint 1 · Track B1**
Trợ lý Discord · hỏi bot một lần, nhận câu trả lời dùng được — không phải chọn menu 1/2/3

| | |
|---|---|
| **Lớp** | 3A |
| **Phòng** | E403 |
| **Nhóm** | TripleH |
| **Loại** | Tối ưu tính năng có sẵn (bot "Trợ lý") |
| **Dữ liệu** | `discord-pack/` + khảo sát học viên K4 |

![Canvas CP1](canvas-cp1.png)

---

## 01 · Người dùng & nỗi đau

### Học viên hỏi bot mà phải hỏi đi hỏi lại

**Job:** học viên K4 trong tuần đầu Build Phase cần biết nhanh một quy định vận hành — điểm danh, XP, daily standup, lập team — để làm đúng ngay trong ngày.

**Pain:** học viên tag bot "Trợ lý" bằng một câu hỏi đã rõ, nhưng bot trả về **danh sách 1/2/3 bắt chọn lại ngữ cảnh** hoặc trả lời không dùng được. Học viên phải gõ lại, tự đi tìm hoặc hỏi bạn — **mất 3–10 phút mỗi lần**; có người không bao giờ nhận được câu trả lời và **làm sai / lỡ việc tính vào điểm**.

> 🟢 **Không phải lỗi mọi câu hỏi:** câu hỏi dạng lệnh (`/daily-standup`, `/rank`) bot trả lời ngay dưới 1 phút. Nỗi đau nằm ở **câu hỏi viết tự nhiên**.

---

## 02 · Bằng chứng ban đầu

### Mining discord-pack + khảo sát đang thu

#### (B) Mining · 1.092 tin K4 · 12–14/09 · đếm tự động, chưa gán nhãn tay

- **63/313 (20%)** câu trả lời của bot là menu hỏi lại "Bạn muốn hỏi về…? 1. 2. 3."
- **53/61** người hỏi phải nhắn thêm trong 30 phút sau menu · **28/120** người tag bot ≥ 3 lần trong 30 phút
- Ví dụ: `M49945` `M58070` `M30724` `M00499` `M20574`

#### (A) Khảo sát · n = 5 người ngoài nhóm · mục tiêu ≥ 20 trước CP4

| Mã | Hỏi bot về | Bot phản hồi đầu tiên | Nhắn thêm | Lỡ việc |
|---|---|---|---|---|
| R01 | check điểm danh | Menu 1/2/3 | 2 lượt · 3–10' | **Có** |
| R02 | cách dùng daily-standup | Không nhớ | Không bao giờ có | **Có** |
| R03 | xem điểm cá nhân | Bảo hỏi BTC/TA | 0 · 3–10' | Không |
| R04 | `/daily-standup` | Trả lời thẳng | 0 · < 1' | Không |
| R05 | `/rank` | Trả lời thẳng | 0 · < 1' | Không |

> 🔵 **Tiêu chí xác nhận (chốt trước):** bot trả menu / không có thông tin / lạc đề **và** phải nhắn thêm ≥ 1 lượt → hiện **1/5**. **2/5** không có câu trả lời dùng được ngay, **2/5** từng lỡ việc. Chưa đủ mẫu — đang thu tiếp.

---

## 03 · Lát cắt & automation

### Một câu hỏi, một quyết định: trả lời, hỏi lại hay chuyển TA

`ANSWER` · `CLARIFY` · `ESCALATE`

**Lát cắt:** một học viên K4 · hỏi bot một câu về quy định Build Phase · AI quyết định **trả lời ngay** (câu đã rõ và có căn cứ trong thông báo chính thức), **hỏi lại đúng một câu** (thật sự thiếu thông tin), hoặc **chuyển TA** (không có căn cứ / hỏi dữ liệu cá nhân) · học viên nhận câu trả lời có dẫn nguồn trong một lượt.

> 🟣 **Conditional:** tự trả lời khi có nguồn; hỏi lại tối đa 1 câu; chuyển TA khi hỏi điểm / điểm danh cá nhân hoặc không tìm thấy nguồn.

> 🟣 **Cost-of-error:** trả lời sai điểm danh, XP, deadline → học viên mất điểm (đắt, khó sửa). Hỏi lại thừa → mất 3–10 phút, dễ bỏ cuộc — đang xảy ra ở 20% câu trả lời của bot.

---

## 04 · Người thử & phân công

### Có người thử, có người chịu trách nhiệm

**Willing users:** **Nguyễn Vũ Anh** · **Nguyễn Duy Phong** — người ngoài nhóm, đã đồng ý thử demo ngày 18/9. Mục tiêu 5 người ngoài nhóm ở CP5.

| Thành viên | Vai trò | Phần việc |
|---|---|---|
| **Vũ Việt Hoàng** | Đội trưởng · Spec + Evidence | Nộp 5 checkpoint, viết `spec.md`; thu khảo sát lên ≥ 20 người; gán nhãn tay 63 menu (hỏi lại thừa / cần thiết) + ghi phương pháp đếm |
| **Nguyễn Văn Hưởng** | Prompt + Eval | Lời gọi AI phân loại ANSWER / CLARIFY / ESCALATE; golden set ≥ 20 case từ `msg_id` thật; bảng kết quả trong `eval/` |
| **Lê Chí Hùng** | Prototype + Validation | Giao diện demo; bộ thông báo nguồn (tự dựng, ghi rõ); phiên dùng thử với willing users, quote + nhật ký trong `validation/` |

---

**Checkpoint 1 · AskOnce** · Số liệu mining là đếm tự động, sẽ kiểm lại bằng gán nhãn tay trước CP4.
Chỉ dẫn mã `M#####` / `R##`, không chép nguyên văn tin nhắn Discord.
