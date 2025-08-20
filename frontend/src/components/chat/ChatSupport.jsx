import React, { useState, useEffect, useRef } from 'react';
import { Paper, Box, TextField, IconButton, Typography, Avatar, Fab } from '@mui/material';
import { Send as SendIcon, Chat as ChatIcon, Close as CloseIcon } from '@mui/icons-material';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
const ChatSupport = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const socketRef = useRef();

  const defaultUser = {
    id: 'guest-' + Math.random().toString(36).substr(2, 9),
    name: 'Guest User'
  };

  useEffect(() => {
    socketRef.current = io('http://localhost:5001');
    
    socketRef.current.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => socketRef.current.disconnect();
  }, []);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        text: newMessage,
        userId: defaultUser.id,
        timestamp: new Date(),
        sender: defaultUser.name
      };
      
      socketRef.current.emit('message', messageData);
      setMessages(prev => [...prev, messageData]);
      setNewMessage('');
    }
  };

  return (
    <>
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </Fab>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.3 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              bottom: 100,
              right: 20,
              zIndex: 1000
            }}
          >
            <Paper sx={{ width: 350, height: 500, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2, backgroundColor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Technical Support</Typography>
              </Box>
              
              <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                {messages.map((message, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: message.userId === defaultUser.id ? 'flex-end' : 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', maxWidth: '70%' }}>
                      {message.userId !== defaultUser.id && (
                        <Avatar sx={{ mr: 1 }}>S</Avatar>
                      )}
                      <Box
                        sx={{
                          backgroundColor: message.userId === defaultUser.id ? 'primary.light' : 'grey.100',
                          borderRadius: 2,
                          p: 2,
                        }}
                      >
                        <Typography color={message.userId === defaultUser.id ? 'white' : 'black'}>
                          {message.text}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Box sx={{ p: 2, backgroundColor: 'background.paper' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <IconButton color="primary" onClick={sendMessage}>
                    <SendIcon />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatSupport;