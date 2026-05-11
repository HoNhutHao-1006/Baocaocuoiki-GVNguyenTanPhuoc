const Event = require('../models/Event');
const TicketTier = require('../models/TicketTier');

const getAllEvents = async (filter = {}, page = 1, limit = 10) => {
    let query = Event.find(filter);
    if (page && limit) {
        query = query.skip((page - 1) * limit).limit(limit);
    }
    return await query;
};

const getEventById = async (id) => {
    return await Event.findById(id);
};

const createEvent = async (eventData) => {
    return await Event.create({ ...eventData, status: 'Pending' });
};

const updateEventStatus = async (eventId, status) => {
    return await Event.findByIdAndUpdate(eventId, { status }, { new: true });
};

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEventStatus
};
