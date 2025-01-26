const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
// Configure Socket.IO with CORS settings to allow requests from React frontend (port 3000)
// This prevents CORS errors when the frontend tries to establish a WebSocket connection
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:3000", 
        methods: ["GET", "POST"]
    }
});

// Socket.IO connection management
io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    // Receive message
    socket.on('sendMessage', (message) => {
        io.emit('message', {
            text: message,
            userId: socket.id,
            timestamp: new Date()
        });
    });

    // On disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
