import React, { useState, useEffect } from 'react';
import { Container, Paper, TextField, Button, Box, Typography } from '@mui/material';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    // Receive message
    socket.on('message', (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('sendMessage', message);
      setMessage('');
    }
  };

  const handleJoinChat = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsJoined(true);
    }
  };

  if (!isJoined) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Join Chat
          </Typography>
          <form onSubmit={handleJoinChat}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Join
            </Button>
          </form>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Chat Room - {username}
        </Typography>
        <Box
          sx={{
            height: '60vh',
            overflowY: 'auto',
            mb: 2,
            p: 2,
            backgroundColor: '#f5f5f5',
            borderRadius: 1
          }}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                mb: 1,
                p: 1,
                backgroundColor: msg.userId === socket.id ? '#e3f2fd' : '#fff',
                borderRadius: 1,
                maxWidth: '80%',
                ml: msg.userId === socket.id ? 'auto' : 0
              }}
            >
              <Typography variant="body2" color="textSecondary">
                {msg.userId === socket.id ? 'You' : 'User'}
              </Typography>
              <Typography variant="body1">{msg.text}</Typography>
              <Typography variant="caption" color="textSecondary">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </Typography>
            </Box>
          ))}
        </Box>
        <form onSubmit={handleSendMessage}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              label="Your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary">
              Send
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default App;
