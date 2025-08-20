
import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, IconButton, Avatar, Chip, Tooltip, Menu, MenuItem, Link as MuiLink } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
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
          color: 'white',
          maxWidth: '100%',
          border: isSender ? 'none' : '1px solid #333',
          boxShadow: isSender ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        {message.fileUrl && message.fileType?.startsWith('image/') && (
          <Box sx={{ mb: 1 }}>
            <img src={message.fileUrl} alt={message.fileName || 'uploaded'} style={{ maxWidth: '100%', borderRadius: 8 }} />
          </Box>
        )}
        {message.fileUrl && !message.fileType?.startsWith('image/') && (
          <Box sx={{ mb: 1 }}>
            <MuiLink href={message.fileUrl} target="_blank" rel="noopener" underline="hover" color="inherit">
              📎 {message.fileName || 'Attachment'}
            </MuiLink>
          </Box>
        )}
        {message.text && (
          <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
            {message.text}
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', opacity: 0.7 }}>
          {new Date(message.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
  const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setMessages([
      { 
        sender: 'adminId', 
        senderName: 'Support Team',
        text: 'Welcome! How can I help you today? Feel free to ask any questions about our services.',
        timestamp: new Date(Date.now() - 300000)
      },
      { 
        sender: user?.id, 
        senderName: user?.name || 'You',
        text: 'Hi! I have a question about vehicle tuning.',
        timestamp: new Date(Date.now() - 180000)
      },
      { 
        sender: 'adminId', 
        senderName: 'Support Team',
        text: 'Great! I\'d be happy to help. What specific information are you looking for?',
        timestamp: new Date(Date.now() - 60000)
      },
    ]);
  }, [conversation, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!newMessage.trim()) return;
    
    const message = {
      sender: user?.id,
      senderName: user?.name || 'You',
      text: newMessage.trim(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    simulateResponse();
  };

  const simulateResponse = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response = {
        sender: 'adminId',
        senderName: 'Support Team',
        text: 'Thanks for your message! I\'ll get back to you shortly.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, response]);
    }, 1200);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const fileMessage = {
        sender: user?.id,
        senderName: user?.name || 'You',
        text: '',
        fileUrl,
        fileName: file.name,
        fileType: file.type,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fileMessage]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const fileMessage = {
        sender: user?.id,
        senderName: user?.name || 'You',
        text: '',
        fileUrl,
        fileName: file.name,
        fileType: file.type,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fileMessage]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const emojis = ['😀','😉','😍','👍','🔥','🚗','✅','🙏','🎉'];
  const openEmoji = (e) => setEmojiAnchorEl(e.currentTarget);
  const closeEmoji = () => setEmojiAnchorEl(null);
  const addEmoji = (emoji) => {
    setNewMessage((prev) => `${prev}${emoji}`);
    closeEmoji();
  };

  if (!conversation) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Typography variant="h6" color="text.secondary">Select a conversation to start chatting</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#1A1A1A' }} onDrop={handleDrop} onDragOver={handleDragOver}>
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
            sx={{ height: 20, fontSize: '0.7rem', bgcolor: '#4CAF50', color: 'white' }} 
          />
        </Box>
      </Box>

      <Box sx={{ 
        flexGrow: 1, 
        p: 1, 
        overflowY: 'auto', 
        bgcolor: '#1A1A1A',
        '&::-webkit-scrollbar': { width: '8px' },
        '&::-webkit-scrollbar-track': { bgcolor: '#2A2A2A' },
        '&::-webkit-scrollbar-thumb': { bgcolor: '#555', borderRadius: '4px' },
        '&::-webkit-scrollbar-thumb:hover': { bgcolor: '#777' },
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

      <Box sx={{ p: 3, borderTop: '1px solid #333', bgcolor: '#2A2A2A' }}>
        <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Upload files">
            <IconButton onClick={triggerFileUpload} sx={{ color: 'primary.main', '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.1)', transform: 'scale(1.1)' }, transition: 'all 0.2s ease' }}>
              <CloudUploadIcon />
            </IconButton>
          </Tooltip>
          <input ref={fileInputRef} type="file" onChange={handleFileUpload} style={{ display: 'none' }} multiple />

          <Tooltip title="Insert emoji">
            <IconButton onClick={openEmoji} sx={{ color: '#bbb', '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' } }}>
              <InsertEmoticonIcon />
            </IconButton>
          </Tooltip>
          <Menu anchorEl={emojiAnchorEl} open={Boolean(emojiAnchorEl)} onClose={closeEmoji} sx={{ '& .MuiPaper-root': { bgcolor: '#2A2A2A' } }}>
            {emojis.map((e) => (
              <MenuItem key={e} onClick={() => addEmoji(e)} sx={{ color: 'white' }}>{e}</MenuItem>
            ))}
          </Menu>

          <TextField
            fullWidth
            multiline
            minRows={1}
            maxRows={4}
            onKeyDown={onKeyDown}
            variant="outlined"
            placeholder="Type your message here... (Enter to send, Shift+Enter for newline)"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: '#1A1A1A',
                color: 'white',
                '& fieldset': { borderColor: '#555' },
                '&:hover fieldset': { borderColor: 'primary.main' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
              },
              '& .MuiInputBase-input': { color: 'white', '&::placeholder': { color: '#999', opacity: 1 } },
            }}
          />

          <Tooltip title="Send">
            <span>
              <IconButton color="primary" type="submit" disabled={!newMessage.trim()} sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark', transform: 'scale(1.1)' }, '&:disabled': { bgcolor: '#555', color: '#999' }, transition: 'all 0.2s ease', width: 48, height: 48 }}>
                <SendIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatBox;