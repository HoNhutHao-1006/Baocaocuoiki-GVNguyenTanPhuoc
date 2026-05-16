# 🎫 HỆ THỐNG QUẢN LÝ SỰ KIỆN VÀ ĐẶT VÉ (EMS)

## 1. Giới thiệu tổng quan (System Overview)

**Hệ thống Quản lý Sự kiện & Đặt vé (Event Management & Booking Platform - EMS)** là một nền tảng toàn diện (full-stack) được thiết kế chuyên sâu nhằm số hóa và tối ưu hóa quy trình quản lý sự kiện. Hệ thống đáp ứng đồng thời hai mô hình kinh doanh cốt lõi:
- **B2C (Business-to-Consumer):** Cung cấp trải nghiệm mua vé trực tuyến mượt mà cho khách hàng cá nhân. Bao gồm duyệt sự kiện, chọn ghế qua sơ đồ tương tác thực tế (Interactive Seatmap), thanh toán, nhận vé điện tử (QR Code) và quản lý tủ vé cá nhân.
- **B2B (Business-to-Business):** Cung cấp giải pháp cho khách hàng doanh nghiệp hoặc cá nhân có nhu cầu thuê dịch vụ tổ chức sự kiện trọn gói. Bao gồm quy trình tạo đề xuất sự kiện (Proposal), ký kết hợp đồng số, quản lý thanh toán/đặt cọc, đến việc theo dõi tiến độ tổ chức và quản lý danh sách khách mời (RSVP).

**Các tính năng nổi bật của hệ thống:**
1. **Quản lý linh hoạt đa đối tượng:** Phân quyền chặt chẽ với 5 nhóm người dùng (Guest, Member, Organizer, Employee, Admin) với các dashboard chuyên biệt.
2. **Sơ đồ ghế ngồi trực quan:** Tích hợp Seatmap tương tác cho phép chọn/giữ chỗ realtime và khóa ghế để tránh trùng lặp khi đặt vé.
3. **Quản lý hợp đồng & Đề xuất (B2B):** Tự động hóa luồng phê duyệt từ lúc khách hàng gửi yêu cầu đến lúc chốt hợp đồng và tổ chức.
4. **Kiểm soát ra vào thông minh:** Ứng dụng quét mã QR cho phép nhân viên (Employee) check-in nhanh chóng tại sự kiện.
5. **Real-time & Hiệu năng cao:** Sử dụng Socket.IO và RabbitMQ để xử lý luồng dữ liệu thời gian thực (realtime notification, giữ chỗ) và các tác vụ nặng chạy nền.

**Công nghệ sử dụng (Tech Stack):**
- **Frontend:** React.js (Vite), TailwindCSS, UI Components hiện đại.
- **Backend:** Node.js, Express, GraphQL (Apollo Server).
- **Database:** MongoDB (Mongoose) - thiết kế schema phức tạp hỗ trợ nhiều luồng nghiệp vụ.
- **Message Broker & Realtime:** RabbitMQ, Socket.IO.

---

## 2. Các Actor trong hệ thống

| Actor | Mô tả |
|-------|-------|
| **Khách (Guest)** | Người dùng chưa đăng nhập, có thể duyệt sự kiện và RSVP |
| **Member (Khách hàng)** | Người dùng đã đăng ký, mua vé, tạo đề xuất sự kiện, quản lý hợp đồng & thư mời |
| **Organizer (Tổ chức)** | Nhân viên tổ chức sự kiện, quản lý RSVP, sơ đồ chỗ ngồi |
| **Employee (Nhân viên)** | Nhân viên soát vé, quản lý hợp đồng được phân công |
| **Admin (Quản trị)** | Quản trị viên toàn quyền: duyệt sự kiện, hợp đồng, nhân sự, tài nguyên |

---

