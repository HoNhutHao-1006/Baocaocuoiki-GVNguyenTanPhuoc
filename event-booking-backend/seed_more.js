const mongoose = require('mongoose');
const { Contract, TicketOrder, TicketTier, User, Event } = require('./db');

async function seedData() {
    await mongoose.connect("mongodb://127.0.0.1:27017/eventbooking");
    
    const emp = await User.findOne({ role: 'EMPLOYEE' });
    const mem = await User.findOne({ role: 'MEMBER' });
    const evt = await Event.findOne({ ticketingEnabled: true });
    const tier = await TicketTier.findOne({ eventId: evt._id });

    if (emp && evt) {
        let sc = await Contract.countDocuments();
        if (sc === 0) {
            await Contract.create({ employeeId: emp._id, eventId: evt._id, details: 'Thuê nhân sự soát vé quầy ngoài', totalAmount: 5000000, status: 'Paid' });
            await Contract.create({ employeeId: emp._id, eventId: evt._id, details: 'Thuê kỹ thuật viên âm thanh', totalAmount: 15000000, status: 'Pending' });
            console.log("Đã tạo dummy Contracts.");
        }
    }

    if (mem && evt && tier) {
        let so = await TicketOrder.countDocuments();
        if (so === 0) {
            await TicketOrder.create({ memberId: mem._id, eventId: evt._id, ticketTierId: tier._id, quantity: 2, totalAmount: tier.price * 2, status: 'Paid', qrCode: 'DUMMY_QR' });
            await TicketOrder.create({ memberId: mem._id, eventId: evt._id, ticketTierId: tier._id, quantity: 5, totalAmount: tier.price * 5, status: 'Paid', qrCode: 'DUMMY_QR_2' });
            console.log("Đã tạo dummy Ticket Orders.");
        }
    }

    process.exit();
}

seedData();
