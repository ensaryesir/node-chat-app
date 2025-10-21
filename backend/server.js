const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');

// Import models
const Message = require('./models/Message');
const User = require('./models/User');

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is running' });
});

const server = http.createServer(app);

// Configure Socket.IO with CORS settings
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:3000", 
        methods: ["GET", "POST"]
    }
});

// Store connected users: { userId: { socketId, username } }
const connectedUsers = new Map();

// Socket.IO middleware for authentication
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        
        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return next(new Error('Authentication error: User not found'));
        }

        // Attach user to socket
        socket.userId = user._id.toString();
        socket.username = user.username;
        
        next();
    } catch (error) {
        console.error('Socket authentication error:', error.message);
        next(new Error('Authentication error: Invalid token'));
    }
});

// Socket.IO connection management
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.username} (${socket.userId})`);

    // Add user to connected users list
    connectedUsers.set(socket.userId, {
        socketId: socket.id,
        username: socket.username
    });

    // Broadcast updated user list to all clients
    io.emit('update-user-list', Array.from(connectedUsers.values()).map(u => u.username));

    // Receive message
    socket.on('sendMessage', async (messageContent) => {
        try {
            // Save message to database
            const message = new Message({
                sender: socket.userId,
                content: messageContent
            });
            await message.save();

            // Populate sender info
            await message.populate('sender', 'username');

            // Broadcast message to all clients
            io.emit('message', {
                id: message._id,
                text: message.content,
                username: message.sender.username,
                userId: socket.userId,
                timestamp: message.timestamp
            });
        } catch (error) {
            console.error('Send message error:', error);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });

    // Typing indicator
    socket.on('typing', () => {
        socket.broadcast.emit('user-typing', { username: socket.username });
    });

    socket.on('stop-typing', () => {
        socket.broadcast.emit('user-stop-typing', { username: socket.username });
    });

    // On disconnect
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.username} (${socket.userId})`);
        
        // Remove user from connected users list
        connectedUsers.delete(socket.userId);
        
        // Broadcast updated user list
        io.emit('update-user-list', Array.from(connectedUsers.values()).map(u => u.username));
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
