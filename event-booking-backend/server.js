require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const morgan = require('morgan');
const client = require('prom-client');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const connectDB = require('./src/config/db.js');
const { typeDefs, resolvers, setIo } = require('./src/schema.js');

const app = express();
const httpServer = createServer(app);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
const avatarDir = path.join(uploadsDir, 'avatars');
if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir, { recursive: true });
const contractDir = path.join(uploadsDir, 'contracts');
if (!fs.existsSync(contractDir)) fs.mkdirSync(contractDir, { recursive: true });

// Multer config
const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, avatarDir),
    filename: (req, file, cb) => cb(null, `avatar_${Date.now()}${path.extname(file.originalname)}`)
});
const contractStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, contractDir),
    filename: (req, file, cb) => cb(null, `contract_${Date.now()}${path.extname(file.originalname)}`)
});
const uploadAvatar = multer({ storage: avatarStorage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (req, file, cb) => { if (file.mimetype.startsWith('image/')) cb(null, true); else cb(new Error('Only images allowed')); } });
const uploadContract = multer({ storage: contractStorage, limits: { fileSize: 20 * 1024 * 1024 } });

// DevOps: Prometheus Metrics
const register = new client.Registry();
client.collectDefaultMetrics({ register });

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

// Realtime: Socket.io
const io = new Server(httpServer, {
    cors: { origin: '*' }
});

io.on('connection', (socket) => {
    console.log('[Socket] New connection:', socket.id);
});
setIo(io);

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// File upload endpoints
app.post('/upload-avatar', uploadAvatar.single('avatar'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const fileUrl = `/uploads/avatars/${req.file.filename}`;
    res.json({ success: true, fileUrl });
});

app.post('/upload-contract', uploadContract.single('contract'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const fileUrl = `/uploads/contracts/${req.file.filename}`;
    res.json({ success: true, fileUrl, fileName: req.file.originalname });
});

// Routes
app.get('/', (req, res) => {
    res.send('<h1>Event Booking API is running</h1>');
});

const startServer = async () => {
    await connectDB();
    
    // Apollo Server
    const JWT_SECRET = process.env.JWT_SECRET || 'EMS_SUPER_SECRET_KEY';
    const apolloServer = new ApolloServer({ typeDefs, resolvers });
    await apolloServer.start();
    
    app.use('/graphql', expressMiddleware(apolloServer, {
        context: async ({ req }) => {
            const authHeader = req.headers.authorization || '';
            let user = null;
            if (authHeader.startsWith('Bearer ')) {
                const token = authHeader.replace('Bearer ', '');
                try {
                    user = jwt.verify(token, JWT_SECRET);
                } catch(e) {}
            }
            return { user };
        }
    }));
    
    const PORT = process.env.PORT || 4000;
    httpServer.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}`);
        console.log(`🚀 GraphQL at http://localhost:${PORT}/graphql`);
    });
};

startServer();