## 3. Use Case Diagram — Tổng quát hệ thống

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
        UC_LOGOUT["Đăng xuất"]
        UC_VERIFY["Xác thực Email OTP"]
        UC_PROFILE["Quản lý hồ sơ cá nhân"]

        UC_BROWSE["Duyệt sự kiện"]
        UC_SEARCH["Tìm kiếm sự kiện"]
        UC_DETAIL["Xem chi tiết sự kiện"]
        UC_SEATMAP["Xem sơ đồ chỗ ngồi"]

        UC_HOLD["Chọn ghế & Giữ chỗ"]
        UC_PAY["Thanh toán vé"]
        UC_CANCEL["Hủy vé"]
        UC_MYTICKET["Xem tủ vé & QR Code"]
        UC_RSVP["Gửi phản hồi RSVP"]

        UC_PROPOSAL["Tạo đề xuất sự kiện"]
        UC_TRACK["Theo dõi đề xuất"]
        UC_CONTRACT["Quản lý hợp đồng"]
        UC_DEPOSIT["Đặt cọc / Thanh toán HĐ"]
        UC_INVITE["Quản lý thư mời & RSVP"]

        UC_CREATE_EVT["Tạo sự kiện mới"]
        UC_GUEST_MGR["Quản lý khách mời"]
        UC_SEATING["Xếp bàn tiệc"]
        UC_RUNDOWN["Kịch bản & Task"]

        UC_SCAN["Quét QR soát vé"]
        UC_MY_CONTRACT["Xem HĐ được phân công"]

        UC_STATS["Xem thống kê báo cáo"]
        UC_APPROVE_EVT["Duyệt sự kiện"]
        UC_APPROVE_PROP["Duyệt đề xuất sự kiện"]
        UC_APPROVE_CTR["Duyệt / Hủy hợp đồng"]
        UC_LOC["Quản lý địa điểm"]
        UC_SVC["Quản lý dịch vụ"]
        UC_DEV["Quản lý thiết bị"]
        UC_STAFF["Quản lý nhân sự"]
        UC_MEMBERS["Quản lý khách hàng"]
        UC_LOCK["Khóa / Mở khóa tài khoản"]
    end

    GUEST --> UC_BROWSE
    GUEST --> UC_SEARCH
    GUEST --> UC_DETAIL
    GUEST --> UC_RSVP

    MEMBER --> UC_REG
    MEMBER --> UC_LOGIN
    MEMBER --> UC_LOGOUT
    MEMBER --> UC_VERIFY
    MEMBER --> UC_PROFILE
    MEMBER --> UC_BROWSE
    MEMBER --> UC_SEARCH
    MEMBER --> UC_DETAIL
    MEMBER --> UC_SEATMAP
    MEMBER --> UC_HOLD
    MEMBER --> UC_PAY
    MEMBER --> UC_CANCEL
    MEMBER --> UC_MYTICKET
    MEMBER --> UC_PROPOSAL
    MEMBER --> UC_TRACK
    MEMBER --> UC_CONTRACT
    MEMBER --> UC_DEPOSIT
    MEMBER --> UC_INVITE

    ORGANIZER --> UC_LOGIN
    ORGANIZER --> UC_LOGOUT
    ORGANIZER --> UC_CREATE_EVT
    ORGANIZER --> UC_GUEST_MGR
    ORGANIZER --> UC_SEATING
    ORGANIZER --> UC_RUNDOWN

    EMPLOYEE --> UC_LOGIN
    EMPLOYEE --> UC_LOGOUT
    EMPLOYEE --> UC_PROFILE
    EMPLOYEE --> UC_SCAN
    EMPLOYEE --> UC_MY_CONTRACT

    ADMIN --> UC_LOGIN
    ADMIN --> UC_LOGOUT
    ADMIN --> UC_STATS
    ADMIN --> UC_APPROVE_EVT
    ADMIN --> UC_APPROVE_PROP
    ADMIN --> UC_APPROVE_CTR
    ADMIN --> UC_LOC
    ADMIN --> UC_SVC
    ADMIN --> UC_DEV
    ADMIN --> UC_STAFF
    ADMIN --> UC_MEMBERS
    ADMIN --> UC_LOCK
```

---

## 4. Use Case Diagram — Theo từng Actor

### 4.1. Guest (Khách vãng lai)

```mermaid
graph LR
    GUEST(("👤 Guest"))
    UC8["UC8: Duyệt sự kiện công khai"]
    UC9["UC9: Tìm kiếm sự kiện"]
    UC10["UC10: Xem chi tiết sự kiện"]
    UC28["UC28: Gửi phản hồi RSVP"]

    GUEST --> UC8
    GUEST --> UC9
    GUEST --> UC10
    GUEST --> UC28
```

### 4.2. Member (Khách hàng đã đăng ký)

```mermaid
graph LR
    MEMBER(("🧑 Member"))

    subgraph AUTH["Xác thực"]
        UC1["Đăng ký"]
        UC2["Đăng nhập"]
        UC3["Xác thực Email"]
        UC4["Đăng xuất"]
    end

    subgraph PROFILE["Hồ sơ"]
        UC5["Cập nhật hồ sơ"]
        UC6["Đổi mật khẩu"]
        UC7["Upload Avatar"]
    end

    subgraph TICKET["Đặt vé B2C"]
        UC8["Duyệt & Tìm sự kiện"]
        UC11["Xem sơ đồ chỗ ngồi"]
        UC12["Chọn ghế / Giữ chỗ"]
        UC13["Thanh toán vé"]
        UC14["Hủy vé"]
        UC15["Xem tủ vé & QR"]
    end

    subgraph B2B["Dịch vụ B2B"]
        UC16["Tạo đề xuất sự kiện"]
        UC17["Theo dõi đề xuất"]
        UC19["Tạo hợp đồng"]
        UC20["Upload file HĐ"]
        UC21["Đặt cọc / Thanh toán HĐ"]
    end

    subgraph INVITE["Thư mời"]
        UC23["Thêm khách mời"]
        UC24["Gửi thư mời Email"]
        UC25["Gửi tất cả"]
        UC26["Xóa khách mời"]
        UC27["Theo dõi RSVP"]
    end

    MEMBER --> AUTH
    MEMBER --> PROFILE
    MEMBER --> TICKET
    MEMBER --> B2B
    MEMBER --> INVITE
```

### 4.3. Organizer (Người tổ chức)

```mermaid
graph LR
    ORGANIZER(("🎭 Organizer"))
    UC29["Tạo sự kiện mới"]
    UC30["Quản lý khách mời RSVP"]
    UC31["Xếp bàn tiệc Seating"]
    UC32["Kịch bản & Task Checklist"]
    UC_DASH["Xem thống kê chung"]

    ORGANIZER --> UC_DASH
    ORGANIZER --> UC29
    ORGANIZER --> UC30
    ORGANIZER --> UC31
    ORGANIZER --> UC32
```

### 4.4. Employee (Nhân viên)

```mermaid
graph LR
    EMPLOYEE(("🔧 Employee"))
    UC33["Quét QR soát vé Check-in"]
    UC34["Xem hợp đồng được phân công"]
    UC5["Cập nhật thông tin cá nhân"]
    UC6["Đổi mật khẩu"]

    EMPLOYEE --> UC33
    EMPLOYEE --> UC34
    EMPLOYEE --> UC5
    EMPLOYEE --> UC6
