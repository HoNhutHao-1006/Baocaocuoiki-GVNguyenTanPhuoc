const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
    try {
        let mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventbooking";
        try {
            await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
            console.log(`📦 Kết nối MongoDB Local thành công tại ${mongoUri}`);
        } catch(e) {
            console.log(`⚠️ Không tìm thấy MongoDB Local. Chuyển sang MongoDB Memory Server...`);
            mongoServer = await MongoMemoryServer.create();
            mongoUri = mongoServer.getUri();
            await mongoose.connect(mongoUri);
            console.log(`📦 Kết nối MongoDB Memory Server thành công tại ${mongoUri}`);
        }
    } catch (err) {
        console.error('Lỗi kết nối MongoDB:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
module.exports.connectDB = connectDB;
