const mongoose = require('mongoose');
const { connectDB } = require('./src/config/db');
const User = require('./src/models/User');
const Category = require('./src/models/Category');
const Event = require('./src/models/Event');
const TicketTier = require('./src/models/TicketTier');
const Location = require('./src/models/Location');
const Service = require('./src/models/Service');
const Device = require('./src/models/Device');
const Contract = require('./src/models/Contract');
const Order = require('./src/models/Order');
const EventProposal = require('./src/models/EventProposal');
const Organization = require('./src/models/Organization');
const InternalRequest = require('./src/models/InternalRequest');

async function seed() {
    await connectDB();
    console.log("🌱 Bắt đầu seed dữ liệu thực tế...");

    // Clear existing
    await User.deleteMany({});
    await Category.deleteMany({});
    await Event.deleteMany({});
    await TicketTier.deleteMany({});
    await Location.deleteMany({});
    await Service.deleteMany({});
    await Device.deleteMany({});
    await Contract.deleteMany({});
    await Order.deleteMany({});
    await EventProposal.deleteMany({});
    await Organization.deleteMany({});
    await InternalRequest.deleteMany({});

    // Seed Organizations
    const orgBranch1 = await Organization.create({ name: 'Chi nhánh Quận 1', description: 'Trụ sở chính quản lý khu vực Quận 1 và trung tâm' });
    const orgBranch2 = await Organization.create({ name: 'Chi nhánh Quận 3', description: 'Văn phòng đại diện Quận 3 chuyên nghiệp' });
    console.log("✅ Organizations created.");

    // ═══════════════════════════════════════════════════
    // 1. USERS
    // ═══════════════════════════════════════════════════
    const admin = await User.create({ username: 'admin', password: '123', role: 'ADMIN', fullname: 'Nguyễn Quốc Bảo', email: 'admin@ems.vn' });
    const org = await User.create({ username: 'org', password: '123', role: 'ORGANIZER', fullname: 'SpaceSpeakers Entertainment', phone: '0988888888', email: 'org@spacespeakers.vn', organizationId: orgBranch1._id });
    const org2 = await User.create({ username: 'org2', password: '123', role: 'ORGANIZER', fullname: 'YeaH1 Entertainment', phone: '0977777777', email: 'contact@yeah1.vn', organizationId: orgBranch2._id });
    const mem = await User.create({ username: 'member', password: '123', role: 'MEMBER', fullname: 'Trần Nhật Hào', phone: '0901112222', email: 'haotran@gmail.com' });
    const mem2 = await User.create({ username: 'member2', password: '123', role: 'MEMBER', fullname: 'Lê Thị Minh Anh', phone: '0912345678', email: 'minhanh@gmail.com' });
    const emp = await User.create({ username: 'employee', password: '123', role: 'EMPLOYEE', fullname: 'Phạm Văn Đức', email: 'duc.pham@ems.vn', organizationId: orgBranch1._id });
    const emp2 = await User.create({ username: 'employee2', password: '123', role: 'EMPLOYEE', fullname: 'Hoàng Thị Mai', email: 'mai.hoang@ems.vn', organizationId: orgBranch2._id });
    console.log("✅ Users created.");

    // ═══════════════════════════════════════════════════
    // 2. CATEGORIES
    // ═══════════════════════════════════════════════════
    const catMusic = await Category.create({ name: 'Âm Nhạc' });
    const catTech = await Category.create({ name: 'Công Nghệ' });
    const catExpo = await Category.create({ name: 'Triển Lãm' });
    const catWedding = await Category.create({ name: 'Đám Cưới' });
    const catSports = await Category.create({ name: 'Thể Thao' });
    const catConference = await Category.create({ name: 'Hội Nghị' });
    console.log("✅ Categories created.");

    // ═══════════════════════════════════════════════════
    // 3. LOCATIONS
    // ═══════════════════════════════════════════════════
    await Location.create({ name: 'GEM Center', address: '8 Nguyễn Bỉnh Khiêm, Q.1, TP.HCM', capacity: 5000 });
    await Location.create({ name: 'SECC Phú Mỹ Hưng', address: '799 Nguyễn Văn Linh, Q.7, TP.HCM', capacity: 15000 });
    await Location.create({ name: 'White Palace Convention', address: '588 Phạm Văn Đồng, Thủ Đức, TP.HCM', capacity: 3000 });
    await Location.create({ name: 'Nhà Hát Lớn Hà Nội', address: '1 Tràng Tiền, Hoàn Kiếm, Hà Nội', capacity: 600 });
    await Location.create({ name: 'SVĐ Mỹ Đình', address: 'Phường Mỹ Đình 1, Nam Từ Liêm, Hà Nội', capacity: 40000 });
    await Location.create({ name: 'Phú Thọ Indoor Stadium', address: '1 Lữ Gia, Q.11, TP.HCM', capacity: 8000 });
    await Location.create({ name: 'Nhà Văn hóa Thanh Niên', address: '4 Phạm Ngọc Thạch, Q.1, TP.HCM', capacity: 2000 });
    console.log("✅ Locations created.");

    // ═══════════════════════════════════════════════════
    // 4. SERVICES
    // ═══════════════════════════════════════════════════
    await Service.create({ name: 'Catering Premium', description: 'Dịch vụ tiệc buffet 5 sao, đồ uống miễn phí, phục vụ tại bàn', price: 25000000 });
    await Service.create({ name: 'Hệ Thống Âm Thanh JBL Pro', description: 'Dàn line array JBL VTX, sub bass kép, mixing board Yamaha CL5', price: 35000000 });
    await Service.create({ name: 'MC & Dẫn Chương Trình', description: 'MC song ngữ Anh-Việt chuyên nghiệp, có kinh nghiệm dẫn sự kiện lớn', price: 8000000 });
    await Service.create({ name: 'Nhiếp Ảnh & Quay Phim', description: 'Ekip 3 nhiếp ảnh gia, 2 quay phim 4K, drone, livestream Facebook/YouTube', price: 15000000 });
    await Service.create({ name: 'Trang Trí & Backdrop', description: 'Thiết kế sân khấu 3D, in ấn backdrop khổ lớn, trang trí hoa tươi', price: 20000000 });
    await Service.create({ name: 'Bảo Vệ & An Ninh', description: 'Đội ngũ 20 bảo vệ chuyên nghiệp, hệ thống camera giám sát', price: 12000000 });
    console.log("✅ Services created.");

    // ═══════════════════════════════════════════════════
    // 5. DEVICES
    // ═══════════════════════════════════════════════════
    await Device.create({ name: 'Màn Hình LED P3 Indoor', quantity: 8, price: 6000000, image: 'https://images.unsplash.com/photo-1563770660941-10a63607713a?w=400&h=300&fit=crop' });
    await Device.create({ name: 'Loa JBL VTX A12', quantity: 12, price: 4500000, image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=300&fit=crop' });
    await Device.create({ name: 'Moving Head Beam 230W', quantity: 20, price: 2000000, image: 'https://images.unsplash.com/photo-1504509546545-e000b4a62425?w=400&h=300&fit=crop' });
    await Device.create({ name: 'Mixing Console Yamaha CL5', quantity: 2, price: 8000000, image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=300&fit=crop' });
    await Device.create({ name: 'Camera Sony A7S III', quantity: 5, price: 3000000, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop' });
    await Device.create({ name: 'Máy Chiếu Laser 10000 Lumens', quantity: 3, price: 7000000, image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=300&fit=crop' });
    await Device.create({ name: 'Hệ Thống CO2 Jet', quantity: 6, price: 1500000, image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop' });
    console.log("✅ Devices created.");

    // ═══════════════════════════════════════════════════
    // 6. EVENTS — Dữ liệu thực tế, sắp diễn ra
    // ═══════════════════════════════════════════════════
    const e1 = await Event.create({
        organizerId: org._id, categoryId: catMusic._id,
        title: 'Siêu Nhạc Hội KOSMIK 2026',
        description: 'Đại nhạc hội EDM lớn nhất Đông Nam Á quy tụ hơn 30 DJ/Producer hàng đầu thế giới. Line-up bao gồm Martin Garrix, KSHMR, Binz, Sơn Tùng M-TP. Trải nghiệm ánh sáng 3D laser mapping và sân khấu 360 độ hoành tráng nhất từ trước đến nay.',
        date: '2026-06-15', status: 'Approved',
        coverImg: 'http://localhost:4000/uploads/kosmik_2026_cover.png',
        location: 'SVĐ Mỹ Đình, Hà Nội', eventType: 'PUBLIC', ticketingEnabled: true
    });

    const e2 = await Event.create({
        organizerId: org._id, categoryId: catTech._id,
        title: 'Vietnam Tech Summit 2026: AI & Future',
        description: 'Hội nghị công nghệ hàng đầu Việt Nam với hơn 50 diễn giả từ Google, Meta, NVIDIA và các startup unicorn. Các workshop thực hành về AI, Blockchain, IoT và chuyển đổi số doanh nghiệp. Networking dinner cùng 2000+ lãnh đạo công nghệ.',
        date: '2026-07-20', status: 'Approved',
        coverImg: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
        location: 'SECC Phú Mỹ Hưng, TP.HCM', eventType: 'PUBLIC', ticketingEnabled: true
    });

    const e3 = await Event.create({
        organizerId: org2._id, categoryId: catMusic._id,
        title: 'The Masked Singer Vietnam Concert',
        description: 'Live concert đặc biệt quy tụ tất cả các Masked Singer từ mùa 1-5. Lần đầu tiên các ca sĩ bí ẩn biểu diễn trực tiếp không mặt nạ. Chương trình đặc biệt với phần tương tác khán giả và mini-game nhận quà hấp dẫn.',
        date: '2026-05-25', status: 'Approved',
        coverImg: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80',
        location: 'Phú Thọ Indoor Stadium, TP.HCM', eventType: 'PUBLIC', ticketingEnabled: true
    });

    const e4 = await Event.create({
        organizerId: org._id, categoryId: catWedding._id,
        title: 'Royal Wedding Showcase 2026',
        description: 'Triển lãm cưới đẳng cấp hoàng gia với sự tham gia của 100+ thương hiệu hàng đầu. Trình diễn váy cưới Haute Couture, thưởng thức ẩm thực 5 sao và trải nghiệm không gian trang trí tiệc cưới xu hướng mới nhất.',
        date: '2026-08-10', status: 'Approved',
        coverImg: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
        location: 'White Palace Convention, TP.HCM', eventType: 'PUBLIC', ticketingEnabled: true
    });

    const e5 = await Event.create({
        organizerId: org2._id, categoryId: catSports._id,
        title: 'Vietnam Marathon Festival 2026',
        description: 'Giải marathon quốc tế với 4 cự ly: 5K, 10K, 21K, 42K. Đường chạy đẹp nhất Đông Nam Á qua các danh thắng Hà Nội. Giải thưởng tổng trị giá 2 tỷ đồng. Expo booth với gear running mới nhất từ Nike, Adidas, Garmin.',
        date: '2026-09-05', status: 'Approved',
        coverImg: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?auto=format&fit=crop&w=1200&q=80',
        location: 'SVĐ Mỹ Đình, Hà Nội', eventType: 'PUBLIC', ticketingEnabled: true
    });

    const e6 = await Event.create({
        organizerId: org._id, categoryId: catExpo._id,
        title: 'Vietnam International Art Expo',
        description: 'Triển lãm nghệ thuật đương đại quốc tế lần thứ 3 tại Việt Nam. Hơn 200 tác phẩm từ 50 nghệ sĩ nổi tiếng thế giới. Bao gồm tranh, điêu khắc, NFT art, và nghệ thuật sắp đặt immersive. Curated tours hàng ngày.',
        date: '2026-06-28', status: 'Approved',
        coverImg: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80',
        location: 'GEM Center, TP.HCM', eventType: 'PUBLIC', ticketingEnabled: true
    });

    const e7 = await Event.create({
        organizerId: org2._id, categoryId: catConference._id,
        title: 'StartUp Việt 2026 — Demo Day',
        description: 'Ngày hội khởi nghiệp lớn nhất năm với 50 startup pitch trực tiếp trước 200+ nhà đầu tư. Tổng giải thưởng đầu tư 100 tỷ đồng. Workshop về gọi vốn, scaling, marketing growth hack từ founders thành công.',
        date: '2026-07-12', status: 'Approved',
        coverImg: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
        location: 'Nhà Văn hóa Thanh Niên, TP.HCM', eventType: 'PUBLIC', ticketingEnabled: true
    });

    const e8 = await Event.create({
        organizerId: org._id, categoryId: catMusic._id,
        title: 'Rap Việt All-Star Concert',
        description: 'Đêm nhạc huyền thoại quy tụ tất cả quán quân và thí sinh nổi bật của Rap Việt qua 5 mùa. Binz, Karik, Wowy, MCK, tlinh, Dế Choắt và 20+ rapper khác. Sân khấu LED 3D mapping cùng hiệu ứng laser hologram.',
        date: '2026-05-30', status: 'Approved',
        coverImg: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80',
        location: 'Phú Thọ Indoor Stadium, TP.HCM', eventType: 'PUBLIC', ticketingEnabled: true
    });

    const e9 = await Event.create({
        organizerId: org2._id, categoryId: catTech._id,
        title: 'GameVerse Vietnam 2026',
        description: 'Triển lãm game và esports lớn nhất Việt Nam. Trải nghiệm sớm game AAA mới nhất, VR gaming zone, giải đấu Valorant & LMHT với tổng giải thưởng 500 triệu. Giao lưu với streamer và cosplay contest.',
        date: '2026-08-22', status: 'Approved',
        coverImg: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
        location: 'SECC Phú Mỹ Hưng, TP.HCM', eventType: 'PUBLIC', ticketingEnabled: true
    });

    const e10 = await Event.create({
        organizerId: org._id, categoryId: catWedding._id,
        title: 'Tiệc Cưới Hoàng Gia - Trần & Nguyễn',
        description: 'Tiệc cưới sang trọng phong cách hoàng gia Châu Âu. 500 khách mời, 5-course dinner với món Pháp-Việt fusion. Live band nhạc Jazz, trang trí hoa tươi nhập khẩu từ Hà Lan.',
        date: '2026-06-08', status: 'Approved',
        coverImg: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        location: 'White Palace Convention, TP.HCM', eventType: 'PRIVATE', ticketingEnabled: false
    });
    console.log("✅ 10 Events created.");

    // ═══════════════════════════════════════════════════
    // 7. TICKET TIERS — cho tất cả sự kiện có ticketing
    // ═══════════════════════════════════════════════════
    // Event 1 - KOSMIK
    await TicketTier.create({ eventId: e1._id, tierName: 'SVIP - Front Stage', price: 3500000, totalQuantity: 50, availableQuantity: 50 });
    await TicketTier.create({ eventId: e1._id, tierName: 'VIP - Golden Zone', price: 2000000, totalQuantity: 200, availableQuantity: 200 });
    await TicketTier.create({ eventId: e1._id, tierName: 'Standard GA', price: 800000, totalQuantity: 2000, availableQuantity: 2000 });

    // Event 2 - Tech Summit
    await TicketTier.create({ eventId: e2._id, tierName: 'VIP + Workshop', price: 5000000, totalQuantity: 100, availableQuantity: 100 });
    await TicketTier.create({ eventId: e2._id, tierName: 'Standard Pass', price: 1500000, totalQuantity: 500, availableQuantity: 500 });

    // Event 3 - Masked Singer
    await TicketTier.create({ eventId: e3._id, tierName: 'Diamond Seat', price: 2500000, totalQuantity: 80, availableQuantity: 80 });
    await TicketTier.create({ eventId: e3._id, tierName: 'VIP', price: 1500000, totalQuantity: 300, availableQuantity: 300 });
    await TicketTier.create({ eventId: e3._id, tierName: 'Standard', price: 600000, totalQuantity: 1500, availableQuantity: 1500 });

    // Event 4 - Wedding Showcase
    await TicketTier.create({ eventId: e4._id, tierName: 'VIP Couple', price: 1000000, totalQuantity: 100, availableQuantity: 100 });
    await TicketTier.create({ eventId: e4._id, tierName: 'General Entry', price: 300000, totalQuantity: 800, availableQuantity: 800 });

    // Event 5 - Marathon
    await TicketTier.create({ eventId: e5._id, tierName: '42K Full Marathon', price: 1200000, totalQuantity: 500, availableQuantity: 500 });
    await TicketTier.create({ eventId: e5._id, tierName: '21K Half Marathon', price: 800000, totalQuantity: 1000, availableQuantity: 1000 });
    await TicketTier.create({ eventId: e5._id, tierName: '10K Fun Run', price: 400000, totalQuantity: 2000, availableQuantity: 2000 });

    // Event 6 - Art Expo
    await TicketTier.create({ eventId: e6._id, tierName: 'VIP Guided Tour', price: 500000, totalQuantity: 50, availableQuantity: 50 });
    await TicketTier.create({ eventId: e6._id, tierName: 'General Admission', price: 150000, totalQuantity: 1000, availableQuantity: 1000 });

    // Event 7 - StartUp Demo Day
    await TicketTier.create({ eventId: e7._id, tierName: 'Investor Pass', price: 2000000, totalQuantity: 200, availableQuantity: 200 });
    await TicketTier.create({ eventId: e7._id, tierName: 'Startup Founder', price: 500000, totalQuantity: 300, availableQuantity: 300 });
    await TicketTier.create({ eventId: e7._id, tierName: 'General Attendee', price: 200000, totalQuantity: 500, availableQuantity: 500 });

    // Event 8 - Rap Việt
    await TicketTier.create({ eventId: e8._id, tierName: 'VVIP - Backstage', price: 5000000, totalQuantity: 30, availableQuantity: 30 });
    await TicketTier.create({ eventId: e8._id, tierName: 'VIP Standing', price: 2000000, totalQuantity: 500, availableQuantity: 500 });
    await TicketTier.create({ eventId: e8._id, tierName: 'GA - Khán Đài', price: 700000, totalQuantity: 3000, availableQuantity: 3000 });

    // Event 9 - GameVerse
    await TicketTier.create({ eventId: e9._id, tierName: 'Pro Gamer Pass', price: 800000, totalQuantity: 200, availableQuantity: 200 });
    await TicketTier.create({ eventId: e9._id, tierName: 'Day Pass', price: 250000, totalQuantity: 3000, availableQuantity: 3000 });
    console.log("✅ Ticket Tiers created.");

    // ═══════════════════════════════════════════════════
    // 8. CONTRACTS — Hợp đồng đi kèm sự kiện
    // ═══════════════════════════════════════════════════
    await Contract.create({ memberId: mem._id, employeeId: emp._id, eventId: e1._id, details: 'Hợp đồng tổ chức Siêu Nhạc Hội KOSMIK 2026 — Bao gồm thuê sân khấu, âm thanh, ánh sáng, bảo vệ', totalAmount: 850000000, status: 'Approved' });
    await Contract.create({ memberId: mem._id, employeeId: emp._id, eventId: e2._id, details: 'Hợp đồng Vietnam Tech Summit — Thuê hội trường SECC, catering, thiết bị trình chiếu', totalAmount: 450000000, status: 'Paid' });
    await Contract.create({ memberId: mem2._id, employeeId: emp2._id, eventId: e3._id, details: 'Hợp đồng Masked Singer Concert — Âm thanh JBL, LED wall, đội ngũ kỹ thuật', totalAmount: 320000000, status: 'Approved' });
    await Contract.create({ memberId: mem._id, eventId: e4._id, details: 'Hợp đồng Royal Wedding Showcase — Trang trí, catering, MC song ngữ', totalAmount: 180000000, status: 'Pending' });
    await Contract.create({ memberId: mem2._id, employeeId: emp._id, eventId: e5._id, details: 'Hợp đồng Vietnam Marathon Festival — Logistics, timing chip, water station', totalAmount: 250000000, status: 'Deposited' });
    await Contract.create({ memberId: mem._id, employeeId: emp2._id, eventId: e8._id, details: 'Hợp đồng Rap Việt Concert — Sân khấu LED 3D, hệ thống laser, CO2 jet', totalAmount: 680000000, status: 'Approved' });
    console.log("✅ Contracts created.");

    // ═══════════════════════════════════════════════════
    // 9. EVENT PROPOSALS — Đề xuất sự kiện từ khách hàng
    // ═══════════════════════════════════════════════════
    await EventProposal.create({ memberId: mem._id, title: 'Đêm Nhạc Sinh Viên ĐH Bách Khoa', description: 'Tổ chức đêm nhạc cuối năm cho sinh viên ĐH Bách Khoa TP.HCM, quy mô 2000 người, cần sân khấu, âm thanh, MC.', eventType: 'PUBLIC', expectedDate: '2026-12-15', expectedLocation: 'Nhà Văn hóa Thanh Niên', budget: 150000000, status: 'Pending' });
    await EventProposal.create({ memberId: mem2._id, title: 'Team Building Công Ty FPT Software', description: 'Tổ chức team building cho 500 nhân viên FPT Software, bao gồm games, tiệc BBQ, chương trình nghệ thuật.', eventType: 'PRIVATE', expectedDate: '2026-10-20', expectedLocation: 'Resort Long Hải', budget: 200000000, status: 'Approved', reviewNote: 'Đã duyệt, giao cho nhân viên Phạm Văn Đức phụ trách.' });
    await EventProposal.create({ memberId: mem._id, title: 'Lễ Ra Mắt Sản Phẩm Startup XYZ', description: 'Tổ chức lễ ra mắt sản phẩm công nghệ mới cho Startup XYZ, cần MC, catering, LED, truyền thông.', eventType: 'PUBLIC', expectedDate: '2026-11-05', expectedLocation: 'GEM Center', budget: 300000000, status: 'Pending' });
    console.log("✅ Event Proposals created.");

    console.log("\n🎉 Seed hoàn tất! Tất cả dữ liệu thực tế đã được tạo.");
    process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