```

### 4.5. Admin (Quản trị viên)

```mermaid
graph LR
    ADMIN(("👑 Admin"))

    subgraph STATS["Báo cáo"]
        UC35["Thống kê doanh thu, vé, sự kiện"]
    end

    subgraph APPROVE["Phê duyệt"]
        UC36["Duyệt sự kiện"]
        UC37["Duyệt đề xuất SK"]
        UC38["Duyệt / Hủy hợp đồng"]
        UC45["Kiểm tra trùng lịch"]
    end

    subgraph RESOURCE["Tài nguyên"]
        UC39["CRUD Địa điểm"]
        UC40["CRUD Dịch vụ"]
        UC41["CRUD Thiết bị"]
    end

    subgraph USER_MGMT["Quản lý người dùng"]
        UC42["Quản lý nhân sự nội bộ"]
        UC43["Quản lý khách hàng Member"]
        UC44["Khóa / Mở khóa tài khoản"]
    end

    ADMIN --> STATS
    ADMIN --> APPROVE
    ADMIN --> RESOURCE
    ADMIN --> USER_MGMT
```

---

## 5. Đặc tả Use Case chi tiết

### UC1: Đăng ký tài khoản
| Thuộc tính | Mô tả |
|---|---|
| **Actor** | Guest → Member |
| **Mô tả** | Người dùng tạo tài khoản mới với username, password, email |
| **Tiền điều kiện** | Chưa có tài khoản |
| **Luồng chính** | 1. Nhập thông tin → 2. Xác thực email OTP → 3. Tạo tài khoản thành công |
| **Ngoại lệ** | Username đã tồn tại, Email đã được sử dụng |

### UC2: Đăng nhập
| Thuộc tính | Mô tả |
|---|---|
| **Actor** | Member, Organizer, Employee, Admin |
| **Mô tả** | Xác thực bằng username/password, nhận JWT token |
| **Luồng chính** | 1. Nhập username + password → 2. Hệ thống xác thực → 3. Trả về token + chuyển hướng theo role |
| **Ngoại lệ** | Sai tài khoản hoặc mật khẩu |

### UC8: Duyệt sự kiện công khai
| Thuộc tính | Mô tả |
|---|---|
| **Actor** | Guest, Member |
| **Mô tả** | Xem danh sách sự kiện đã được duyệt trên Discovery Hub |
| **Luồng chính** | 1. Truy cập trang chủ → 2. Xem danh sách sự kiện theo danh mục → 3. Lọc / tìm kiếm |

### UC12: Chọn ghế / Giữ chỗ (Hold Seat)
| Thuộc tính | Mô tả |
|---|---|
| **Actor** | Member |
| **Tiền điều kiện** | Đã đăng nhập, sự kiện có ticketing |
| **Luồng chính** | 1. Chọn sự kiện → 2. Xem sơ đồ zone/ghế → 3. Chọn 1-10 ghế → 4. Hệ thống giữ chỗ 10 phút |
| **Ngoại lệ** | Ghế không khả dụng, vượt quá 10 ghế |
| **Hậu điều kiện** | Order trạng thái "Held", ghế chuyển "held" |

### UC13: Thanh toán vé (Checkout)
| Thuộc tính | Mô tả |
|---|---|
| **Actor** | Member |
| **Tiền điều kiện** | Có order trạng thái "Held" |
| **Luồng chính** | 1. Xem tủ vé → 2. Nhấn "Thanh toán" → 3. Hệ thống tạo QR Code → 4. Ghế chuyển "booked" |
| **Hậu điều kiện** | Order "Paid", QR Code được tạo, realtime notification |

### UC16: Tạo đề xuất sự kiện
| Thuộc tính | Mô tả |
|---|---|
| **Actor** | Member |
| **Mô tả** | Gửi yêu cầu tổ chức sự kiện (B2B) cho Admin duyệt |
| **Luồng chính** | 1. Nhập: tên, mô tả, loại, ngày, địa điểm, ngân sách → 2. Kiểm tra trùng lịch → 3. Gửi cho Admin |
| **Ngoại lệ** | Trùng lịch với sự kiện đã duyệt |

### UC19: Tạo hợp đồng
| Thuộc tính | Mô tả |
|---|---|
| **Actor** | Member |
| **Tiền điều kiện** | Có đề xuất đã được duyệt (tùy chọn) |
| **Luồng chính** | 1. Chọn dự án liên kết → 2. Nhập chi tiết + giá trị → 3. Upload file PDF/DOC → 4. Tạo hợp đồng |

### UC33: Quét QR soát vé
| Thuộc tính | Mô tả |
|---|---|
| **Actor** | Employee |
| **Mô tả** | Xác thực vé bằng mã QR hoặc Ticket ID tại cổng sự kiện |
| **Luồng chính** | 1. Nhập mã vé → 2. Hệ thống kiểm tra trạng thái → 3. Check-in thành công |
| **Ngoại lệ** | Vé không tồn tại, đã sử dụng, chưa thanh toán |

### UC36: Duyệt sự kiện
| Thuộc tính | Mô tả |
|---|---|
| **Actor** | Admin |
| **Mô tả** | Phê duyệt sự kiện do Organizer tạo |
| **Luồng chính** | 1. Xem danh sách sự kiện → 2. Kiểm tra trùng lịch tự động → 3. Duyệt / Từ chối |
| **Ngoại lệ** | Trùng lịch → không cho duyệt |

### UC37: Duyệt đề xuất sự kiện
| Thuộc tính | Mô tả |
|---|---|
| **Actor** | Admin |
| **Luồng chính** | 1. Xem danh sách đề xuất từ Member → 2. Duyệt hoặc Từ chối kèm ghi chú → 3. Realtime notification |

---

## 6. Luồng nghiệp vụ chính

### 6.1. Luồng mua vé B2C

```mermaid
sequenceDiagram
    actor M as Member
    participant DH as Discovery Hub
    participant ED as Event Detail
    participant SM as Seat Map
    participant SV as Server GraphQL
    participant DB as MongoDB

    M->>DH: Duyệt & tìm kiếm sự kiện
    DH->>SV: searchEvents(searchTerm, categoryId)
    SV->>DB: Query events status=Approved
    DB-->>SV: Danh sách sự kiện
    SV-->>DH: Trả về events
    M->>ED: Chọn xem chi tiết
    ED->>SV: getEventDetail(id)
    M->>SM: Xem sơ đồ chỗ ngồi
    SM->>SV: getEventSeatMap(eventId)
    M->>SV: holdMultipleSeats(memberId, seatIds)
    SV->>DB: Cập nhật ghế → held (10 phút)
    SV-->>M: Order trạng thái Held
    M->>SV: checkoutOrder(orderId)
    SV->>DB: Order → Paid, Ghế → booked
    SV-->>M: QR Code vé điện tử
