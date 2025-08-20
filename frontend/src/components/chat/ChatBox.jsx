
import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, IconButton, Avatar, Divider, Chip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useSelector } from 'react-redux';

const MessageBubble = ({ message, isSender }) => (
  <Box sx={{ display: 'flex', justifyContent: isSender ? 'flex-end' : 'flex-start', mb: 2, px: 2 }}>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isSender ? 'flex-end' : 'flex-start',
        maxWidth: '70%',
      }}
    >
      {!isSender && (
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, ml: 1 }}>
          {message.senderName || 'Support'}
        </Typography>
      )}
      <Box
        sx={{
          p: 2,
          borderRadius: isSender ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
          backgroundColor: isSender ? 'primary.main' : '#2A2A2A',
          color: isSender ? 'white' : 'white',
          maxWidth: '100%',
          border: isSender ? 'none' : '1px solid #333',
          boxShadow: isSender ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
          {message.text}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', opacity: 0.7 }}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Typography>
      </Box>
    </Box>
  </Box>
);

const ChatBox = ({ conversation }) => {
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Mock messages for demonstration
    setMessages([
      { 
        sender: 'adminId', 
        senderName: 'Support Team',
        text: 'Welcome! How can I help you today? Feel free to ask any questions about our services.',
        timestamp: new Date(Date.now() - 300000) // 5 minutes ago
      },
      { 
        sender: user?.id, 
        senderName: user?.name || 'You',
        text: 'Hi! I have a question about vehicle tuning.',
        timestamp: new Date(Date.now() - 180000) // 3 minutes ago
      },
      { 
        sender: 'adminId', 
        senderName: 'Support Team',
        text: 'Great! I\'d be happy to help. What specific information are you looking for?',
        timestamp: new Date(Date.now() - 60000) // 1 minute ago
      },
    ]);
  }, [conversation, user]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const message = {
      sender: user?.id,
      senderName: user?.name || 'You',
      text: newMessage.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Simulate response
      const response = {
        sender: 'adminId',
        senderName: 'Support Team',
        text: 'Thanks for your message! I\'ll get back to you shortly.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file.name);
      // Here you can add logic to handle file upload
      // For now, we'll just add a message indicating file selection
      const fileMessage = {
        sender: user?.id,
        senderName: user?.name || 'You',
        text: `📎 ${file.name}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fileMessage]);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  if (!conversation) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Typography variant="h6" color="text.secondary">Select a conversation to start chatting</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#1A1A1A' }}>
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        borderBottom: '1px solid #333', 
        display: 'flex', 
        alignItems: 'center',
        bgcolor: '#2A2A2A'
      }}>
        <Avatar sx={{ 
          bgcolor: 'primary.main', 
          mr: 2,
          width: 48,
          height: 48,
          fontSize: '1.2rem'
        }}>
          {conversation.name.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight="bold" color="white">
            {conversation.name}
          </Typography>
          <Chip 
            label="Online" 
            size="small" 
            color="success" 
            sx={{ 
              height: 20, 
              fontSize: '0.7rem',
              bgcolor: '#4CAF50',
              color: 'white'
            }} 
          />
        </Box>
      </Box>

      {/* Messages Area */}
      <Box sx={{ 
        flexGrow: 1, 
        p: 1, 
        overflowY: 'auto', 
        bgcolor: '#1A1A1A',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          bgcolor: '#2A2A2A',
        },
        '&::-webkit-scrollbar-thumb': {
          bgcolor: '#555',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          bgcolor: '#777',
        },
      }}>
        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg} isSender={msg.sender === user?.id} />
        ))}
        
        {isTyping && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2, px: 2 }}>
            <Box sx={{ p: 2, borderRadius: '20px 20px 20px 5px', bgcolor: '#2A2A2A', border: '1px solid #333' }}>
              <Typography variant="body2" color="text.secondary">
                Support Team is typing...
              </Typography>
            </Box>
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box sx={{ 
        p: 3, 
        borderTop: '1px solid #333', 
        bgcolor: '#2A2A2A'
      }}>
        <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            onClick={triggerFileUpload}
            sx={{ 
              color: 'primary.main',
              '&:hover': { 
                bgcolor: 'rgba(25, 118, 210, 0.1)',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            <CloudUploadIcon />
          </IconButton>
          
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            multiple
          />
          
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: '#1A1A1A',
                color: 'white',
                '& fieldset': {
                  borderColor: '#555',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
              '& .MuiInputBase-input': {
                color: 'white',
                '&::placeholder': {
                  color: '#999',
                  opacity: 1,
                },
              },
            }}
          />
          
          <IconButton 
            color="primary" 
            type="submit" 
            disabled={!newMessage.trim()}
            sx={{ 
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { 
                bgcolor: 'primary.dark',
                transform: 'scale(1.1)'
              },
              '&:disabled': {
                bgcolor: '#555',
                color: '#999'
              },
              transition: 'all 0.2s ease',
              width: 48,
              height: 48
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatBox;