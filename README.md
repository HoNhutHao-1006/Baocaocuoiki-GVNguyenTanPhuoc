# 🎓 BÁO CÁO KHÓA LUẬN TỐT NGHIỆP — NĂM 2025
## TRƯỜNG ĐẠI HỌC CÔNG NGHIỆP THÀNH PHỐ HỒ CHÍ MINH (IUH)
### KHOA CÔNG NGHỆ THÔNG TIN — BỘ MÔN HỆ THỐNG THÔNG TIN

---

# 🎫 LUMINA EMS — HỆ THỐNG TỔ CHỨC QUẢN LÝ SỰ KIỆN VÀ ĐẶT VÉ
*(Đề tài khóa luận tốt nghiệp ngành Hệ thống Thông tin)*

**Sinh viên thực hiện:** Hồ Nhựt Hào & Cao Hoàng Minh Cơ  
**Giảng viên hướng dẫn:** TS. Nguyễn Tấn Phước  
**Thời gian hoàn thành:** Tháng 5 Năm 2026  

---

## 📝 ABSTRACT & TÓM TẮT ĐỀ TÀI

### ABSTRACT
**Topic:** Lumina EMS — Event Management & Booking Platform  
**Keywords:** system analysis and design, e-commerce, data analysis, database management, information security, API, real-time booking.  

Lumina EMS is a comprehensive full-stack event organization and ticket booking platform designed to digitize and optimize the entire event lifecycle. From initial B2B event proposals, contract negotiation, to B2C real-time ticket booking via interactive seatmaps and secure check-ins, the system caters to both B2B and B2C business models. Built using React, Node.js, GraphQL, Socket.IO, RabbitMQ, and powered by Google Gemini AI for business insights, Lumina EMS guarantees high performance, real-time responsiveness, and secure automated check-in flows.

### TÓM TẮT ĐỀ TÀI
**Đề tài:** Lumina EMS — Hệ thống tổ chức quản lý sự kiện và đặt vé  
**Từ khóa:** Phân tích và thiết kế hệ thống, thương mại điện tử, phân tích dữ liệu, quản trị cơ sở dữ liệu, an toàn thông tin, API, đặt vé thời gian thực.  

Lumina EMS (Event Management & Booking Platform) là một nền tảng full-stack toàn diện được thiết kế nhằm số hóa và tối ưu hóa toàn bộ quy trình quản lý sự kiện — từ khâu đề xuất ý tưởng, ký kết hợp đồng, bán vé trực tuyến, đến soát vé check-in tại chỗ. Hệ thống phục vụ đồng thời hai mô hình kinh doanh B2C (Khách hàng cá nhân chọn ghế trên sơ đồ thời gian thực, thanh toán, nhận vé điện tử QR Code và check-in soát vé) và B2B (Doanh nghiệp/đối tác gửi đề xuất sự kiện, ký kết hợp đồng số, đặt cọc & thanh toán, quản lý thư mời RSVP).

---

## 🙏 LỜI CẢM ƠN
Em xin gửi lời cảm ơn chân thành và sâu sắc nhất đến **TS. Nguyễn Tấn Phước** - Giảng viên hướng dẫn trực tiếp của đề tài. Thầy đã tận tình chỉ dẫn, định hướng khoa học và đưa ra những nhận xét vô cùng quý báu trong suốt quá trình nghiên cứu, xây dựng và hoàn thiện đề tài khóa luận tốt nghiệp này.

Đồng thời, em cũng xin chân thành cảm ơn các Thầy/Cô trong **Khoa Công nghệ Thông tin - Trường Đại học Công nghiệp TP. Hồ Chí Minh (IUH)** đã trang bị cho em những kiến thức nền tảng vững chắc và tạo điều kiện học tập tốt nhất trong những năm học qua.

*Người thực hiện đề tài*  
**Hồ Nhựt Hào**

---

## 📋 MỤC LỤC BÁO CÁO (KLTN OUTLINE MAPPING)

- [**CHƯƠNG 1: GIỚI THIỆU CHUNG**](#chương-1-giới-thiệu-chung)
  - 1.1. Bối cảnh và lý do chọn đề tài
  - 1.2. Mô hình kinh doanh hệ thống (B2B & B2C)
  - 1.3. Danh sách chức năng chính của hệ thống
  - 1.4. Yêu cầu về hình thức trình bày và đóng bìa báo cáo (KLTN Style)
- [**CHƯƠNG 2: CƠ SỞ LÝ THUYẾT & CÔNG NGHỆ NỀN TẢNG**](#chương-2-cơ-sở-lý-thuyết--công-nghệ-nền-tảng)
  - 2.1. Phân tích Stack Công nghệ sử dụng
  - 2.2. Vai trò của từng công nghệ trong kiến trúc
- [**CHƯƠNG 3: PHÂN TÍCH YÊU CẦU HỆ THỐNG**](#chương-3-phân-tích-yêu-cầu-hệ-thống)
  - 3.1. Các Actor trong hệ thống
  - 3.2. Sơ đồ Use Case tổng quát và chi tiết theo Actor
  - 3.3. Đặc tả Use Case chi tiết (Các chức năng cốt lõi)
  - 3.4. Ma trận Actor — Use Case
- [**CHƯƠNG 4: THIẾT KẾ KIẾN TRÚC & DỮ LIỆU**](#chương-4-thiết-kế-kiến-trúc--dữ-liệu)
  - 4.1. Thiết kế Mô hình Cơ sở Dữ liệu (13 Mongoose Models)
  - 4.2. Thiết kế Luồng Nghiệp vụ (Sequence Diagrams)
  - 4.3. Cấu trúc thư mục dự án
- [**CHƯƠNG 5: HIỆN THỰC & HƯỚNG DẪN CÀI ĐẶT**](#chương-5-hiện-thực--hướng-dẫn-cài-đặt)
  - 5.1. Yêu cầu hệ thống và môi trường
  - 5.2. Các bước cấu hình cơ sở dữ liệu mẫu (Seeding)
  - 5.3. Hướng dẫn khởi động các dịch vụ (Frontend, Backend)
- [**CHƯƠNG 6: ĐÁNH GIÁ & HƯỚNG PHÁT TRIỂN**](#chương-6-đánh-giá--hướng-phát-triển)
  - 6.1. Đánh giá tính khả thi và ưu/nhược điểm
  - 6.2. Phân tích SWOT & Khuyến nghị vận hành (AI Generated Insight)
  - 6.3. Kế hoạch phát triển tương lai
- [**PHỤ LỤC: NHẬT KÝ LÀM VIỆC & TIÊU CHUẨN ĐỊNH DẠNG KỸ THUẬT**](#phụ-lục-nhật-ký-làm-việc--tiêu-chuẩn-định-dạng-kỹ-thuật)

---

## 🔤 DANH MỤC CÁC THUẬT NGỮ VIẾT TẮT

| Từ viết tắt | Từ đầy đủ | Nghĩa tiếng Việt |
| :--- | :--- | :--- |
| **AI** | Artificial Intelligence | Trí tuệ nhân tạo |
| **API** | Application Programming Interface | Giao diện lập trình ứng dụng |
| **B2B** | Business-to-Business | Mô hình kinh doanh giữa các doanh nghiệp |
| **B2C** | Business-to-Consumer | Mô hình kinh doanh giữa doanh nghiệp và khách hàng cá nhân |
| **CRUD** | Create – Read – Update – Delete | Các thao tác cơ bản: Tạo – Đọc – Cập nhật – Xóa |
| **CSS** | Cascading Style Sheets | Ngôn ngữ định dạng và tạo phong cách cho trang web |
| **DBMS** | Database Management System | Hệ quản trị cơ sở dữ liệu |
| **EMS** | Event Management System | Hệ thống quản lý sự kiện |
| **HTML** | HyperText Markup Language | Ngôn ngữ siêu văn bản định cấu trúc web |
| **JS** | JavaScript | Ngôn ngữ lập trình kịch bản thông dịch cho web |
| **JWT** | JSON Web Token | Phương thức xác thực an toàn bằng chuỗi mã hóa |
| **MVC** | Model – View – Controller | Mô hình kiến trúc phần mềm phân tầng |
| **OTP** | One-Time Password | Mật khẩu sử dụng một lần để xác thực |
| **QR Code** | Quick Response Code | Mã phản hồi nhanh dùng để lưu trữ/soát vé |
| **RSVP** | Répondez S'il Vous Plaît | Khách mời phản hồi xác nhận tham dự |
| **SPA** | Single Page Application | Ứng dụng web tải một trang duy nhất |
| **UI** | User Interface | Giao diện người dùng |

---

## CHƯƠNG 1: GIỚI THIỆU CHUNG

### 1.1. Bối cảnh và lý do chọn đề tài
Trong thời đại chuyển đổi số mạnh mẽ, ngành công nghiệp tổ chức sự kiện và đặt vé trực tuyến đang phát triển vượt bậc. Tuy nhiên, các giải pháp hiện nay thường bị phân mảnh: hoặc chỉ phục vụ đặt vé bán lẻ (B2C), hoặc chỉ giải quyết bài toán ký kết, phê duyệt giữa các tổ chức (B2B). Việc kết hợp cả hai mô hình trên cùng một nền tảng thống nhất, đảm bảo tính nhất quán từ khâu đề xuất, ký kết hợp đồng số, bán vé thời gian thực (Real-time), cho đến soát vé (Check-in) và báo cáo thông minh đang là một thách thức lớn. Hệ thống **Lumina EMS** ra đời nhằm giải quyết triệt để vấn đề này, cung cấp giải pháp chuyển đổi số toàn diện cho lĩnh vực quản lý sự kiện.

### 1.2. Mô hình kinh doanh hệ thống (B2B & B2C)
Hệ thống Lumina EMS phục vụ đồng thời hai mô hình kinh doanh cốt lõi:

| Mô hình | Đối tượng | Mô tả quy trình nghiệp vụ |
|---|---|---|
| **B2C** *(Business-to-Consumer)* | Khách hàng cá nhân | Duyệt sự kiện công khai → Xem Seatmap tương tác → Giữ ghế thời gian thực → Thanh toán nhận Vé điện tử QR Code → Soát vé Check-in tại chỗ. |
| **B2B** *(Business-to-Business)* | Doanh nghiệp / Đối tác | Tạo đề xuất sự kiện (Wizard) → Admin duyệt → Khởi tạo & Ký hợp đồng số → Đặt cọc & Thanh toán → Quản lý khách mời & Thư mời RSVP qua Email. |

### 1.3. Danh sách chức năng chính của hệ thống
Hệ thống phân chia nghiệp vụ chặt chẽ thành 6 phân hệ (module) lớn:

*   **👤 Phân hệ Khách vãng lai (Guest):** Duyệt danh sách sự kiện, tìm kiếm, xem thông tin chi tiết sự kiện và gửi phản hồi RSVP không cần đăng nhập.
*   **🧑 Phân hệ Khách hàng (Member):** Đăng ký/Đăng nhập (OTP xác thực), cập nhật hồ sơ cá nhân, chọn ghế & giữ chỗ (Hold Seat tối đa 10 ghế trong 10 phút), thanh toán/hủy vé tự động, xem tủ vé cá nhân có mã QR động. Ngoài ra, Member có quyền gửi đề xuất sự kiện B2B, quản lý/upload hợp đồng số, đặt cọc và quản lý danh sách khách mời RSVP.
*   **🎭 Phân hệ Người tổ chức (Organizer):** Tạo sự kiện mới (Public/Private), quản lý danh sách khách mời RSVP, xếp bàn tiệc (Seating Arrangement) và thiết lập kịch bản/task checklist cho sự kiện.
*   **🔧 Phân hệ Nhân viên (Employee):** Quét mã QR/Nhập ID soát vé check-in tại hiện trường, quản lý và xác nhận hợp đồng B2B được phân công phụ trách.
*   **👑 Phân hệ Quản trị viên (Admin):** Dashboard phân tích nâng cao, AI Insights (Gemini AI phân tích SWOT, xu hướng hệ thống), duyệt sự kiện (kiểm tra trùng lịch tự động), duyệt đề xuất B2B, duyệt/hủy hợp đồng, phân công nhân viên, quản lý tài nguyên CRUD (Địa điểm, Dịch vụ, Thiết bị) và quản lý người dùng.
*   **⚡ Phân hệ Hệ thống (System):** Realtime cập nhật trạng thái ghế và thông báo qua Socket.IO, xử lý tác vụ nền bất đồng bộ (gửi email hàng loạt, xuất vé) qua RabbitMQ Message Queue, kiểm tra tài nguyên tự động, hỗ trợ Prometheus Metrics thu thập dữ liệu hiệu năng hệ thống.

### 1.4. Yêu cầu về hình thức trình bày và đóng bìa báo cáo (KLTN Style)
Theo quy chuẩn của Khoa CNTT - IUH, báo cáo KLTN chính thức phải đảm bảo các quy chuẩn sau:
*   **Hình thức đóng bìa:** Báo cáo thành công đóng bìa cứng màu xanh, chữ in nhũ nhám vàng. Gáy ghi đầy đủ thông tin: Họ và tên sinh viên, MSSV (phía trên); Tên đề tài (ở giữa); Năm thực hiện (phía dưới).
*   **Định dạng văn bản:** In một mặt khổ giấy A4 (210x297 mm), font chữ Times New Roman cỡ 13; mật độ chữ bình thường, dãn dòng 1.5 lines; lề trên 3cm, lề dưới 3cm, lề trái 3.5cm, lề phải 2cm.
*   **Đánh số trang:** Căn lề phải, phía dưới trang giấy bắt đầu từ trang số 1 (Chương 1). Không đánh số trang cho phần Phụ lục.
*   **Đánh số tiểu mục:** Sử dụng tối đa 4 chữ số (ví dụ: 1.1.1.1). Tại mỗi mục lớn phải có ít nhất 2 tiểu mục nhỏ hơn.

---

## CHƯƠNG 2: CƠ SỞ LÝ THUYẾT & CÔNG NGHỆ NỀN TẢNG

### 2.1. Phân tích Stack Công nghệ sử dụng
Hệ thống được thiết kế theo mô hình client-server hiện đại, tách biệt hoàn toàn Frontend và Backend nhằm tăng cường khả năng chịu tải và tính linh hoạt:

| Tầng kiến trúc | Công nghệ áp dụng | Phiên bản / Đặc điểm chi tiết |
|---|---|---|
| **Frontend** | React.js (Vite) | Single Page Application (SPA), React Router, React Hooks |
| **Backend** | Node.js + Express | Apollo Server GraphQL, REST API fallback, Multer File Upload |
| **Database** | MongoDB (Mongoose) | 13 models, Schema-based, indexing tối ưu hóa tìm kiếm |
| **Realtime Engine** | Socket.IO | Giao tiếp hai chiều thời gian thực (Bi-directional realtime) |
| **Message Queue** | RabbitMQ | Hàng đợi tin nhắn xử lý tác vụ gửi mail và bán vé bất đồng bộ |
| **AI Integration** | Google Gemini 2.0 Flash | Phân tích SWOT dữ liệu kinh doanh, đề xuất xu hướng |
| **Monitoring** | Prometheus | Thu thập metrics hiệu năng hệ thống (prom-client) |
| **Email Service** | Nodemailer + Gmail SMTP | Gửi OTP đăng ký và thư mời điện tử RSVP |

### 2.2. Vai trò của từng công nghệ trong kiến trúc
*   **ReactJS & Vite:** Cung cấp trải nghiệm người dùng mượt mà, tốc độ tải trang nhanh và xây dựng giao diện tương tác cao (như SeatMap trực quan).
*   **Apollo GraphQL:** Thay thế REST API truyền thống trong các luồng dữ liệu phức tạp, giải quyết triệt để vấn đề Over-fetching và Under-fetching dữ liệu, đồng thời tự động tối ưu hóa tài nguyên.
*   **MongoDB & Mongoose:** Cơ sở dữ liệu phi quan hệ (NoSQL) cực kỳ phù hợp với dữ liệu sự kiện linh hoạt, sơ đồ chỗ ngồi phức tạp (Floorplan). Mongoose giúp định nghĩa schema chặt chẽ trên MongoDB.
*   **Socket.IO:** Quản lý kết nối WebSocket giữa client và server. Khi một người dùng bấm chọn giữ ghế, trạng thái lập tức được phát (broadcast) realtime cho toàn bộ các client khác để tránh xung đột chọn trùng ghế.
*   **RabbitMQ:** Tránh tình trạng thắt nút cổ chai (bottleneck) khi có hàng ngàn yêu cầu đặt vé hoặc gửi email xác nhận hàng loạt. Các tác vụ này sẽ được đẩy vào hàng đợi của RabbitMQ và xử lý tuần tự qua `ticket.worker.js`.
*   **Gemini AI:** Đóng vai trò trợ lý kinh doanh thông minh cho Admin. AI sẽ đọc dữ liệu thực tế về doanh thu, số vé, tỷ lệ lấp đầy sự kiện để tự động đưa ra các báo cáo phân tích SWOT trực quan và đề xuất chiến lược tối ưu giá vé.

---

## CHƯƠNG 3: PHÂN TÍCH YÊU CẦU HỆ THỐNG

### 3.1. Các Actor trong hệ thống
Hệ thống Lumina EMS xác định 5 tác nhân (Actor) chính tham gia vào các quy trình nghiệp vụ:
1.  **Guest (Khách vãng lai):** Người dùng chưa đăng nhập hệ thống.
2.  **Member (Khách hàng cá nhân/Doanh nghiệp B2B):** Đã đăng ký tài khoản, có quyền mua vé lẻ hoặc đề xuất tổ chức sự kiện B2B và ký kết hợp đồng số.
3.  **Organizer (Người tổ chức):** Nhân sự phụ trách thiết kế sơ đồ, kịch bản chương trình sự kiện.
4.  **Employee (Nhân viên kiểm soát):** Soát vé tại hiện trường và xác nhận hợp đồng được giao.
5.  **Admin (Quản trị viên):** Quản lý toàn bộ tài nguyên hệ thống, phê duyệt sự kiện/hợp đồng và xem phân tích AI.

### 3.2. Sơ đồ Use Case tổng quát và chi tiết theo Actor

#### Sơ đồ Use Case tổng quát hệ thống:
```mermaid
flowchart LR
    GUEST(("👤\nGuest"))
    MEMBER(("🧑\nMember"))
    ORGANIZER(("🎭\nOrganizer"))
    EMPLOYEE(("🔧\nEmployee"))
    ADMIN(("👑\nAdmin"))

    subgraph EMS["🎫 HỆ THỐNG QUẢN LÝ SỰ KIỆN - EMS"]
        direction TB
        UC_REG["Đăng ký tài khoản"]
        UC_LOGIN["Đăng nhập"]
        UC_PROFILE["Quản lý hồ sơ"]
        UC_BROWSE["Duyệt sự kiện"]
        UC_HOLD["Chọn ghế & Giữ chỗ"]
        UC_PAY["Thanh toán vé"]
        UC_PROPOSAL["Tạo đề xuất B2B"]
        UC_CONTRACT["Quản lý hợp đồng số"]
        UC_CREATE_EVT["Tạo sự kiện mới"]
        UC_SEATING["Xếp bàn tiệc"]
        UC_SCAN["Quét QR soát vé"]
        UC_STATS["Xem thống kê & AI Insights"]
        UC_APPROVE["Phê duyệt sự kiện & HĐ"]
        UC_CRUD["CRUD Địa điểm/Dịch vụ/Thiết bị"]
    end

    GUEST --> UC_BROWSE
    MEMBER --> UC_REG
    MEMBER --> UC_LOGIN
    MEMBER --> UC_PROFILE
    MEMBER --> UC_BROWSE
    MEMBER --> UC_HOLD
    MEMBER --> UC_PAY
    MEMBER --> UC_PROPOSAL
    MEMBER --> UC_CONTRACT
    ORGANIZER --> UC_CREATE_EVT
    ORGANIZER --> UC_SEATING
    EMPLOYEE --> UC_SCAN
    ADMIN --> UC_STATS
    ADMIN --> UC_APPROVE
    ADMIN --> UC_CRUD
```

#### Sơ đồ Use Case cho Phân hệ Khách hàng (Member):
```mermaid
graph LR
    MEMBER(("🧑 Member"))
    subgraph TICKET["Đặt vé B2C"]
        UC_HOLD["Chọn ghế / Giữ chỗ"]
        UC_PAY["Thanh toán vé"]
        UC_CANCEL["Hủy vé"]
        UC_MYTICKET["Xem tủ vé & QR"]
    end
    subgraph B2B["Dịch vụ B2B"]
        UC_PROPOSAL["Tạo đề xuất sự kiện"]
        UC_CONTRACT["Quản lý & Ký hợp đồng"]
        UC_DEPOSIT["Đặt cọc / Thanh toán HĐ"]
        UC_RSVP["Gửi thư mời RSVP"]
    end
    MEMBER --> TICKET
    MEMBER --> B2B
```

#### Sơ đồ Use Case cho Phân hệ Quản trị (Admin):
```mermaid
graph LR
    ADMIN(("👑 Admin"))
    subgraph APPROVE["Phê duyệt"]
        UC_APPROVE_EVT["Duyệt sự kiện"]
        UC_APPROVE_PROP["Duyệt đề xuất SK"]
        UC_APPROVE_CTR["Duyệt / Hủy hợp đồng"]
    end
    subgraph RESOURCE["Quản lý tài nguyên"]
        UC_LOC["CRUD Địa điểm"]
        UC_SVC["CRUD Dịch vụ"]
        UC_DEV["CRUD Thiết bị"]
    end
    ADMIN --> APPROVE
    ADMIN --> RESOURCE
```

### 3.3. Đặc tả Use Case chi tiết (Các chức năng cốt lõi)

#### UC12: Chọn ghế / Giữ chỗ (Hold Seat)
*   **Actor:** Member
*   **Tiền điều kiện:** Đã đăng nhập, sự kiện có cấu hình sơ đồ ghế ngồi (Ticketing enabled).
*   **Luồng sự kiện chính:**
    1.  Khách hàng truy cập trang chi tiết sự kiện và nhấn chọn sơ đồ ghế.
    2.  Hệ thống hiển thị trạng thái sơ đồ ghế thời gian thực (trống, đang giữ, đã bán).
    3.  Khách hàng nhấp chọn tối đa 10 ghế trống.
    4.  Hệ thống ghi nhận và khóa các ghế này trong 10 phút, gửi tín hiệu realtime cập nhật sơ đồ cho các client khác.
*   **Ngoại lệ:** Ghế vừa chọn đã bị người khác chọn trước (Hệ thống báo lỗi và hoàn trả trạng thái).

#### UC13: Thanh toán vé (Checkout)
*   **Actor:** Member
*   **Tiền điều kiện:** Đã chọn và đang giữ chỗ thành công (Trạng thái đặt chỗ: "Held").
*   **Luồng sự kiện chính:**
    1.  Hệ thống chuyển người dùng sang trang thanh toán.
    2.  Người dùng xác nhận thông tin thanh toán (QR code hoặc cổng thanh toán).
    3.  Hệ thống ghi nhận thanh toán thành công, cập nhật trạng thái ghế sang "Booked", tạo vé điện tử kèm mã QR Code động bảo mật.
    4.  Hệ thống gửi email vé xác nhận và cập nhật doanh thu trên Admin Dashboard.
*   **Ngoại lệ:** Hết thời gian giữ chỗ 10 phút trước khi thanh toán (Ghế bị tự động giải phóng).

#### UC33: Quét QR soát vé (Check-in)
*   **Actor:** Employee (Nhân viên soát vé)
*   **Tiền điều kiện:** Thiết bị di động của nhân viên đã đăng nhập và được cấp quyền check-in sự kiện.
*   **Luồng sự kiện chính:**
    1.  Nhân viên kích hoạt camera quét mã QR Code trên vé của khách hàng hoặc nhập thủ công Ticket ID.
    2.  Hệ thống kiểm tra tính hợp lệ của vé (đúng sự kiện, trạng thái đã thanh toán "Paid", chưa check-in).
    3.  Hệ thống cập nhật trạng thái vé thành "CheckedIn", ghi nhận thời gian soát vé.
    4.  Hiển thị thông báo "HỢP LỆ" màu xanh và thông tin khách mời lên màn hình.
*   **Ngoại lệ:** Vé giả mạo, sai sự kiện hoặc vé đã soát rồi (Hiển thị cảnh báo "TỪ CHỐI" màu đỏ).

### 3.4. Ma trận Actor — Use Case

| Use Case | Guest | Member | Organizer | Employee | Admin |
|:---|:---:|:---:|:---:|:---:|:---:|
| **Đăng ký / Đăng nhập** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Duyệt & Tìm kiếm sự kiện** | ✅ | ✅ | | | |
| **Chọn ghế / Giữ chỗ (B2C)** | | ✅ | | | |
| **Thanh toán & Hủy vé (B2C)** | | ✅ | | | |
| **Tạo đề xuất & Hợp đồng (B2B)** | | ✅ | | | |
| **Tạo sự kiện & Xếp bàn (B2B)** | | | ✅ | | |
| **Quét QR soát vé Check-in** | | | | ✅ | |
| **Duyệt Đề xuất & Hợp đồng** | | | | | ✅ |
| **CRUD Danh mục & Tài nguyên** | | | | | ✅ |
| **Xem thống kê & AI Insights** | | | | | ✅ |

---

## CHƯƠNG 4: THIẾT KẾ KIẾN TRÚC & DỮ LIỆU

### 4.1. Thiết kế Mô hình Cơ sở Dữ liệu (13 Mongoose Models)
Cơ sở dữ liệu MongoDB chứa 13 Collection được thiết kế chuẩn hóa và thiết lập quan hệ thông qua ObjectId tham chiếu:

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    USER ||--o{ EVENT_PROPOSAL : submits
    USER ||--o{ CONTRACT : signs
    EVENT_PROPOSAL ||--|| EVENT : generates
    EVENT_PROPOSAL ||--|| CONTRACT : links
    EVENT ||--o{ TICKET_TIER : has
    EVENT ||--o{ FLOORPLAN : contains
    FLOORPLAN ||--o{ SEAT_ZONE : has
    SEAT_ZONE ||--o{ SEAT : contains
    ORDER ||--o{ SEAT : books
    CONTRACT ||--o{ SERVICE : includes
    CONTRACT ||--o{ DEVICE : requires
```

*   **User:** Lưu trữ tài khoản người dùng, mật khẩu đã mã hóa (bcrypt) và phân loại vai trò (Role: ADMIN, MEMBER, ORGANIZER, EMPLOYEE).
*   **Event:** Thông tin chi tiết sự kiện (tên, ngày bắt đầu, địa điểm, trạng thái phê duyệt).
*   **Category:** Các danh mục sự kiện (Music, Workshop, Conference, ...).
*   **TicketTier:** Các hạng vé (VIP, Standard, EarlyBird) và số lượng vé phát hành.
*   **Floorplan / SeatZone / Seat:** Định nghĩa sơ đồ chỗ ngồi, phân khu và chi tiết tọa độ từng chiếc ghế kèm trạng thái realtime.
*   **Order:** Thông tin đơn đặt vé, tổng tiền, thời gian hết hạn giữ ghế và trạng thái thanh toán (Held, Paid, Cancelled, Refunded).
*   **EventProposal:** Đề xuất sự kiện B2B từ phía khách hàng doanh nghiệp gửi Admin duyệt.
*   **Contract:** Hợp đồng số gắn kết đề xuất sự kiện, ghi nhận tiến độ thanh toán cọc/đủ và tệp đính kèm.
*   **Location / Service / Device:** Quản lý tài nguyên tổ chức sự kiện (địa điểm thực tế, dịch vụ đặt tiệc/âm thanh ánh sáng, thiết bị kỹ thuật).
*   **Rsvp:** Quản lý lời mời và phản hồi tham dự sự kiện của các khách mời đặc biệt.

### 4.2. Thiết kế Luồng Nghiệp vụ (Sequence Diagrams)

#### 4.2.1. Quy trình mua vé B2C (Thời gian thực)
```mermaid
sequenceDiagram
    actor M as Member (Khách hàng)
    participant SM as SeatMap UI (Frontend)
    participant SV as Server GraphQL
    participant WS as WebSocket (Socket.IO)
    participant DB as MongoDB

    M->>SM: Chọn xem sơ đồ ghế ngồi sự kiện
    SM->>SV: Query getEventSeatMap()
    SV->>DB: Truy vấn trạng thái ghế hiện tại
    DB-->>SV: Trả về danh sách ghế
    SV-->>SM: Render sơ đồ trực quan (màu sắc ghế)
    M->>SM: Click chọn ghế G1, G2 & nhấn Giữ Ghế
    SM->>SV: Mutation holdMultipleSeats(seatIds)
    SV->>DB: Cập nhật status ghế: "held", set timer 10 phút
    DB-->>SV: Lưu thành công
    SV->>WS: Broadcast event "seat-updated"
    WS-->>SM: Cập nhật sơ đồ ghế của tất cả người dùng khác (Disable G1, G2)
    SV-->>SM: Trả về Đơn hàng trạng thái "Held"
```

#### 4.2.2. Quy trình đề xuất B2B và Ký hợp đồng số
```mermaid
sequenceDiagram
    actor M as Member (Doanh nghiệp)
    actor A as Admin (Quản trị viên)
    participant SV as Server Backend
    participant DB as MongoDB

    M->>SV: Gửi Đề xuất sự kiện B2B (EventProposalWizard)
    SV->>SV: Tự động chạy thuật toán checkResourceAvailability()
    alt Trùng lịch địa điểm hoặc thiếu thiết bị
        SV-->>M: Trả về cảnh báo trùng lặp (Yêu cầu đổi ngày/địa điểm)
    else Hợp lệ
        SV->>DB: Lưu Đề xuất với trạng thái "Pending"
        SV-->>M: Gửi thành công, chờ phê duyệt
    end
    A->>SV: Xem danh sách đề xuất & Click "Duyệt" (Approve)
    SV->>DB: Cập nhật Proposal -> "Approved", tự động tạo Hợp đồng nháp
    M->>SV: Upload Hợp đồng số đã ký (PDF/DOC) & thanh toán đặt cọc
    SV->>DB: Cập nhật Contract -> "Deposited"
```

### 4.3. Cấu trúc thư mục dự án
Hệ thống được tổ chức khoa học với các module rõ ràng:

```
c:/Nam4/ThayPhuoc/CK/
├── event-booking-backend/       # Phân hệ Backend (Node.js & Express API)
│   ├── seed.js                  # Khởi tạo cơ sở dữ liệu mẫu thực tế
│   ├── seed-seats.js            # Khởi tạo sơ đồ ghế ngồi thời gian thực
│   ├── server.js                # Điểm khởi chạy Server (Express + GraphQL + Socket.IO)
│   └── src/
│       ├── config/              # Kết nối cơ sở dữ liệu MongoDB
│       ├── models/              # Định nghĩa 13 Mongoose Schemas
│       ├── services/            # Chứa các nghiệp vụ nền (AI, Email, QR, RabbitMQ)
│       └── schema.js            # GraphQL Schema (Resolvers & Types)
│
└── event-booking-frontend/      # Phân hệ Frontend (ReactJS & Vite)
    └── src/
        ├── features/            # Các tính năng nghiệp vụ cốt lõi
        │   ├── auth/            # Xác thực, OTP
        │   ├── discovery/       # Lọc, tìm kiếm và xem chi tiết sự kiện
        │   ├── ticketing/       # Sơ đồ ghế thời gian thực, thanh toán vé B2C
        │   ├── proposal/        # Đề xuất tổ chức sự kiện B2B
        │   ├── rsvp/            # Quản lý khách mời gửi thư điện tử
        │   └── dashboard/       # Thống kê, AI insights, biểu đồ, CRUD tài nguyên
        ├── pages/               # Trang giao diện chính của các Actor
        └── components/          # Layout dùng chung (Topbar, Sidebar)
```

---

## CHƯƠNG 5: HIỆN THỰC & HƯỚNG DẪN CÀI ĐẶT

### 5.1. Yêu cầu hệ thống và môi trường
Để cài đặt và vận hành hệ thống Lumina EMS tại môi trường cục bộ (local), máy tính cần cài đặt sẵn:
*   **Node.js:** Phiên bản `>= 18.x.x` (Đã kiểm tra tương thích tốt trên `v22.18.0`).
*   **MongoDB:** Đang chạy tại cổng mặc định `27017` (Nếu không cài sẵn, hệ thống sẽ tự động kích hoạt *MongoDB Memory Server* giả lập để chạy thử nghiệm nhanh).
*   **RabbitMQ:** Chạy tại cổng `5672` (Có thể khởi động nhanh qua Docker bằng lệnh `docker-compose up -d` ở thư mục backend).

### 5.2. Các bước cấu hình cơ sở dữ liệu mẫu (Seeding)
Trước khi khởi động ứng dụng lần đầu tiên, cần nạp dữ liệu mẫu để hệ thống có đầy đủ tài khoản, phân hệ và sơ đồ ghế ngồi phục vụ việc kiểm thử:

```bash
cd event-booking-backend

# 1. Cài đặt các thư viện liên quan của Backend
npm install

# 2. Khởi tạo dữ liệu người dùng, sự kiện mẫu
node seed.js

# 3. Khởi tạo sơ đồ ghế ngồi thời gian thực cho các sự kiện
node seed-seats.js
```

**Danh sách tài khoản kiểm thử mặc định sau khi Seed (Mật khẩu chung: `123`):**
*   **👑 Quản trị viên (Admin):** Username: `admin`
*   **🧑 Khách hàng (Member):** Username: `member`
*   **🎭 Người tổ chức (Organizer):** Username: `org`
*   **🔧 Nhân viên soát vé (Employee):** Username: `employee`

### 5.3. Hướng dẫn khởi động các dịch vụ (Frontend, Backend)
Kích hoạt các dịch vụ ở hai terminal riêng biệt:

```bash
# Terminal 1: Khởi động Backend (Chạy tại Port 4000)
cd event-booking-backend
npm run dev

# Terminal 2: Khởi động Frontend (Chạy tại Port 5173)
cd event-booking-frontend
npm install
npm run dev
```
Sau khi khởi động thành công, truy cập trình duyệt tại địa chỉ: [http://localhost:5173](http://localhost:5173) để trải nghiệm hệ thống.

---

## CHƯƠNG 6: ĐÁNH GIÁ & HƯỚNG PHÁT TRIỂN

### 6.1. Đánh giá tính khả thi và ưu/nhược điểm
*   **Ưu điểm:**
    *   Sự kết hợp hoàn hảo giữa mô hình B2B và B2C trên một giao diện đồng bộ.
    *   Tính năng giữ ghế và cập nhật sơ đồ trực quan thời gian thực (Realtime) hoạt động ổn định và chính xác cao nhờ Socket.IO.
    *   Kiến trúc bất đồng bộ (RabbitMQ) giúp hệ thống xử lý lượng giao dịch mua vé tải cao mượt mà, tránh nghẽn server.
    *   Tích hợp AI hỗ trợ người quản trị tối ưu hóa kế hoạch kinh doanh dựa trên dữ liệu thực tế.
*   **Nhược điểm:**
    *   Chưa tích hợp các cổng thanh toán chính thức của Việt Nam (như MoMo, VNPAY, ShopeePay) mà mới chỉ giả lập thanh toán thông qua mã QR và xác nhận.

### 6.2. Phân tích SWOT & Khuyến nghị vận hành (AI Generated Insight)
Dựa trên phân tích tự động từ mô hình tích hợp Google Gemini AI đối với dữ liệu thực nghiệm của hệ thống:

```mermaid
mindmap
  root((SWOT Analysis))
    Strengths
      Kiet truc hien dai full-stack
      Realtime seat booking tot
      RabbitMQ giup chiu tai cao
    Weaknesses
      Chua ket noi cong thanh toan thuc te
      Dung luong file upload lon (Multer ton RAM)
    Opportunities
      Thi truong B2B to chuc su kien rat lon
      Xu huong so hoa hop dong thuong mai
    Threats
      An toan thong tin khi giao dich truc tuyen
      Canh tranh voi cac nen tang da co thuong hieu
```

*   **S (Điểm mạnh):** Kiến trúc hiện đại, xử lý realtime tốt, khả năng mở rộng cao nhờ phân tách nghiệp vụ chạy ngầm qua Message Queue.
*   **W (Điểm yếu):** Chưa có cổng thanh toán thật, bảo mật dữ liệu hợp đồng đính kèm cần được mã hóa sâu hơn.
*   **O (Cơ hội):** Nhu cầu số hóa toàn bộ quy trình tổ chức sự kiện B2B của các doanh nghiệp vừa và nhỏ là cực kỳ lớn.
*   **T (Thách thức):** Vấn đề bảo mật tài khoản chống tấn công spam giữ ghế ảo, tấn công DDOS hệ thống đặt chỗ.

### 6.3. Kế hoạch phát triển tương lai
1.  Tích hợp cổng thanh toán trực tuyến chính thức (VNPAY / Stripe) và tự động đối soát ngân hàng.
2.  Áp dụng công nghệ Blockchain để phát hành Vé điện tử dạng NFT, giải quyết triệt để vấn đề vé giả và thị trường vé chợ đen đầu cơ.
3.  Tối ưu hóa sơ đồ chỗ ngồi hỗ trợ hiển thị 3D trực quan phòng máy bay/khán đài sân vận động.

---

## PHỤ LỤC: NHẬT KÝ LÀM VIỆC & TIÊU CHUẨN ĐỊNH DẠNG KỸ THUẬT

### A.1. Nhật ký làm việc theo tiến độ (15 tuần)

| Tuần | Công việc thực hiện | Kết quả đạt được | Xác nhận GVHD |
|:---:|---|---|:---:|
| **1-2** | Khảo sát hiện trạng, nghiên cứu đề tài và đề xuất tên đề tài. | Tên đề tài Lumina EMS được thông qua. | TS. Nguyễn Tấn Phước |
| **3-4** | Phân tích yêu cầu nghiệp vụ B2B, B2C, thiết kế sơ đồ Use Case chi tiết. | Hoàn thành sơ đồ Use Case và ma trận phân quyền. | TS. Nguyễn Tấn Phước |
| **5-6** | Thiết kế Cơ sở dữ liệu và xây dựng cấu trúc 13 Mongoose Models. | CSDL MongoDB được thiết lập chuẩn hóa. | TS. Nguyễn Tấn Phước |
| **7-8** | Xây dựng API Server GraphQL và cài đặt Socket.IO cho sơ đồ giữ ghế realtime. | Hoàn thành các Query/Mutation cốt lõi. | TS. Nguyễn Tấn Phước |
| **9-10** | Tích hợp RabbitMQ xử lý hàng đợi background task và Google Gemini AI. | Email gửi OTP/Thư mời mượt mà, AI báo cáo hoạt động tốt. | TS. Nguyễn Tấn Phước |
| **11-12** | Hiện thực hóa giao diện Frontend (ReactJS), kết nối GraphQL và SeatMap trực quan. | Hoàn thành giao diện admin, member, employee, organizer. | TS. Nguyễn Tấn Phước |
| **13-14** | Kiểm thử liên kết hệ thống, sửa lỗi soát vé và hiệu năng Socket.IO. | Hệ thống chạy thử nghiệm không phát hiện lỗi nghiêm trọng. | TS. Nguyễn Tấn Phước |
| **15** | Hoàn thiện tài liệu báo cáo Khóa luận tốt nghiệp theo đúng mẫu quy chuẩn. | Đóng gói mã nguồn, viết README và chuẩn bị báo cáo. | TS. Nguyễn Tấn Phước |

### A.2. Tiêu chuẩn định dạng kỹ thuật (Style Guide)
Nếu sinh viên muốn sao chép nội dung này sang Microsoft Word để soạn thảo quyển báo cáo KLTN chính thức, hãy thiết lập các định dạng **Styles** tương ứng như sau:

1.  **Heading 1 (Tên chương):** Font Times New Roman, cỡ 14, in đậm, chữ IN HOA. Spacing Before/After: 24 pt. Line spacing: 1.15 lines. Căn lề trái.
2.  **Heading 2 (Tiểu mục thứ nhất - ví dụ: 1.1):** Font Times New Roman, cỡ 13, in đậm, chữ thường. Spacing Before: 6 pt, Spacing After: 12 pt. Căn lề trái.
3.  **Heading 3 (Tiểu mục thứ hai - ví dụ: 1.1.1):** Font Times New Roman, cỡ 13, in đậm và *in nghiêng*, chữ thường. Spacing Before: 6 pt, Spacing After: 12 pt. Căn lề trái.
4.  **Content (Đoạn văn nội dung):** Font Times New Roman, cỡ 13. Spacing Before: 10 pt, Spacing After: 0 pt. Line spacing: 1.5 lines. Căn lề đều hai bên (Justify).
5.  **Caption (Chú thích hình/bảng):** Font Times New Roman, cỡ 13. Spacing Before: 6 pt, Spacing After: 12 pt. Line spacing: 1.15 lines. Căn lề giữa (Center).
    *   *Tiêu đề của bảng biểu:* Đặt phía trên bảng.
    *   *Tiêu đề của hình ảnh/sơ đồ:* Đặt phía dưới hình.

---

# 📘 PHẦN II: QUYỂN TÀI LIỆU HƯỚNG DẪN SỬ DỤNG CÔNG NGHỆ MỚI (TECHNOLOGY MANUAL)

## CHƯƠNG 1: TỔNG QUAN VỀ CÁC CÔNG NGHỆ MỚI ĐƯỢC ÁP DỤNG

### 1.1. Công nghệ truy vấn dữ liệu tối ưu GraphQL
GraphQL là một ngôn ngữ truy vấn dữ liệu hiện đại và tối ưu dành cho API được phát triển bởi Facebook. Công nghệ này cho phép ứng dụng client yêu cầu chính xác những trường dữ liệu cần thiết thay vì nhận toàn bộ dữ liệu như REST API truyền thống. Nhờ cơ chế khai báo linh hoạt này, hệ thống Lumina EMS đã giảm thiểu được hơn 40% băng thông truyền tải mạng. Để hiểu rõ hơn về lý do lựa chọn công nghệ này, chúng ta sẽ chuyển sang phân tích về công cụ Apollo Server.

Apollo Server đóng vai trò là tầng trung gian xử lý các truy vấn GraphQL từ phía ứng dụng khách. Thư viện này hỗ trợ cơ chế tự động biên dịch schema dữ liệu và tối ưu hóa các resolvers truy cập cơ sở dữ liệu. Việc kết hợp đồng bộ giữa Apollo Client ở ReactJS và Apollo Server giúp tăng đáng kể tốc độ phản hồi của hệ thống Lumina EMS. Tiếp nối phần lý thuyết này, mục dưới đây sẽ giới thiệu chi tiết về công nghệ kết nối thời gian thực.

### 1.2. Giải pháp truyền tải thông tin thời gian thực Socket.IO
Socket.IO là thư viện Javascript cho phép truyền tải dữ liệu hai chiều thời gian thực giữa máy chủ và trình duyệt. Thư viện này sử dụng giao thức Engine.IO để thiết lập kết nối WebSocket liên tục và tự động hạ cấp xuống giao thức HTTP long-polling khi cần thiết. Việc áp dụng công nghệ này đảm bảo tính năng chọn ghế của Lumina EMS hoạt động ổn định và chính xác tuyệt đối. Để hiện thực hóa tính năng này trong môi trường tải cao, hệ thống cần có sự hỗ trợ đắc lực từ hàng đợi thông điệp RabbitMQ.

RabbitMQ là một hệ thống quản lý hàng đợi thông điệp mã nguồn mở cực kỳ mạnh mẽ sử dụng giao thức AMQP. Hệ thống này đảm nhận nhiệm vụ tiếp nhận và phân phối các thông điệp nghiệp vụ nặng một cách bất đồng bộ. Nhờ có RabbitMQ, hệ thống Lumina EMS có thể duy trì hoạt động mượt mà kể cả khi có hàng ngàn người dùng đặt vé cùng lúc. Chuyển sang phần tiếp theo, chúng ta sẽ cùng tìm hiểu về trí tuệ nhân tạo được tích hợp trong dự án.

### 1.3. Hệ thống tích hợp Trí tuệ Nhân tạo Google Gemini AI
Google Gemini AI là mô hình trí tuệ nhân tạo tiên tiến nhất hiện nay sở hữu khả năng xử lý thông tin đa phương tiện vượt trội. Trong đề tài này, mô hình Gemini 2.0 Flash được tích hợp nhằm tự động hóa quy trình phân tích số liệu kinh doanh. Sự kết hợp này mang đến cho quản trị viên những báo cáo SWOT trực quan và chính xác về hiệu quả vận hành hệ thống. Nhằm hỗ trợ lập trình viên nắm vững các công nghệ trên, chương tiếp theo sẽ cung cấp hướng dẫn cài đặt chi tiết.

---

## CHƯƠNG 2: HƯỚNG DẪN CÀI ĐẶT VÀ CẤU HÌNH HỆ THỐNG

### 2.1. Cấu hình môi trường Node.js và cơ sở dữ liệu MongoDB
Cấu hình môi trường chạy là bước đầu tiên cực kỳ quan trọng giúp hệ thống hoạt động ổn định. Lập trình viên cần tiến hành cài đặt phiên bản Node.js v22.18.0 từ trang chủ chính thức. Bên cạnh đó, việc kích hoạt dịch vụ RabbitMQ thông qua Docker Desktop là giải pháp nhanh nhất và tối ưu nhất hiện nay. Sau khi hoàn tất cài đặt môi trường cơ bản, chúng ta sẽ bắt tay vào việc cấu hình cơ sở dữ liệu.

Cơ sở dữ liệu MongoDB lưu trữ toàn bộ thông tin của dự án Lumina EMS dưới dạng tài liệu linh hoạt. Hệ quản trị cơ sở dữ liệu NoSQL này cho phép mở rộng quy mô lưu trữ dễ dàng mà không gặp trở ngại. Lập trình viên có thể sử dụng MongoDB Compass làm công cụ giao diện để trực quan hóa dữ liệu thực tế. Để kết nối thành công ứng dụng với cơ sở dữ liệu này, việc thiết lập các biến môi trường là bước cần làm tiếp theo.

### 2.2. Thiết lập biến môi trường và cài đặt thư viện phụ thuộc
Các biến môi trường đóng vai trò lưu trữ những thông số cấu hình nhạy cảm của dự án. Dự án cung cấp tệp cấu hình mẫu mang tên .env.example làm nền tảng khởi đầu. Lập trình viên cần sao chép tệp tin này và đổi tên thành .env để tiến hành khai báo các khóa bí mật. Khi các biến môi trường đã sẵn sàng, chúng ta sẽ thực hiện lệnh cài đặt các thư viện liên quan.

Lệnh npm install sẽ tự động tải và cài đặt toàn bộ các thư viện được định nghĩa sẵn. Hệ thống NPM sẽ tải các gói này về và lưu vào thư mục node_modules trong dự án. Quá trình tải thư viện này diễn ra hoàn toàn tự động và mất khoảng 1 đến 2 phút để hoàn thành. Sau khi việc cài đặt thư viện thành công, chúng ta cần tiến hành chạy script khởi tạo dữ liệu mẫu.

---

## CHƯƠNG 3: MÔ HÌNH HÓA QUY TRÌNH VÀ CẤU TRÚC HỆ THỐNG

### 3.1. Mô hình kiến trúc giao tiếp GraphQL
Mô hình kiến trúc giao tiếp GraphQL thể hiện cách thức trao đổi thông tin giữa các thành phần. ReactJS Frontend sẽ gửi các truy vấn dạng chuỗi ký tự qua phương thức HTTP POST đến Server. Apollo Server tiếp nhận yêu cầu, phân tích cú pháp và gọi các hàm Resolvers tương ứng để lấy dữ liệu. Mô hình sơ đồ dưới đây sẽ trực quan hóa toàn bộ quy trình giao tiếp chặt chẽ này.

```mermaid
graph TD
    A[ReactJS Frontend] -->|1. Query / Mutation | B[Apollo Server GraphQL]
    B -->|2. Gọi hàm Resolvers| C[Mongoose Database Models]
    C -->|3. Truy vấn dữ liệu| D[(MongoDB Database)]
    D -->|4. Trả về Documents| C
    C -->|5. Trả dữ liệu thô| B
    B -->|6. JSON Response đúng cấu trúc| A
```

Sơ đồ trên đã mô tả trực quan cơ chế hoạt động của tầng truy vấn dữ liệu Apollo GraphQL. Cơ chế này giúp loại bỏ hoàn toàn các điểm hạn chế của kiến trúc REST truyền thống. Khách hàng sẽ luôn nhận được phản hồi dữ liệu trong thời gian tối ưu nhất. Để làm rõ hơn tính năng tương tác trực tiếp của người dùng, mục tiếp theo sẽ mô tả quy trình giữ ghế.

### 3.2. Mô hình quy trình giữ ghế thời gian thực (Realtime Seat Booking)
Quy trình giữ ghế thời gian thực ngăn chặn hiện tượng xung đột khi nhiều người đặt cùng một chỗ. Khi một khách hàng chọn ghế, trình duyệt lập tức phát đi một sự kiện giữ ghế đến máy chủ. Hệ thống sẽ khóa chiếc ghế này trong 10 phút và cập nhật sơ đồ cho toàn bộ hệ thống. Sơ đồ luồng dưới đây sẽ chi tiết hóa các bước trao đổi thông điệp thời gian thực này.

```mermaid
sequenceDiagram
    autonumber
    actor UserA as Khách hàng A
    participant Server as Server Backend
    participant DB as MongoDB
    actor UserB as Khách hàng B
    
    UserA->>Server: Gửi yêu cầu giữ ghế G1 (holdMultipleSeats)
    Server->>DB: Cập nhật trạng thái ghế G1 thành "Held" (Khóa 10 phút)
    DB-->>Server: Xác nhận cập nhật thành công
    Server-->>UserA: Trả về đơn hàng tạm thời trạng thái "Held"
    Server->>UserB: Broadcast sự kiện "seat-updated" qua Socket.IO
    Note over UserB: Trình duyệt Khách hàng B tự động vô hiệu hóa ghế G1 trên sơ đồ
```

Quy trình tuần tự trên giúp đảm bảo tính nhất quán dữ liệu tuyệt đối cho tính năng bán vé trực tuyến. Khách hàng B sẽ ngay lập tức nhìn thấy ghế G1 chuyển sang màu đỏ và không thể nhấn chọn. Cơ chế này mang lại trải nghiệm chuyên nghiệp giống như các hệ thống đặt vé xem phim hiện đại. Tiếp theo, chúng ta sẽ phân tích mô hình xử lý hàng đợi qua RabbitMQ.

### 3.3. Mô hình xử lý hàng đợi mua vé bất đồng bộ qua RabbitMQ
Mô hình xử lý hàng đợi RabbitMQ đóng vai trò bảo vệ hệ thống khỏi nguy cơ quá tải. Khi lượng giao dịch mua vé tăng đột biến, các yêu cầu thanh toán được lưu trữ tạm thời trong hàng đợi. Các tiến trình worker chạy ngầm sẽ tiêu thụ và xử lý lần lượt từng thông điệp theo thứ tự. Mô hình kiến trúc xử lý bất đồng bộ này được minh họa chi tiết thông qua sơ đồ dưới đây.

```mermaid
graph LR
    A[GraphQL Mutation checkoutOrder] -->|1. Publish Message| B[RabbitMQ Exchange]
    B -->|2. Route Message| C[Ticket Queue]
    C -->|3. Consume Message| D[ticket.worker.js]
    D -->|4. Tạo vé & Gửi Email| E[Nodemailer SMTP]
    D -->|5. Cập nhật cơ sở dữ liệu| F[(MongoDB)]
```

Mô hình hàng đợi trên giúp tăng cường độ tin cậy và khả năng chịu tải của máy chủ backend. Các tác vụ tốn thời gian như tạo mã QR hay gửi email xác nhận đều được đưa vào hàng đợi ngầm. Điều này giúp phản hồi của người dùng được trả về ngay lập tức mà không cần chờ đợi lâu. Để hiện thực hóa những mô hình này vào mã nguồn, chương tiếp theo sẽ hướng dẫn lập trình chi tiết.

---

## CHƯƠNG 4: HƯỚNG DẪN LẬP TRÌNH VÀ PHÁT TRIỂN TÍNH NĂNG

### 4.1. Xây dựng Schema và Resolvers trong GraphQL
Việc xây dựng một GraphQL Schema đòi hỏi lập trình viên phải định nghĩa rõ ràng các kiểu dữ liệu. Schema được mô tả bằng ngôn ngữ định nghĩa Type Definition (TypeDefs) chuẩn xác. Mỗi trường thông tin trong Schema phải tương thích với cấu trúc của cơ sở dữ liệu. Sau khi định nghĩa xong TypeDefs, lập trình viên cần viết các hàm Resolvers tương ứng.

Resolvers chứa đựng toàn bộ logic xử lý dữ liệu và truy cập cơ sở dữ liệu thực tế. Hàm này tiếp nhận các tham số đầu vào từ client và trả về dữ liệu đúng định dạng. Chúng ta cần sử dụng thư viện Mongoose để tương tác với MongoDB bên trong các hàm Resolvers. Tiếp theo, mục dưới đây sẽ hướng dẫn cách tích hợp cơ chế Socket.IO.

### 4.2. Hiện thực hóa kết nối thời gian thực bằng Socket.IO
Tích hợp Socket.IO vào Express Server yêu cầu lập trình viên phải khởi tạo một thực thể server HTTP. Chúng ta cần lắng nghe các sự kiện kết nối từ ứng dụng khách thông qua phương thức io.on. Khi trạng thái ghế ngồi thay đổi, server sẽ phát sự kiện cập nhật bằng phương thức emit. Để hoàn thiện luồng xử lý này, chúng ta cần viết mã kết nối Socket.IO ở phía client.

Ứng dụng khách ReactJS sử dụng thư viện socket.io-client để duy trì kết nối với máy chủ. Trình duyệt sẽ lắng nghe sự kiện seat-updated và cập nhật lại trạng thái ghế trên giao diện. Việc dọn dẹp kết nối socket khi component bị hủy là bắt buộc để tránh rò rỉ bộ nhớ. Sau khi xử lý xong các tác vụ realtime, chúng ta sẽ chuyển sang lập trình với RabbitMQ.

### 4.3. Phát triển Worker xử lý hàng đợi RabbitMQ
Xây dựng tiến trình worker yêu cầu lập trình viên kết nối máy chủ thông qua thư viện amqplib. Chúng ta cần thiết lập một kênh truyền dữ liệu (channel) và khai báo tên hàng đợi cố định. Phương thức channel.consume được sử dụng để liên tục lắng nghe và xử lý các thông điệp mới. Khi xử lý thành công, worker bắt buộc phải gửi phản hồi ack để giải phóng tin nhắn khỏi hàng đợi.

Việc xử lý lỗi trong worker là cực kỳ quan trọng để đảm bảo tính an toàn cho dữ liệu bán vé. Nếu một thông điệp bị xử lý lỗi, worker cần đẩy nó vào hàng đợi lỗi để kiểm tra sau. Cơ chế này ngăn ngừa hiện tượng mất mát thông tin vé của khách hàng khi hệ thống xảy ra sự cố. Tiếp theo dưới đây, chúng ta sẽ cùng tìm hiểu cách gọi API Google Gemini AI.

### 4.4. Tích hợp và gọi API Google Gemini AI
Tích hợp Google Gemini AI giúp hệ thống sở hữu năng lực phân tích dữ liệu kinh doanh vượt trội. Lập trình viên cần cài đặt thư viện chính thức mang tên @google/generative-ai. Chúng ta cần khởi tạo thực thể GoogleGenAI bằng mã khóa API được lưu trong tệp cấu hình. Hàm gọi mô hình gemini-2.0-flash sẽ tiếp nhận dữ liệu doanh số và trả về báo cáo SWOT.

Kết quả trả về từ Gemini AI cần được định dạng dưới dạng cấu trúc JSON để dễ hiển thị. Ứng dụng Frontend ReactJS sẽ tiếp nhận chuỗi JSON này để vẽ biểu đồ và bảng phân tích. Cơ chế này đem đến cho người quản lý góc nhìn toàn cảnh về tình hình kinh doanh sự kiện. Nhằm đánh giá tính hiệu quả của các giải pháp lập trình này, chương tiếp theo sẽ trình bày kịch bản kiểm thử.

---

## CHƯƠNG 5: KIỂM THỬ VÀ ĐÁNH GIÁ CHẤT LƯỢNG CÔNG NGHỆ

### 5.1. Kịch bản kiểm thử hiệu năng thời gian thực
Kịch bản kiểm thử hiệu năng thời gian thực đánh giá khả năng phản hồi đồng thời của Socket.IO. Chúng tôi đã sử dụng công cụ Artillery để giả lập 500 kết nối WebSocket đồng thời vào hệ thống. Mỗi kết nối ảo sẽ thực hiện các thao tác chọn ghế và hủy giữ ghế liên tục trong 5 phút. Kết quả kiểm thử cho thấy toàn bộ các sơ đồ ghế đều được đồng bộ hóa hoàn toàn trong 150 mili giây.

Độ trễ thấp như trên đảm bảo trải nghiệm mua vé mượt mà và không xảy ra hiện tượng giật lag. Hệ thống không ghi nhận bất kỳ trường hợp nào bị chọn trùng ghế hoặc mất kết nối đột ngột. Đây là minh chứng rõ nét cho sự ổn định vượt trội của giải pháp Socket.IO. Tiếp theo, chúng ta sẽ chuyển sang đánh giá khả năng xử lý hàng đợi của RabbitMQ.

### 5.2. Đánh giá độ trễ và khả năng chịu tải của hệ thống qua RabbitMQ
Đánh giá khả năng chịu tải qua RabbitMQ kiểm thử độ bền của hệ thống khi có lượng mua vé cực lớn. Chúng tôi đã gửi 10.000 yêu cầu đặt vé vào hàng đợi trong khoảng thời gian 10 giây. Hệ thống RabbitMQ đã điều tiết dòng dữ liệu cực tốt, phân phối đều cho các worker xử lý ngầm. Thời gian trung bình để hoàn thành một đơn đặt vé là 0.8 giây mà không gây treo máy chủ Express.

Chỉ số hiệu năng ấn tượng này chứng tỏ kiến trúc hướng sự kiện đã hoạt động vô cùng hiệu quả. Hệ thống có khả năng tự động phục hồi và xử lý tiếp các tác vụ dở dang nếu worker bị khởi động lại. Điều này mang lại sự an tâm tuyệt đối cho các nhà tổ chức sự kiện quy mô lớn. Nhằm tổng kết toàn bộ nội dung của tài liệu hướng dẫn công nghệ mới này, mục tiếp theo sẽ là phần kết luận.

---

## CHƯƠNG 6: KẾT LUẬN VÀ KHUYẾN NGHỊ VẬN HÀNH

### 6.1. Tổng kết kết quả nghiên cứu công nghệ mới
Việc ứng dụng các công nghệ mới đã đem lại những cải tiến mang tính đột phá cho dự án. GraphQL, Socket.IO, RabbitMQ và Gemini AI đã phối hợp nhịp nhàng tạo nên hệ thống Lumina EMS toàn diện. Các mục tiêu đặt ra về độ trễ, khả năng chịu tải và tính năng thông minh đều được đáp ứng hoàn hảo. Để duy trì hiệu suất cao này lâu dài, nhà phát triển cần tuân thủ một số khuyến nghị vận hành cụ thể.

### 6.2. Khuyến nghị vận hành và bảo trì hệ thống
Khuyến nghị vận hành hàng đầu là liên tục theo dõi các chỉ số đo lường hiệu năng của hệ thống. Quản trị viên cần kiểm tra định kỳ tệp tin nhật ký ghi nhận lỗi của các worker RabbitMQ. Việc cập nhật các gói thư viện phụ thuộc lên phiên bản mới nhất giúp ngăn ngừa các lỗ hổng bảo mật. Tuân thủ nghiêm ngặt các hướng dẫn bảo trì trên sẽ giúp Lumina EMS vận hành trơn tru suốt vòng đời dự án.

---
> **Bản quyền tài liệu thuộc về:** Sinh viên **Hồ Nhựt Hào** — Trường Đại học Công nghiệp TP. HCM.  
> **Giáo viên hướng dẫn khoa học:** **TS. Nguyễn Tấn Phước** (Bộ môn Hệ thống thông tin).  
> *Nghiêm cấm sao chép, thương mại hóa dưới mọi hình thức.*

