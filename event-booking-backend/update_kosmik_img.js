const mongoose = require('mongoose');
const { connectDB } = require('./src/config/db');
const Event = require('./src/models/Event');

async function main() {
    await connectDB();
    const result = await Event.findOneAndUpdate(
        { title: 'Siêu Nhạc Hội KOSMIK 2026' },
        { coverImg: 'http://localhost:4000/uploads/kosmik_2026_cover.png' },
        { returnDocument: 'after' }
    );
    if (result) {
        console.log('Updated:', result.title, '->', result.coverImg);
    } else {
        console.log('Event not found!');
    }
    process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
