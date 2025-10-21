import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    TextField,
    Button,
    Box,
    Typography,
    AppBar,
    Toolbar,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Divider,
    Badge,
    Chip
} from '@mui/material';
import {
    Menu as MenuIcon,
    Send as SendIcon,
    Logout as LogoutIcon,
    People as PeopleIcon
} from '@mui/icons-material';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { messagesAPI } from '../services/api';

function Chat() {
    const navigate = useNavigate();
    const { user, token, logout } = useAuth();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [typingUsers, setTypingUsers] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize socket connection
    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        // Load message history
        const loadMessages = async () => {
            try {
                const response = await messagesAPI.getMessages();
                const formattedMessages = response.data.messages.map(msg => ({
                    id: msg._id,
                    text: msg.content,
                    username: msg.sender.username,
                    userId: msg.sender._id,
                    timestamp: msg.timestamp
                }));
                setMessages(formattedMessages);
            } catch (error) {
                console.error('Failed to load messages:', error);
            }
        };

        loadMessages();

        // Connect to socket with authentication
        const newSocket = io('http://localhost:5000', {
            auth: {
                token: token
            }
        });

        newSocket.on('connect', () => {
            console.log('Connected to socket server');
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error.message);
            if (error.message.includes('Authentication error')) {
                logout();
                navigate('/login');
            }
        });

        // Listen for messages
        newSocket.on('message', (newMessage) => {
            setMessages(prevMessages => [...prevMessages, newMessage]);
        });

        // Listen for online users updates
        newSocket.on('update-user-list', (users) => {
            setOnlineUsers(users);
        });

        // Listen for typing indicators
        newSocket.on('user-typing', ({ username }) => {
            setTypingUsers(prev => {
                if (!prev.includes(username)) {
                    return [...prev, username];
                }
                return prev;
            });
        });

        newSocket.on('user-stop-typing', ({ username }) => {
            setTypingUsers(prev => prev.filter(u => u !== username));
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [token, navigate, logout]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && socket) {
            socket.emit('sendMessage', message);
            setMessage('');
            // Stop typing when message is sent
            socket.emit('stop-typing');
        }
    };

    const handleTyping = (e) => {
        setMessage(e.target.value);

        if (!socket) return;

        // Emit typing event
        socket.emit('typing');

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set new timeout to emit stop-typing
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stop-typing');
        }, 1000);
    };

    const handleLogout = () => {
        if (socket) {
            socket.close();
        }
        logout();
        navigate('/login');
    };

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {/* App Bar */}
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={toggleDrawer}
                        sx={{ mr: 2 }}
                    >
                        <Badge badgeContent={onlineUsers.length} color="error">
                            <MenuIcon />
                        </Badge>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Chat Room
                    </Typography>
                    <Typography variant="body2" sx={{ mr: 2 }}>
                        {user?.username}
                    </Typography>
                    <IconButton color="inherit" onClick={handleLogout}>
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Online Users Drawer */}
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
                <Box sx={{ width: 250, p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PeopleIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">Online Users</Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <List>
                        {onlineUsers.length > 0 ? (
                            onlineUsers.map((username, index) => (
                                <ListItem key={index}>
                                    <ListItemText 
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box
                                                    sx={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: '50%',
                                                        bgcolor: 'success.main',
                                                        mr: 1
                                                    }}
                                                />
                                                {username}
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            ))
                        ) : (
                            <Typography variant="body2" color="textSecondary" sx={{ px: 2 }}>
                                No users online
                            </Typography>
                        )}
                    </List>
                </Box>
            </Drawer>

            {/* Main Chat Area */}
            <Container maxWidth="md" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', py: 2, overflow: 'hidden' }}>
                <Paper elevation={3} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Messages Area */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            overflowY: 'auto',
                            p: 2,
                            backgroundColor: '#f5f5f5'
                        }}
                    >
                        {messages.map((msg, index) => {
                            const isCurrentUser = msg.username === user?.username;
                            return (
                                <Box
                                    key={msg.id || index}
                                    sx={{
                                        mb: 2,
                                        display: 'flex',
                                        justifyContent: isCurrentUser ? 'flex-end' : 'flex-start'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            maxWidth: '70%',
                                            p: 1.5,
                                            borderRadius: 2,
                                            backgroundColor: isCurrentUser ? '#1976d2' : '#fff',
                                            color: isCurrentUser ? '#fff' : '#000',
                                            boxShadow: 1
                                        }}
                                    >
                                        <Typography variant="caption" sx={{ fontWeight: 'bold', opacity: 0.8 }}>
                                            {isCurrentUser ? 'You' : msg.username}
                                        </Typography>
                                        <Typography variant="body1" sx={{ mt: 0.5 }}>
                                            {msg.text}
                                        </Typography>
                                        <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
                                            {formatTime(msg.timestamp)}
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Typing Indicator */}
                    {typingUsers.length > 0 && (
                        <Box sx={{ px: 2, py: 1, backgroundColor: '#f5f5f5' }}>
                            <Chip 
                                label={`${typingUsers.join(', ')} ${typingUsers.length === 1 ? 'is' : 'are'} typing...`}
                                size="small"
                                sx={{ backgroundColor: '#e0e0e0' }}
                            />
                        </Box>
                    )}

                    {/* Message Input */}
                    <Box sx={{ p: 2, backgroundColor: '#fff' }}>
                        <form onSubmit={handleSendMessage}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                    fullWidth
                                    placeholder="Type your message..."
                                    value={message}
                                    onChange={handleTyping}
                                    variant="outlined"
                                    size="small"
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    endIcon={<SendIcon />}
                                    disabled={!message.trim()}
                                >
                                    Send
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}

export default Chat;
