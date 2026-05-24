const User = require('./models/User');
const Event = require('./models/Event');
const Category = require('./models/Category');
const TicketTier = require('./models/TicketTier');
const Order = require('./models/Order');
const Rsvp = require('./models/Rsvp');
const Location = require('./models/Location');
const Service = require('./models/Service');
const Device = require('./models/Device');
const { SeatZone, Seat } = require('./models/Floorplan');
const Contract = require('./models/Contract');
const EventProposal = require('./models/EventProposal');
const AdminRequest = require('./models/AdminRequest');
const { generateDynamicQR, verifyOTP } = require('./services/qr.service');
const { generateVerificationCode, sendVerificationEmail, sendEventInvitationEmail } = require('./services/email.service');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const JWT_SECRET = process.env.JWT_SECRET || 'EMS_SUPER_SECRET_KEY';

const typeDefs = `#graphql
  type User { id: ID!, username: String!, role: String!, status: String!, fullname: String, email: String, phone: String, token: String, avatar: String, emailVerified: Boolean, bankName: String, bankAccount: String }
  type Category { id: ID!, name: String! }
  type TicketTier { id: ID!, eventId: String!, tierName: String!, price: Float!, totalQuantity: Int!, availableQuantity: Int! }
  type TicketOrder { id: ID!, memberId: String!, eventId: String!, ticketTierId: String!, quantity: Int!, totalAmount: Float!, status: String!, qrCode: String, holdExpiresAt: String, seatId: String, seatLabel: String, zoneName: String, zoneColor: String, eventTitle: String, seatIds: [String], seatLabels: [String] }
  type SeatZoneInfo { id: ID!, name: String!, zoneColor: String!, price: Float!, rows: Int!, seatsPerRow: Int!, seats: [SeatInfo] }
  type SeatInfo { id: ID!, label: String!, row: String!, number: Int!, status: String! }
  type Guest { id: ID!, eventId: String!, name: String!, phone: String, status: String!, dietary: String, plusOnes: Int, tableId: String, note: String, tableName: String }
  type Invitation { id: ID!, memberId: String!, proposalId: String, eventId: String, name: String!, email: String, phone: String, status: String!, dietary: String, plusOnes: Int, note: String, qrCode: String, sentAt: String, createdAt: String, proposalTitle: String }
  type InvitationStats { total: Int!, pending: Int!, sent: Int!, confirmed: Int!, declined: Int! }
  type Location { id: ID!, name: String!, address: String, capacity: Int }
  type ServiceItem { id: ID!, name: String!, description: String, price: Float }
  type DeviceItem { id: ID!, name: String!, quantity: Int, price: Float, image: String }
  type Contract { id: ID!, memberId: String!, employeeId: String, eventId: String, details: String, totalAmount: Float, status: String, createdAt: String, fileUrl: String, fileName: String, proposalId: String, proposalTitle: String }
  type Stats { totalRevenue: Float!, totalTicketsSold: Int!, activeUsers: Int!, totalEvents: Int!, pendingProposals: Int!, totalContracts: Int!, totalRefunded: Float, cancelledCount: Int }
  type CheckinResult { success: Boolean!, message: String!, guestInfo: String }
  type DateConflictResult { hasConflict: Boolean!, conflictingEvents: [Event] }
  type ResourceCheck { available: Boolean!, locationConflicts: [String], deviceShortages: [String], conflictingEvents: [Event] }
  type SetupData { proposal: EventProposal, devices: [DeviceItem], locations: [Location], conflictingEvents: [Event], locationAvailable: Boolean! }
  type AdminRequest { id: ID!, memberId: String!, memberName: String, type: String!, subject: String!, content: String!, status: String!, adminNote: String, createdAt: String, resolvedAt: String }

  type EventProposal {
    id: ID!
    memberId: String!
    memberName: String
    title: String!
    description: String!
    eventType: String!
    expectedDate: String!
    expectedLocation: String!
    budget: Float
    status: String!
    reviewNote: String
    reviewedBy: String
    createdAt: String
  }

  type Event { 
    id: ID! 
    organizerId: String! 
    categoryId: String! 
    title: String! 
    description: String
    date: String! 
    status: String! 
    coverImg: String! 
    location: String!
    eventType: String!
    ticketingEnabled: Boolean!
    categoryName: String
    ticketTiers: [TicketTier]
  }

  type ContractFull {
    id: ID!
    details: String
    totalAmount: Float
    status: String
    createdAt: String
    fileUrl: String
    fileName: String
    memberId: String
    memberName: String
    memberEmail: String
    memberPhone: String
    memberBankName: String
    memberBankAccount: String
    proposalId: String
    proposalTitle: String
    proposalDescription: String
    proposalEventType: String
    proposalExpectedDate: String
    proposalExpectedLocation: String
    proposalBudget: Float
    eventId: String
    eventTitle: String
    services: [ServiceItem]
    devices: [DeviceItem]
  }

  type MonthlyRevenue { month: String!, revenue: Float!, orders: Int! }
  type CategoryStat { name: String!, count: Int!, amount: Float }
  type AnalyticsDashboard {
    monthlyRevenue: [MonthlyRevenue]
    eventTypeStats: [CategoryStat]
    contractStatusStats: [CategoryStat]
    orderStatusStats: [CategoryStat]
    totalMembers: Int!
    newMembersThisMonth: Int!
    avgOrderValue: Float!
    conversionRate: Float!
  }

  type RoadmapPhase {
    phase: String
    title: String
    items: [String]
  }

  type AIInsights {
    swotStrengths: [String]
    swotWeaknesses: [String]
    swotOpportunities: [String]
    swotThreats: [String]
    marketTrends: [String]
    strategicRecommendations: [String]
    roadmapPhases: [RoadmapPhase]
    generatedAt: String
  }

  type Query {
    login(username: String!, password: String!): User
    getAllUsers(page: Int, limit: Int): [User]
    getAllCategories: [Category]
    searchEvents(searchTerm: String, categoryId: String): [Event]
    getAllEvents(page: Int, limit: Int): [Event]
    getEventDetail(id: ID!): Event
    getOrganizerEvents(organizerId: String!): [Event]
    getMyTicketOrders(memberId: String!): [TicketOrder]
    getSystemStats: Stats
    getEventGuests(eventId: String!): [Guest]
    getDynamicQRPayload(orderId: ID!): String
    getEventSeatMap(eventId: ID!): [SeatZoneInfo]
    getAllLocations(page: Int, limit: Int): [Location]
    getAllServices(page: Int, limit: Int): [ServiceItem]
    getAllDevices(page: Int, limit: Int): [DeviceItem]
    getAllContracts(page: Int, limit: Int): [Contract]
    getMyContracts(memberId: ID!): [Contract]
    getEmployeeContracts(employeeId: ID!): [Contract]
    getContractsByEvent(eventId: ID!): [Contract]
    getAllEventProposals(page: Int, limit: Int): [EventProposal]
    getMyEventProposals(memberId: ID!): [EventProposal]
    checkEventDateConflict(date: String!, location: String!, excludeEventId: ID): DateConflictResult
    checkResourceAvailability(date: String!, location: String!, contractId: ID): ResourceCheck
    getEmployeeSetupData(contractId: ID!): SetupData
    getMyInvitations(memberId: ID!, proposalId: ID): [Invitation]
    getInvitationStats(memberId: ID!): InvitationStats
    getContractFull(contractId: ID!): ContractFull
    getAnalyticsDashboard: AnalyticsDashboard
    getAIInsights: AIInsights
    getAllAdminRequests: [AdminRequest]
    getMyAdminRequests(memberId: ID!): [AdminRequest]
  }

  type Mutation {
    registerAuth(username: String!, password: String!, role: String!, fullname: String, email: String): User
    sendVerificationCode(email: String!): Boolean
    verifyEmailCode(email: String!, code: String!): Boolean
    updateAvatar(userId: ID!, avatar: String!): User
    updateUserProfile(id: ID!, fullname: String, avatar: String): User
    updateUserStatus(userId: ID!, status: String!): User
    approveEvent(eventId: ID!): Event
    createEvent(organizerId: String!, categoryId: String!, title: String!, date: String!, coverImg: String!, location: String!, eventType: String, ticketingEnabled: Boolean, description: String): Event
    holdSeat(memberId: String!, seatId: ID!): TicketOrder
    holdMultipleSeats(memberId: String!, seatIds: [ID!]!): TicketOrder
    checkoutOrder(orderId: ID!): TicketOrder
    cancelOrder(orderId: ID!): Boolean
    submitRSVP(eventId: String!, name: String!, phone: String!, status: String!, dietary: String, plusOnes: Int, note: String): Guest
    verifyTicketCheckin(ticketId: ID!, otp: String): CheckinResult
    createLocation(name: String!, address: String, capacity: Int): Location
    createService(name: String!, description: String, price: Float): ServiceItem
    createDevice(name: String!, quantity: Int, price: Float, image: String): DeviceItem
    updateProfile(userId: ID!, fullname: String, email: String, phone: String, bankName: String, bankAccount: String): User
    changePassword(userId: ID!, oldPass: String!, newPass: String!): Boolean
    createContract(memberId: ID!, details: String!, totalAmount: Float, eventId: ID, proposalId: ID, fileUrl: String, fileName: String): Contract
    updateContractStatus(contractId: ID!, status: String!): Contract
    assignContract(contractId: ID!, employeeId: ID!): Contract
    createEventProposal(memberId: ID!, title: String!, description: String!, eventType: String, expectedDate: String!, expectedLocation: String!, budget: Float): EventProposal
    approveEventProposal(proposalId: ID!, reviewNote: String, reviewedBy: ID): EventProposal
    rejectEventProposal(proposalId: ID!, reviewNote: String, reviewedBy: ID): EventProposal
    createInvitation(memberId: ID!, proposalId: ID, name: String!, email: String, phone: String, dietary: String, plusOnes: Int, note: String): Invitation
    updateInvitationStatus(invitationId: ID!, status: String!): Invitation
    deleteInvitation(invitationId: ID!): Boolean
    sendInvitation(invitationId: ID!): Invitation
    sendAllInvitations(memberId: ID!, proposalId: ID): Boolean
    createAdminRequest(memberId: ID!, type: String!, subject: String!, content: String!): AdminRequest
    resolveAdminRequest(requestId: ID!, adminNote: String, status: String!): AdminRequest
    memberConfirmContract(contractId: ID!): Contract
    memberRejectContract(contractId: ID!): Contract
    employeeConfirmContract(contractId: ID!): Contract
  }
`;

const resolvers = {
  Event: {
    id: (p) => p._id?.toString() || p.id,
    organizerId: (p) => p.organizerId?.toString() || '',
    categoryId: (p) => p.categoryId?.toString() || '',
    description: (p) => p.description || '',
    eventType: (p) => p.eventType || 'PUBLIC',
    ticketingEnabled: (p) => p.ticketingEnabled ?? true,
    categoryName: async (parent) => {
      if (!parent.categoryId) return 'Khác';
      const c = await Category.findById(parent.categoryId);
      return c ? c.name : 'Khác';
    },
    ticketTiers: async (parent) => await TicketTier.find({ eventId: parent._id || parent.id })
  },
  User: { id: (p) => p._id?.toString() || p.id, avatar: (p) => p.avatar || '', emailVerified: (p) => p.emailVerified || false },
  Category: { id: (p) => p._id?.toString() || p.id },
  TicketTier: { id: (p) => p._id?.toString() || p.id, eventId: (p) => p.eventId?.toString() },
  TicketOrder: {
    id: (p) => p._id?.toString() || p.id,
    eventId: (p) => p.eventId?.toString(),
    memberId: (p) => p.memberId?.toString(),
    ticketTierId: (p) => p.ticketTierId ? p.ticketTierId.toString() : '',
    seatId: (p) => p.seatId ? p.seatId.toString() : null,
    seatIds: (p) => (p.seatIds || []).map(s => s.toString()),
    seatLabels: (p) => p.seatLabels || [],
    holdExpiresAt: (p) => p.holdExpiresAt ? p.holdExpiresAt.toISOString() : null,
    eventTitle: async (p) => {
      if (!p.eventId) return '';
      const ev = await Event.findById(p.eventId);
      return ev ? ev.title : '';
    }
  },
  Guest: {
    id: (p) => p._id?.toString() || p.id,
    eventId: (p) => p.eventId?.toString(),
    tableId: (p) => p.tableId ? p.tableId.toString() : null
  },
  Location: { id: (p) => p._id?.toString() || p.id },
  ServiceItem: { id: (p) => p._id?.toString() || p.id },
  DeviceItem: { id: (p) => p._id?.toString() || p.id, image: (p) => p.image || '' },
  Contract: { 
    id: (p) => p._id?.toString() || p.id,
    createdAt: (p) => p.createdAt?.toISOString(),
    proposalId: (p) => p.proposalId ? p.proposalId.toString() : null,
    proposalTitle: async (p) => {
      if (!p.proposalId) return null;
      const prop = await EventProposal.findById(p.proposalId);
      return prop ? prop.title : null;
    }
  },
  EventProposal: {
    id: (p) => p._id?.toString() || p.id,
    memberId: (p) => p.memberId?.toString(),
    createdAt: (p) => p.createdAt?.toISOString(),
    reviewedBy: (p) => p.reviewedBy ? p.reviewedBy.toString() : null,
    memberName: async (p) => {
      if (!p.memberId) return '';
      const u = await User.findById(p.memberId);
      return u ? (u.fullname || u.username) : '';
    }
  },

  Query: {
    login: async (_, { username, password }) => {
      const u = await User.findOne({ username });
      if (!u) throw new Error('Sai tài khoản');
      const isValid = await bcrypt.compare(password, u.password);
      if (!isValid) throw new Error('Sai mật khẩu');
      const token = jwt.sign({ id: u._id, role: u.role }, JWT_SECRET, { expiresIn: '8h' });
      return { ...u._doc, id: u._id, token };
    },

    getAllUsers: async (_, { page = 1, limit = 50 }) => {
      return await User.find().skip((page - 1) * limit).limit(limit);
    },

    getAllCategories: async () => await Category.find(),

    searchEvents: async (_, { searchTerm, categoryId }) => {
      let filter = { status: 'Approved', eventType: 'PUBLIC' };
      if (categoryId) filter.categoryId = categoryId;
      if (searchTerm) filter.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { location: { $regex: searchTerm, $options: 'i' } }
      ];
      return await Event.find(filter);
    },

    getAllEvents: async (_, { page = 1, limit = 50 }) => {
      return await Event.find().skip((page - 1) * limit).limit(limit);
    },

    getEventDetail: async (_, { id }) => await Event.findById(id),

    getOrganizerEvents: async (_, { organizerId }) => await Event.find({ organizerId }),

    getMyTicketOrders: async (_, { memberId }) => await Order.find({ memberId }).sort({ createdAt: -1 }),

    getSystemStats: async () => {
      const orders = await Order.find({ status: { $in: ['Paid', 'CheckedIn'] } });
      const cancelledOrders = await Order.find({ status: 'Cancelled', refundAmount: { $gt: 0 } });
      const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      const totalRefunded = cancelledOrders.reduce((sum, o) => sum + (o.refundAmount || 0), 0);
      const totalTicketsSold = orders.length;
      const activeUsers = await User.countDocuments({ status: 'ACTIVE' });
      const totalEvents = await Event.countDocuments();
      const pendingProposals = await EventProposal.countDocuments({ status: 'Pending' });
      const totalContracts = await Contract.countDocuments();
      const cancelledCount = cancelledOrders.length;
      return { totalRevenue: totalRevenue - totalRefunded, totalTicketsSold, activeUsers, totalEvents, pendingProposals, totalContracts, totalRefunded, cancelledCount };
    },

    getEventGuests: async (_, { eventId }) => await Rsvp.find({ eventId }),

    getEventSeatMap: async (_, { eventId }) => {
      const zones = await SeatZone.find({ eventId });
      const result = [];
      for (const z of zones) {
        const seats = await Seat.find({ zoneId: z._id }).sort({ row: 1, number: 1 });
        result.push({
          id: z._id.toString(), name: z.name, zoneColor: z.zoneColor,
          price: z.price, rows: z.rows, seatsPerRow: z.seatsPerRow,
          seats: seats.map(s => ({ id: s._id.toString(), label: s.label, row: s.row, number: s.number, status: s.status }))
        });
      }
      return result;
    },

    getAllLocations: async (_, { page = 1, limit = 50 }) => await Location.find().skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 }),
    getAllServices: async (_, { page = 1, limit = 50 }) => await Service.find().skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 }),
    getAllDevices: async (_, { page = 1, limit = 50 }) => await Device.find().skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 }),
    getAllContracts: async (_, { page = 1, limit = 50 }) => await Contract.find().skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 }),
    getMyContracts: async (_, { memberId }) => await Contract.find({ memberId }).sort({ createdAt: -1 }),
    getEmployeeContracts: async (_, { employeeId }) => await Contract.find({ employeeId }).sort({ createdAt: -1 }),
    getContractsByEvent: async (_, { eventId }) => await Contract.find({ eventId }).sort({ createdAt: -1 }),
    getDynamicQRPayload: async (_, { orderId }) => {
      const o = await Order.findById(orderId);
      return o ? o.qrCode : null;
    },
    getAllEventProposals: async (_, { page = 1, limit = 50 }) => {
      return await EventProposal.find().skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 });
    },
    getMyEventProposals: async (_, { memberId }) => {
      return await EventProposal.find({ memberId }).sort({ createdAt: -1 });
    },
    checkEventDateConflict: async (_, { date, location, excludeEventId }) => {
      const filter = { date, location: { $regex: location, $options: 'i' }, status: { $in: ['Approved', 'Private'] } };
      if (excludeEventId) filter._id = { $ne: excludeEventId };
      const conflicts = await Event.find(filter);
      return { hasConflict: conflicts.length > 0, conflictingEvents: conflicts };
    },
    checkResourceAvailability: async (_, { date, location, contractId }) => {
      // Check location/date conflicts
      const conflictingEvents = await Event.find({ date, location: { $regex: location, $options: 'i' }, status: { $in: ['Approved', 'Private'] } });
      const locationConflicts = conflictingEvents.map(e => `"${e.title}" (${e.date} @ ${e.location})`);
      // Check device availability
      const devices = await Device.find();
      const deviceShortages = devices.filter(d => (d.quantity || 0) <= 0).map(d => `${d.name} (Hết hàng)`);
      return {
        available: conflictingEvents.length === 0,
        locationConflicts,
        deviceShortages,
        conflictingEvents
      };
    },
    getEmployeeSetupData: async (_, { contractId }) => {
      const contract = await Contract.findById(contractId);
      if (!contract) throw new Error('Không tìm thấy hợp đồng.');
      const proposal = contract.proposalId ? await EventProposal.findById(contract.proposalId) : null;
      const devices = await Device.find().sort({ name: 1 });
      const locations = await Location.find().sort({ name: 1 });
      // Check conflicts for this proposal's date/location
      let conflictingEvents = [];
      let locationAvailable = true;
      if (proposal) {
        conflictingEvents = await Event.find({ date: proposal.expectedDate, location: { $regex: proposal.expectedLocation, $options: 'i' }, status: { $in: ['Approved', 'Private'] } });
        locationAvailable = conflictingEvents.length === 0;
      }
      return { proposal, devices, locations, conflictingEvents, locationAvailable };
    },
    getMyInvitations: async (_, { memberId, proposalId }) => {
      const query = { memberId };
      if (proposalId) query.proposalId = proposalId;
      return await Rsvp.find(query).sort({ createdAt: -1 });
    },
    getInvitationStats: async (_, { memberId }) => {
      const all = await Rsvp.find({ memberId });
      return {
        total: all.length,
        pending: all.filter(i => i.status === 'Pending').length,
        sent: all.filter(i => i.status === 'Sent').length,
        confirmed: all.filter(i => i.status === 'Confirmed').length,
        declined: all.filter(i => i.status === 'Declined').length
      };
    },

    getContractFull: async (_, { contractId }) => {
      const contract = await Contract.findById(contractId);
      if (!contract) throw new Error('Không tìm thấy hợp đồng.');
      const member = contract.memberId ? await User.findById(contract.memberId) : null;
      const proposal = contract.proposalId ? await EventProposal.findById(contract.proposalId) : null;
      const event = contract.eventId ? await Event.findById(contract.eventId) : null;
      const services = await Service.find().limit(20);
      const devices = await Device.find().limit(20);
      return {
        id: contract._id.toString(), details: contract.details, totalAmount: contract.totalAmount,
        status: contract.status, createdAt: contract.createdAt?.toISOString(),
        fileUrl: contract.fileUrl, fileName: contract.fileName,
        memberId: contract.memberId?.toString(),
        memberName: member ? (member.fullname || member.username) : '',
        memberEmail: member?.email || '', memberPhone: member?.phone || '',
        memberBankName: member?.bankName || '', memberBankAccount: member?.bankAccount || '',
        proposalId: contract.proposalId?.toString(),
        proposalTitle: proposal?.title || '', proposalDescription: proposal?.description || '',
        proposalEventType: proposal?.eventType || '', proposalExpectedDate: proposal?.expectedDate || '',
        proposalExpectedLocation: proposal?.expectedLocation || '', proposalBudget: proposal?.budget || 0,
        eventId: contract.eventId?.toString(), eventTitle: event?.title || '',
        services, devices
      };
    },

    getAnalyticsDashboard: async () => {
      const allOrders = await Order.find();
      const paidOrders = allOrders.filter(o => o.status === 'Paid' || o.status === 'CheckedIn');
      // Monthly revenue
      const monthlyMap = {};
      paidOrders.forEach(o => {
        const d = o.createdAt || new Date();
        const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
        if (!monthlyMap[key]) monthlyMap[key] = { month: key, revenue: 0, orders: 0 };
        monthlyMap[key].revenue += o.totalAmount || 0;
        monthlyMap[key].orders += 1;
      });
      const monthlyRevenue = Object.values(monthlyMap).sort((a,b) => a.month.localeCompare(b.month)).slice(-12);
      // Event types
      const events = await Event.find();
      const etMap = {};
      events.forEach(e => { const t = e.eventType || 'PUBLIC'; etMap[t] = (etMap[t]||0)+1; });
      const eventTypeStats = Object.entries(etMap).map(([name,count]) => ({ name, count, amount: 0 }));
      // Contract status
      const contracts = await Contract.find();
      const csMap = {};
      contracts.forEach(c => { const s = c.status||'Pending'; if(!csMap[s]) csMap[s]={count:0,amount:0}; csMap[s].count++; csMap[s].amount+=(c.totalAmount||0); });
      const contractStatusStats = Object.entries(csMap).map(([name,v]) => ({ name, count: v.count, amount: v.amount }));
      // Order status
      const osMap = {};
      allOrders.forEach(o => { const s = o.status||'Held'; osMap[s] = (osMap[s]||0)+1; });
      const orderStatusStats = Object.entries(osMap).map(([name,count]) => ({ name, count, amount: 0 }));
      // Members
      const totalMembers = await User.countDocuments({ role: 'MEMBER' });
      const som = new Date(); som.setDate(1); som.setHours(0,0,0,0);
      const newMembersThisMonth = await User.countDocuments({ role: 'MEMBER', createdAt: { $gte: som } });
      const avgOrderValue = paidOrders.length > 0 ? paidOrders.reduce((s,o) => s+(o.totalAmount||0), 0) / paidOrders.length : 0;
      const conversionRate = allOrders.length > 0 ? (paidOrders.length / allOrders.length) * 100 : 0;
      return { monthlyRevenue, eventTypeStats, contractStatusStats, orderStatusStats, totalMembers, newMembersThisMonth, avgOrderValue, conversionRate };
    },

    getAIInsights: async () => {
      try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error('GEMINI_API_KEY not configured');
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        // Gather real system data
        const totalRevenue = await Order.aggregate([{ $match: { status: { $in: ['Paid', 'CheckedIn'] } } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]);
        const totalOrders = await Order.countDocuments();
        const paidOrders = await Order.countDocuments({ status: { $in: ['Paid', 'CheckedIn'] } });
        const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });
        const totalEvents = await Event.countDocuments();
        const totalMembers = await User.countDocuments({ role: 'MEMBER' });
        const totalContracts = await Contract.countDocuments();
        const pendingProposals = await EventProposal.countDocuments({ status: 'Pending' });
        const eventTypes = await Event.aggregate([{ $group: { _id: '$eventType', count: { $sum: 1 } } }]);

        const systemData = {
          totalRevenue: totalRevenue[0]?.total || 0,
          totalOrders, paidOrders, cancelledOrders,
          conversionRate: totalOrders > 0 ? ((paidOrders / totalOrders) * 100).toFixed(1) : 0,
          cancelRate: totalOrders > 0 ? ((cancelledOrders / totalOrders) * 100).toFixed(1) : 0,
          totalEvents, totalMembers, totalContracts, pendingProposals,
          eventTypes: eventTypes.map(e => `${e._id}: ${e.count}`).join(', ')
        };

        const prompt = `Ban la chuyen gia phan tich kinh doanh cho cong ty to chuc su kien "Lumina EMS". Dua tren du lieu he thong THUC TE sau:

- Tong doanh thu: ${systemData.totalRevenue.toLocaleString()} VND
- Tong don hang: ${systemData.totalOrders} (Da thanh toan: ${systemData.paidOrders}, Huy: ${systemData.cancelledOrders})
- Ty le chuyen doi: ${systemData.conversionRate}%
- Ty le huy: ${systemData.cancelRate}%
- Tong su kien: ${systemData.totalEvents}
- Tong thanh vien: ${systemData.totalMembers}
- Tong hop dong: ${systemData.totalContracts}
- De xuat cho duyet: ${systemData.pendingProposals}
- Phan loai su kien: ${systemData.eventTypes}

Hay tra loi CHINH XAC theo format JSON sau (KHONG giai thich them, CHI tra ve JSON):
{
  "swotStrengths": ["diem manh 1", "diem manh 2", "diem manh 3", "diem manh 4"],
  "swotWeaknesses": ["diem yeu 1", "diem yeu 2", "diem yeu 3", "diem yeu 4"],
  "swotOpportunities": ["co hoi 1 (dua tren xu huong thi truong 2026)", "co hoi 2", "co hoi 3", "co hoi 4"],
  "swotThreats": ["thach thuc 1", "thach thuc 2", "thach thuc 3", "thach thuc 4"],
  "marketTrends": ["xu huong 1 voi % du bao", "xu huong 2", "xu huong 3", "xu huong 4", "xu huong 5"],
  "strategicRecommendations": ["khuyen nghi chien luoc 1 cu the", "khuyen nghi 2", "khuyen nghi 3", "khuyen nghi 4"],
  "roadmapPhases": [
    {"phase": "Q3/2026", "title": "ten giai doan ngan", "items": ["hanh dong 1", "hanh dong 2", "hanh dong 3"]},
    {"phase": "Q4/2026", "title": "ten giai doan", "items": ["hanh dong 1", "hanh dong 2", "hanh dong 3"]},
    {"phase": "Q1/2027", "title": "ten giai doan", "items": ["hanh dong 1", "hanh dong 2", "hanh dong 3"]},
    {"phase": "Q2/2027", "title": "ten giai doan", "items": ["hanh dong 1", "hanh dong 2", "hanh dong 3"]}
  ]
}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Invalid AI response');
        const parsed = JSON.parse(jsonMatch[0]);
        return { ...parsed, generatedAt: new Date().toISOString() };
      } catch (err) {
        console.error('AI Insights error:', err.message);
        return {
          swotStrengths: ['He thong QR check-in hien dai', 'Dashboard real-time analytics', 'GraphQL API hieu nang cao', 'Giao dien UX/UI chuyen nghiep'],
          swotWeaknesses: ['Can toi uu ty le huy ve', 'Chua co mobile app', 'Can mo rong doi ngu ho tro', 'Thieu tinh nang loyalty program'],
          swotOpportunities: ['Thi truong to chuc su kien tang 25%/nam (2026)', 'Xu huong hybrid events', 'AI personalization dang len ngoi', 'Mo rong sang B2B enterprise'],
          swotThreats: ['Canh tranh gia tu doi thu', 'Chi phi van hanh tang cao', 'Thay doi xu huong nguoi dung nhanh', 'Rui ro bao mat va quy dinh GDPR'],
          marketTrends: ['To chuc su kien truc tuyen: 78%', 'Hybrid events: 65%', 'AI-powered: 52%', 'Green events: 45%', 'Metaverse/VR: 28%'],
          strategicRecommendations: ['Giam ty le huy ve bang chinh sach gia linh hoat', 'Tich hop AI de xuat su kien ca nhan hoa', 'Xay dung loyalty program tang retention', 'Mo rong B2B partnerships'],
          roadmapPhases: [
            { phase: 'Q3/2026', title: 'Toi uu hoa', items: ['Giam ty le huy ve', 'Nang cap CSKH', 'A/B testing UI'] },
            { phase: 'Q4/2026', title: 'Ca nhan hoa', items: ['AI de xuat su kien', 'Email marketing', 'Loyalty program'] },
            { phase: 'Q1/2027', title: 'Mo rong', items: ['Hybrid events', 'B2B partnerships', 'API marketplace'] },
            { phase: 'Q2/2027', title: 'Dai duong xanh', items: ['Metaverse events', 'NFT ticketing', 'Global expansion'] }
          ],
          generatedAt: new Date().toISOString()
        };
      }
    },
    getAllAdminRequests: async () => await AdminRequest.find().sort({ createdAt: -1 }),
    getMyAdminRequests: async (_, { memberId }) => await AdminRequest.find({ memberId }).sort({ createdAt: -1 })
  },

  Mutation: {
    registerAuth: async (_, args) => {
      const exist = await User.findOne({ username: args.username });
      if (exist) throw new Error('Tài khoản đã tồn tại.');
      if (args.role === 'MEMBER' && args.email) {
        const emailUser = await User.findOne({ email: args.email, emailVerified: true });
        if (emailUser) throw new Error('Email đã được sử dụng.');
      }
      // Check if email was verified via OTP
      const isEmailVerified = global._verifiedEmails && global._verifiedEmails.has(args.email);
      if (args.role === 'MEMBER' && !isEmailVerified) {
        throw new Error('Vui lòng xác nhận email trước khi đăng ký.');
      }
      if (isEmailVerified) global._verifiedEmails.delete(args.email);
      const user = await User.create({ ...args, emailVerified: isEmailVerified || args.role !== 'MEMBER' });
      return user;
    },

    sendVerificationCode: async (_, { email }) => {
      const code = generateVerificationCode();
      const expires = new Date(Date.now() + 10 * 60000);
      // Store code in memory for pre-registration verification
      if (!global._verificationCodes) global._verificationCodes = {};
      global._verificationCodes[email] = { code, expires };
      // Also store in DB if user exists
      let tempUser = await User.findOne({ email, emailVerified: false });
      if (tempUser) {
        tempUser.verificationCode = code;
        tempUser.verificationExpires = expires;
        await tempUser.save();
      }
      // Send email via Gmail
      try {
        await sendVerificationEmail(email, code);
        console.log(`[Email] ✅ Mã OTP đã gửi đến ${email}`);
      } catch (err) {
        console.error('[Email] ❌ Gửi thất bại:', err.message);
        throw new Error('Không thể gửi email. Vui lòng thử lại.');
      }
      return true;
    },

    verifyEmailCode: async (_, { email, code }) => {
      // Check memory store first (for pre-registration)
      if (global._verificationCodes && global._verificationCodes[email]) {
        const stored = global._verificationCodes[email];
        if (stored.code === code && new Date() < new Date(stored.expires)) {
          delete global._verificationCodes[email];
          // Mark email as verified in memory for pre-registration
          if (!global._verifiedEmails) global._verifiedEmails = new Set();
          global._verifiedEmails.add(email);
          // If user exists, mark as verified
          await User.updateOne({ email }, { emailVerified: true, verificationCode: '' });
          return true;
        }
      }
      // Check DB
      const user = await User.findOne({ email, verificationCode: code });
      if (!user) {
        // For pre-registration: code was wrong or expired
        throw new Error('Mã xác nhận không chính xác.');
      }
      if (user.verificationExpires && new Date() > user.verificationExpires) throw new Error('Mã đã hết hạn. Vui lòng gửi lại.');
      user.emailVerified = true;
      user.verificationCode = '';
      await user.save();
      return true;
    },

    updateAvatar: async (_, { userId, avatar }) => {
      return await User.findByIdAndUpdate(userId, { avatar }, { new: true });
    },

    updateUserProfile: async (_, { id, fullname, avatar }) => {
      const update = {};
      if (fullname !== undefined) update.fullname = fullname;
      if (avatar !== undefined) update.avatar = avatar;
      return await User.findByIdAndUpdate(id, update, { new: true });
    },

    updateUserStatus: async (_, { userId, status }) => {
      return await User.findByIdAndUpdate(userId, { status }, { new: true });
    },

    approveEvent: async (_, { eventId }) => {
      // Check date conflict before approving
      const evt = await Event.findById(eventId);
      if (!evt) throw new Error('Sự kiện không tồn tại.');
      const conflicts = await Event.find({ date: evt.date, location: { $regex: evt.location, $options: 'i' }, status: 'Approved', _id: { $ne: eventId } });
      if (conflicts.length > 0) {
        throw new Error(`TRÙNG LỊCH! Ngày ${evt.date} tại "${evt.location}" đã có sự kiện: "${conflicts[0].title}". Vui lòng chọn ngày/địa điểm khác.`);
      }
      const updated = await Event.findByIdAndUpdate(eventId, { status: 'Approved' }, { new: true });
      if (globalIo) globalIo.emit('event-approved', { eventId, title: updated.title, date: updated.date, location: updated.location });
      return updated;
    },

    createEvent: async (_, args) => {
      return await Event.create(args);
    },

    holdSeat: async (_, { memberId, seatId }) => {
      const seat = await Seat.findById(seatId);
      if (!seat || seat.status !== 'available') throw new Error('Ghế không khả dụng.');
      const zone = await SeatZone.findById(seat.zoneId);
      const holdExpiresAt = new Date(Date.now() + 10 * 60000);
      seat.status = 'held';
      seat.heldBy = memberId;
      seat.heldUntil = holdExpiresAt;
      await seat.save();
      const order = await Order.create({
        memberId, eventId: seat.eventId, ticketTierId: zone._id,
        seatId: seat._id, seatLabel: seat.label, zoneName: zone.name, zoneColor: zone.zoneColor,
        seatIds: [seat._id], seatLabels: [seat.label],
        quantity: 1, totalAmount: zone.price, status: 'Held', holdExpiresAt
      });
      if (globalIo) globalIo.emit('seat-updated', { seatId: seat._id.toString(), status: 'held', eventId: seat.eventId.toString() });
      return order;
    },

    holdMultipleSeats: async (_, { memberId, seatIds }) => {
      if (seatIds.length === 0) throw new Error('Vui lòng chọn ít nhất 1 ghế.');
      if (seatIds.length > 10) throw new Error('Tối đa 10 ghế mỗi lần đặt.');
      const seats = await Seat.find({ _id: { $in: seatIds }, status: 'available' });
      if (seats.length !== seatIds.length) throw new Error(`Chỉ còn ${seats.length}/${seatIds.length} ghế khả dụng.`);
      const zone = await SeatZone.findById(seats[0].zoneId);
      const holdExpiresAt = new Date(Date.now() + 10 * 60000);
      // Hold all seats
      for (const seat of seats) {
        seat.status = 'held';
        seat.heldBy = memberId;
        seat.heldUntil = holdExpiresAt;
        await seat.save();
        if (globalIo) globalIo.emit('seat-updated', { seatId: seat._id.toString(), status: 'held', eventId: seat.eventId.toString() });
      }
      const order = await Order.create({
        memberId, eventId: seats[0].eventId, ticketTierId: zone._id,
        seatId: seats[0]._id, seatLabel: seats.map(s => s.label).join(', '),
        seatIds: seats.map(s => s._id), seatLabels: seats.map(s => s.label),
        zoneName: zone.name, zoneColor: zone.zoneColor,
        quantity: seats.length, totalAmount: zone.price * seats.length,
        status: 'Held', holdExpiresAt
      });
      return order;
    },

    checkoutOrder: async (_, { orderId }) => {
      const order = await Order.findById(orderId);
      if (!order) throw new Error('Không tìm thấy đơn hàng.');
      if (order.status !== 'Held') throw new Error('Đơn hàng không ở trạng thái chờ thanh toán.');
      const qrPayload = `EMS-${order._id}-${Date.now()}`;
      order.status = 'Paid';
      order.qrCode = qrPayload;
      await order.save();
      // Update all seats in the order
      const allSeatIds = (order.seatIds && order.seatIds.length > 0) ? order.seatIds : (order.seatId ? [order.seatId] : []);
      for (const sid of allSeatIds) {
        await Seat.findByIdAndUpdate(sid, { status: 'booked' });
        if (globalIo) globalIo.emit('seat-updated', { seatId: sid.toString(), status: 'booked', eventId: order.eventId.toString() });
      }
      if (globalIo) globalIo.emit('ticket-purchased', { orderId: order._id.toString(), memberId: order.memberId.toString(), eventId: order.eventId.toString(), amount: order.totalAmount });
      return order;
    },

    cancelOrder: async (_, { orderId }) => {
      const order = await Order.findById(orderId);
      if (!order) throw new Error('Không tìm thấy đơn hàng.');
      if (order.status === 'CheckedIn') throw new Error('Vé đã check-in, không thể hủy.');
      if (order.status === 'Cancelled') throw new Error('Vé đã được hủy trước đó.');
      
      const wasPaid = order.status === 'Paid';
      const refundAmount = wasPaid ? order.totalAmount : 0;
      
      order.status = 'Cancelled';
      order.refundAmount = refundAmount;
      order.cancelledAt = new Date();
      await order.save();
      
      // Release all seats
      const allSeatIds = (order.seatIds && order.seatIds.length > 0) ? order.seatIds : (order.seatId ? [order.seatId] : []);
      for (const sid of allSeatIds) {
        await Seat.findByIdAndUpdate(sid, { status: 'available', heldBy: null, heldUntil: null });
        if (globalIo) globalIo.emit('seat-updated', { seatId: sid.toString(), status: 'available', eventId: order.eventId.toString() });
      }
      
      // Restore ticket tier quantity
      if (order.ticketTierId) {
        await TicketTier.findByIdAndUpdate(order.ticketTierId, { $inc: { availableQuantity: order.quantity || 1 } });
      }
      
      // Log refund info
      if (wasPaid) {
        const member = await User.findById(order.memberId);
        console.log(`[Refund] 💰 Hoàn ${refundAmount.toLocaleString()}đ → ${member?.bankName || 'N/A'} - ${member?.bankAccount || 'N/A'} (${member?.fullname})`);
      }
      
      return true;
    },

    submitRSVP: async (_, args) => {
      return await Rsvp.findOneAndUpdate({ phone: args.phone, eventId: args.eventId }, args, { upsert: true, new: true });
    },

    verifyTicketCheckin: async (_, { ticketId, otp }) => {
      const o = await Order.findById(ticketId);
      if (!o) return { success: false, message: 'Vé không tồn tại.' };
      if (o.status === 'CheckedIn') return { success: false, message: 'Vé đã được sử dụng.' };
      if (o.status !== 'Paid') return { success: false, message: 'Vé chưa được thanh toán.' };
      o.status = 'CheckedIn';
      await o.save();
      if (globalIo) globalIo.emit('check-in-success', { message: `Check-in thành công! Mã vé: ${ticketId}`, timestamp: new Date() });
      return { success: true, message: 'Check-in thành công! Chào mừng bạn đến sự kiện.' };
    },

    createLocation: async (_, args) => await Location.create(args),
    createService: async (_, args) => await Service.create(args),
    createDevice: async (_, args) => await Device.create(args),

    updateProfile: async (_, { userId, ...updates }) => {
      return await User.findByIdAndUpdate(userId, updates, { new: true });
    },

    changePassword: async (_, { userId, oldPass, newPass }) => {
      const u = await User.findById(userId);
      if (!u) throw new Error('User not found');
      const isValid = await bcrypt.compare(oldPass, u.password);
      if (!isValid) throw new Error('Mật khẩu cũ không chính xác');
      u.password = newPass;
      await u.save();
      return true;
    },

    createContract: async (_, args) => await Contract.create(args),
    
    updateContractStatus: async (_, { contractId, status }) => {
      return await Contract.findByIdAndUpdate(contractId, { status }, { new: true });
    },

    assignContract: async (_, { contractId, employeeId }) => {
      return await Contract.findByIdAndUpdate(contractId, { employeeId }, { new: true });
    },

    createEventProposal: async (_, args) => {
      // Check date conflict for proposals
      const conflicts = await Event.find({ date: args.expectedDate, location: { $regex: args.expectedLocation, $options: 'i' }, status: 'Approved' });
      if (conflicts.length > 0) {
        throw new Error(`Ngày ${args.expectedDate} tại "${args.expectedLocation}" đã có sự kiện: "${conflicts[0].title}". Vui lòng chọn ngày/địa điểm khác.`);
      }
      const proposal = await EventProposal.create(args);
      if (globalIo) globalIo.emit('new-proposal', { proposalId: proposal._id.toString(), title: proposal.title });
      return proposal;
    },

    approveEventProposal: async (_, { proposalId, reviewNote, reviewedBy }) => {
      const prop = await EventProposal.findById(proposalId);
      if (!prop) throw new Error('Không tìm thấy đề xuất.');
      // Double-check date conflict on approval
      const conflicts = await Event.find({ date: prop.expectedDate, location: { $regex: prop.expectedLocation, $options: 'i' }, status: 'Approved' });
      if (conflicts.length > 0) {
        throw new Error(`Không thể duyệt! Ngày ${prop.expectedDate} tại "${prop.expectedLocation}" đã có sự kiện: "${conflicts[0].title}".`);
      }
      const proposal = await EventProposal.findByIdAndUpdate(proposalId, { status: 'Approved', reviewNote, reviewedBy }, { new: true });

      // ═══ TỰ ĐỘNG TẠO HỢP ĐỒNG KHI DUYỆT ĐỀ XUẤT ═══
      const memberInfo = await User.findById(prop.memberId);
      const memberName = memberInfo ? (memberInfo.fullname || memberInfo.username) : 'Khách hàng';
      const memberEmail = memberInfo?.email || 'Chưa cung cấp';
      const memberPhone = memberInfo?.phone || 'Chưa cung cấp';

      const contractDetails = `
══════════════════════════════════════════
       HỢP ĐỒNG TỔ CHỨC SỰ KIỆN
              Lumina EMS
══════════════════════════════════════════

Số HĐ: HĐ-${Date.now().toString(36).toUpperCase()}
Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}

──────────────────────────────────────────
I. THÔNG TIN KHÁCH HÀNG
──────────────────────────────────────────
- Họ tên: ${memberName}
- Email: ${memberEmail}
- Điện thoại: ${memberPhone}

──────────────────────────────────────────
II. THÔNG TIN SỰ KIỆN
──────────────────────────────────────────
- Tên sự kiện: ${prop.title}
- Mô tả: ${prop.description}
- Loại sự kiện: ${prop.eventType === 'PUBLIC' ? 'Công khai' : 'Riêng tư'}
- Ngày tổ chức: ${prop.expectedDate}
- Địa điểm: ${prop.expectedLocation}
- Ngân sách dự kiến: ${prop.budget?.toLocaleString('vi-VN')} VNĐ

──────────────────────────────────────────
III. DỊCH VỤ CUNG CẤP
──────────────────────────────────────────
1. Thiết kế & thi công sân khấu
2. Hệ thống âm thanh, ánh sáng chuyên nghiệp
3. Quản lý vận hành sự kiện
4. Hệ thống bán vé & check-in QR Code
5. Nhân sự vận hành (MC, kỹ thuật, bảo vệ)
6. Truyền thông & quảng bá sự kiện

──────────────────────────────────────────
IV. ĐIỀU KHOẢN HỢP ĐỒNG
──────────────────────────────────────────
Điều 1: Bên B (Lumina EMS) cam kết cung cấp đầy đủ
dịch vụ theo nội dung đã thỏa thuận.

Điều 2: Bên A (Khách hàng) thanh toán theo lộ trình:
  - Đặt cọc 30% giá trị HĐ khi ký kết
  - Thanh toán 50% trước ngày tổ chức 7 ngày
  - Thanh toán 20% còn lại sau khi hoàn thành

Điều 3: Trong trường hợp hủy sự kiện:
  - Trước 30 ngày: hoàn 70% tiền đặt cọc
  - Trước 14 ngày: hoàn 50% tiền đặt cọc
  - Dưới 14 ngày: không hoàn tiền đặt cọc

Điều 4: Bên B chịu trách nhiệm bồi thường nếu
không thực hiện đúng cam kết dịch vụ.

Điều 5: Mọi thay đổi phải được thông báo bằng
văn bản và có sự đồng ý của cả hai bên.

──────────────────────────────────────────
V. CAM KẾT
──────────────────────────────────────────
Hai bên cam kết thực hiện đúng các điều khoản
đã ghi trong hợp đồng này.

         Bên A                    Bên B
    (Khách hàng)            (Lumina EMS)
    ${memberName}           Ban Quản Lý
══════════════════════════════════════════
`.trim();

      await Contract.create({
        memberId: prop.memberId,
        proposalId: prop._id,
        details: contractDetails,
        totalAmount: prop.budget || 0,
        status: 'Pending'
      });

      if (globalIo) globalIo.emit('proposal-updated', { proposalId, status: 'Approved' });
      return proposal;
    },

    rejectEventProposal: async (_, { proposalId, reviewNote, reviewedBy }) => {
      const proposal = await EventProposal.findByIdAndUpdate(proposalId, { status: 'Rejected', reviewNote, reviewedBy }, { new: true });
      if (globalIo) globalIo.emit('proposal-updated', { proposalId, status: 'Rejected' });
      return proposal;
    },

    createInvitation: async (_, args) => {
      const qrCode = `INV-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      return await Rsvp.create({ ...args, qrCode });
    },

    updateInvitationStatus: async (_, { invitationId, status }) => {
      return await Rsvp.findByIdAndUpdate(invitationId, { status }, { new: true });
    },

    deleteInvitation: async (_, { invitationId }) => {
      await Rsvp.findByIdAndDelete(invitationId);
      return true;
    },

    sendInvitation: async (_, { invitationId }) => {
      const inv = await Rsvp.findById(invitationId)
        .populate('proposalId')
        .populate('eventId')
        .populate('memberId');
      if (!inv) throw new Error('Không tìm thấy thư mời.');
      if (inv.email) {
        try {
          await sendEventInvitationEmail(inv.email, {
            guestName: inv.name,
            eventTitle: inv.eventId?.title || inv.proposalId?.title || 'Sự kiện đặc biệt',
            eventDescription: inv.eventId?.description || inv.proposalId?.description || 'Chúng tôi trân trọng kính mời bạn tham dự sự kiện của chúng tôi.',
            eventDate: inv.eventId?.date || inv.proposalId?.expectedDate || 'Đang cập nhật',
            eventLocation: inv.eventId?.location || inv.proposalId?.expectedLocation || 'Đang cập nhật',
            senderName: inv.memberId?.fullname || inv.memberId?.username || 'Ban Tổ Chức',
            senderPhone: inv.memberId?.phone || '',
            senderEmail: inv.memberId?.email || '',
            qrCode: inv.qrCode,
            eventId: inv.eventId?._id?.toString() || inv.proposalId?._id?.toString() || ''
          });
        } catch (err) { console.error('[Email] Send invite failed:', err.message); }
      }
      inv.status = 'Sent';
      inv.sentAt = new Date();
      await inv.save();
      return inv;
    },

    sendAllInvitations: async (_, { memberId, proposalId }) => {
      const query = { memberId, status: 'Pending' };
      if (proposalId) query.proposalId = proposalId;
      const invitations = await Rsvp.find(query)
        .populate('proposalId')
        .populate('eventId')
        .populate('memberId');
      for (const inv of invitations) {
        if (inv.email) {
          try {
            await sendEventInvitationEmail(inv.email, {
              guestName: inv.name,
              eventTitle: inv.eventId?.title || inv.proposalId?.title || 'Sự kiện đặc biệt',
              eventDescription: inv.eventId?.description || inv.proposalId?.description || 'Chúng tôi trân trọng kính mời bạn tham dự sự kiện của chúng tôi.',
              eventDate: inv.eventId?.date || inv.proposalId?.expectedDate || 'Đang cập nhật',
              eventLocation: inv.eventId?.location || inv.proposalId?.expectedLocation || 'Đang cập nhật',
              senderName: inv.memberId?.fullname || inv.memberId?.username || 'Ban Tổ Chức',
              senderPhone: inv.memberId?.phone || '',
              senderEmail: inv.memberId?.email || '',
              qrCode: inv.qrCode,
              eventId: inv.eventId?._id?.toString() || inv.proposalId?._id?.toString() || ''
            });
          } catch (e) {
            console.error('[Email] Send all invite failed:', e.message);
          }
        }
        inv.status = 'Sent';
        inv.sentAt = new Date();
        await inv.save();
      }
      return true;
    },
    createAdminRequest: async (_, args) => {
      const req = await AdminRequest.create(args);
      if (globalIo) globalIo.emit('new-admin-request', { id: req._id.toString(), type: args.type, subject: args.subject });
      return req;
    },
    resolveAdminRequest: async (_, { requestId, adminNote, status }) => {
      const update = { status, adminNote };
      if (status === 'Resolved') update.resolvedAt = new Date();
      return await AdminRequest.findByIdAndUpdate(requestId, update, { new: true });
    },
    memberConfirmContract: async (_, { contractId }) => {
      const contract = await Contract.findById(contractId);
      if (!contract) throw new Error('Không tìm thấy hợp đồng.');
      if (contract.status !== 'Pending') throw new Error('Hợp đồng không ở trạng thái chờ xác nhận.');
      // Auto-assign to a random employee
      const employees = await User.find({ role: { $in: ['EMPLOYEE', 'ORGANIZER'] }, status: 'ACTIVE' });
      let assignedId = null;
      if (employees.length > 0) {
        const randomEmp = employees[Math.floor(Math.random() * employees.length)];
        assignedId = randomEmp._id;
      }
      const updated = await Contract.findByIdAndUpdate(contractId, { status: 'MemberConfirmed', employeeId: assignedId }, { new: true });
      if (globalIo) globalIo.emit('contract-confirmed', { contractId, employeeId: assignedId?.toString() });
      return updated;
    },
    memberRejectContract: async (_, { contractId }) => {
      const contract = await Contract.findById(contractId);
      if (!contract) throw new Error('Không tìm thấy hợp đồng.');
      return await Contract.findByIdAndUpdate(contractId, { status: 'MemberRejected' }, { new: true });
    },
    employeeConfirmContract: async (_, { contractId }) => {
      const contract = await Contract.findById(contractId);
      if (!contract) throw new Error('Không tìm thấy hợp đồng.');
      if (contract.status !== 'MemberConfirmed') throw new Error('Hợp đồng chưa được khách hàng xác nhận.');
      // Get proposal for date/location check
      const proposal = contract.proposalId ? await EventProposal.findById(contract.proposalId) : null;
      // Check date/location conflict before creating event
      if (proposal) {
        const conflicts = await Event.find({
          date: proposal.expectedDate,
          location: { $regex: proposal.expectedLocation, $options: 'i' },
          status: { $in: ['Approved', 'Private'] }
        });
        if (conflicts.length > 0) {
          throw new Error(`TRÙNG LỊCH! Ngày ${proposal.expectedDate} tại "${proposal.expectedLocation}" đã có sự kiện: "${conflicts[0].title}". Vui lòng liên hệ khách hàng để thay đổi.`);
        }
      }
      // Update contract status
      const updated = await Contract.findByIdAndUpdate(contractId, { status: 'EmployeeConfirmed' }, { new: true });
      // Create Event from proposal
      if (proposal) {
        const eventStatus = proposal.eventType === 'PUBLIC' ? 'Approved' : 'Private';
        const event = await Event.create({
          organizerId: contract.memberId,
          categoryId: null,
          title: proposal.title,
          description: proposal.description,
          date: proposal.expectedDate,
          location: proposal.expectedLocation,
          coverImg: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
          eventType: proposal.eventType || 'PUBLIC',
          ticketingEnabled: proposal.eventType === 'PUBLIC',
          status: eventStatus,
        });
        await Contract.findByIdAndUpdate(contractId, { eventId: event._id });
        console.log(`[Event] ✅ Sự kiện "${event.title}" đã được tạo (${eventStatus}). ${eventStatus === 'Approved' ? '🌐 Hiển thị công khai trên trang chủ' : '🔒 Chỉ hiển thị nội bộ'}`);
        if (globalIo) {
          if (eventStatus === 'Approved') globalIo.emit('event-approved', { eventId: event._id.toString(), title: event.title });
          globalIo.emit('event-created-from-contract', { contractId, eventId: event._id.toString(), title: event.title, visibility: eventStatus });
        }
      }
      return updated;
    }
  },

  Invitation: {
    id: (p) => p._id?.toString() || p.id,
    memberId: (p) => p.memberId?.toString(),
    proposalId: (p) => p.proposalId ? p.proposalId.toString() : null,
    eventId: (p) => p.eventId ? p.eventId.toString() : null,
    sentAt: (p) => p.sentAt ? p.sentAt.toISOString() : null,
    createdAt: (p) => p.createdAt ? p.createdAt.toISOString() : null,
    proposalTitle: async (p) => {
      if (!p.proposalId) return null;
      const prop = await EventProposal.findById(p.proposalId);
      return prop ? prop.title : null;
    }
  },

  AdminRequest: {
    id: (p) => p._id?.toString() || p.id,
    memberId: (p) => p.memberId?.toString(),
    createdAt: (p) => p.createdAt ? p.createdAt.toISOString() : null,
    resolvedAt: (p) => p.resolvedAt ? p.resolvedAt.toISOString() : null,
    memberName: async (p) => {
      if (!p.memberId) return '';
      const u = await User.findById(p.memberId);
      return u ? (u.fullname || u.username) : '';
    }
  }
};

let globalIo = null;
const setIo = (io) => { globalIo = io; };

module.exports = { typeDefs, resolvers, setIo };