```

### 6.2. Luồng đề xuất sự kiện B2B

```mermaid
sequenceDiagram
    actor M as Member
    actor A as Admin
    participant SV as Server

    M->>SV: createEventProposal(...)
    SV->>SV: Kiểm tra trùng lịch
    SV-->>M: Đề xuất Pending
    A->>SV: getAllEventProposals()
    SV-->>A: Danh sách đề xuất
    A->>SV: approveEventProposal(id)
    SV-->>A: Đề xuất Approved
    M->>SV: createContract(proposalId)
    SV-->>M: Hợp đồng Pending
    A->>SV: updateContractStatus → Approved
    M->>SV: updateContractStatus → Deposited
    M->>SV: updateContractStatus → Paid
```

### 6.3. Luồng Check-in tại sự kiện

```mermaid
sequenceDiagram
    actor E as Employee
    actor M as Member
    participant SV as Server
    participant WS as WebSocket

    M->>E: Đưa QR Code vé
    E->>SV: verifyTicketCheckin(ticketId)
    SV->>SV: Kiểm tra: tồn tại + Paid
    SV->>SV: Cập nhật → CheckedIn
    SV->>WS: Emit check-in-success
    SV-->>E: Kết quả: HỢP LỆ / TỪ CHỐI
    WS-->>M: Realtime notification
```

---

## 7. Ma trận Actor — Use Case

| Use Case | Guest | Member | Organizer | Employee | Admin |
|----------|:-----:|:------:|:---------:|:--------:|:-----:|
| Đăng ký tài khoản | | ✅ | | | |
| Đăng nhập | | ✅ | ✅ | ✅ | ✅ |
| Xác thực Email OTP | | ✅ | | | |
| Cập nhật hồ sơ | | ✅ | | ✅ | |
| Đổi mật khẩu | | ✅ | | ✅ | |
| Upload Avatar | | ✅ | | | |
| Duyệt sự kiện công khai | ✅ | ✅ | | | |
| Tìm kiếm sự kiện | ✅ | ✅ | | | |
| Xem chi tiết sự kiện | ✅ | ✅ | | | |
| Xem sơ đồ chỗ ngồi | | ✅ | | | |
| Chọn ghế / Giữ chỗ | | ✅ | | | |
| Thanh toán vé | | ✅ | | | |
| Hủy vé | | ✅ | | | |
| Xem tủ vé & QR | | ✅ | | | |
| Tạo đề xuất sự kiện | | ✅ | | | |
| Tạo hợp đồng | | ✅ | | | |
| Đặt cọc / Thanh toán HĐ | | ✅ | | | |
| Quản lý thư mời | | ✅ | | | |
| Gửi phản hồi RSVP | ✅ | | | | |
| Tạo sự kiện | | | ✅ | | |
| Quản lý khách mời | | | ✅ | | |
| Xếp bàn tiệc | | | ✅ | | |
| Kịch bản & Task | | | ✅ | | |
| Quét QR soát vé | | | | ✅ | |
| Xem HĐ cá nhân | | | | ✅ | |
| Thống kê báo cáo | | | | | ✅ |
| Duyệt sự kiện | | | | | ✅ |
| Duyệt đề xuất SK | | | | | ✅ |
| Duyệt hợp đồng | | | | | ✅ |
| CRUD Địa điểm | | | | | ✅ |
| CRUD Dịch vụ | | | | | ✅ |
| CRUD Thiết bị | | | | | ✅ |
| Quản lý nhân sự | | | | | ✅ |
| Quản lý khách hàng | | | | | ✅ |
| Khóa/Mở khóa TK | | | | | ✅ |

---

## 8. Cấu trúc dự án

```
event-booking-backend/
├── src/
│   ├── config/          # Cấu hình DB, env
│   ├── models/          # Mongoose schemas (12 models)
│   │   ├── User.js, Event.js, Order.js
│   │   ├── Contract.js, EventProposal.js
│   │   ├── Floorplan.js, Rsvp.js
│   │   ├── Category.js, TicketTier.js
│   │   ├── Location.js, Service.js, Device.js
│   ├── services/        # Business logic
│   │   ├── email.service.js   # Gửi email xác thực
│   │   ├── qr.service.js      # QR Code generation
│   │   ├── rabbitmq.js        # Message queue
│   │   └── ticket.worker.js   # Async ticket processing
│   └── schema.js        # GraphQL schema & resolvers

event-booking-frontend/
├── src/
│   ├── features/
│   │   ├── auth/        # AuthModal (Login/Register)
│   │   ├── discovery/   # DiscoveryHub, InfoModal
│   │   ├── ticketing/   # EventDetail, SeatMapUI
│   │   └── dashboard/   # GenericCRUD component
│   ├── pages/
│   │   ├── AdminPage.jsx
│   │   ├── MemberPage.jsx
│   │   ├── OrganizerPage.jsx
│   │   ├── EmployeePage.jsx
│   │   └── SettingsPage.jsx
│   └── components/      # Sidebar, Topbar
```

---

## 9. Hướng dẫn chạy

```bash
# Backend
cd event-booking-backend
npm install
npm run dev    # Port 4000

# Frontend
cd event-booking-frontend
npm install
npm run dev    # Port 5173
```

---

> **Tác giả:** Sinh viên Năm 4 — Cuối kỳ Thầy Phước
#   B a o c a o c u o i k i - G V N g u y e n T a n P h u o c  
 