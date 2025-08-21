
import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, IconButton, Avatar, Chip, Tooltip, Menu, MenuItem, Link as MuiLink, LinearProgress, Alert } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import { useSelector } from 'react-redux';
import apiClient from '../../services/api/axiosConfig';
import { sendMessage as socketSend, markAsRead, getSocket } from '../../services/socketService';

const MessageBubble = ({ message, isSender }) => {
    const getFileIcon = (fileType) => {
        if (fileType?.startsWith('image/')) return '🖼️';
        if (fileType?.includes('pdf')) return '📄';
        if (fileType?.includes('doc') || fileType?.includes('word')) return '📝';
        if (fileType?.includes('zip') || fileType?.includes('rar')) return '📦';
        if (fileType?.includes('txt')) return '📄';
        return '📎';
    };

    const getFileDisplayName = (fileName) => {
        if (!fileName) return 'File';
        if (fileName.length > 20) {
            return fileName.substring(0, 17) + '...';
        }
        return fileName;
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: isSender ? 'flex-end' : 'flex-start', mb: 2, px: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isSender ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                {!isSender && (
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, ml: 1 }}>
                        {message.senderName || 'Support'}
                    </Typography>
                )}
                <Box sx={{ 
                    p: 2, 
                    borderRadius: isSender ? '20px 20px 5px 20px' : '20px 20px 20px 5px', 
                    backgroundColor: isSender ? 'primary.main' : '#2A2A2A', 
                    color: 'white', 
                    maxWidth: '100%', 
                    border: isSender ? 'none' : '1px solid #333', 
                    boxShadow: isSender ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.1)' 
                }}>
                    {/* File display */}
                    {message.fileUrl && (
                        <Box sx={{ mb: 1, p: 1, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                            {/* File sent indicator */}
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 0.5, 
                                mb: 1, 
                                opacity: 0.7,
                                fontSize: '0.7rem'
                            }}>
                                <span>📎</span>
                                <span>File sent</span>
                            </Box>
                            
                            {message.fileType?.startsWith('image/') ? (
                                <Box sx={{ mb: 1 }}>
                                    <img 
                                        src={message.fileUrl} 
                                        alt={message.fileName || 'uploaded image'} 
                                        style={{ 
                                            maxWidth: '100%', 
                                            maxHeight: '200px', 
                                            borderRadius: 8,
                                            objectFit: 'cover'
                                        }} 
                                    />
                                </Box>
                            ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="h6">{getFileIcon(message.fileType)}</Typography>
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                            {getFileDisplayName(message.fileName)}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {message.fileType || 'Unknown type'}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                            
                            <MuiLink 
                                href={message.fileUrl} 
                                target="_blank" 
                                rel="noopener" 
                                underline="hover" 
                                color="inherit"
                                sx={{ 
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    gap: 0.5,
                                    fontSize: '0.8rem',
                                    opacity: 0.8,
                                    '&:hover': { opacity: 1 }
                                }}
                            >
                                📥 Download
                            </MuiLink>
                        </Box>
                    )}
                    
                    {/* Text message */}
                    {message.text && (
                        <Typography variant="body2" sx={{ lineHeight: 1.4 }}>{message.text}</Typography>
                    )}
                    
                    {/* Timestamp */}
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', opacity: 0.7 }}>
                        {new Date(message.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};


const ChatBox = ({ conversation }) => {
    const { user } = useSelector((state) => state.auth);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
    
    // File upload states
    const [uploadingFile, setUploadingFile] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    useEffect(() => {
        const loadHistory = async () => {
            if (!conversation?.otherUserId) {
                setMessages([]); 
                return;
            }
            try {
                const { data } = await apiClient.get(`/chat/messages/${conversation.otherUserId}`);
                const currentUserId = user?.id || user?._id || user?.userId;
                const mapped = (data?.messages || []).map(m => ({
                    _id: m._id, 
                    sender: m.sender,
                    senderName: String(m.sender) === String(currentUserId) ? 'You' : (conversation.name || 'Support'),
                    text: m.text,
                    fileUrl: m.fileUrl,
                    fileName: m.fileName,
                    fileType: m.fileType,
                    timestamp: m.createdAt,
                }));
                setMessages(mapped);
                
                // Mark all messages as read when entering conversation
                if (data?.conversationId && currentUserId) {
                    markAsRead(data.conversationId, currentUserId);
                }
            } catch (e) {
                console.error('Failed to load messages', e);
                setMessages([]); 
            }
        };

        loadHistory();
    }, [conversation?.otherUserId, user]);

    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const handleNewMessage = (incomingMessage) => {
            const currentUserId = user?.id || user?._id || user?.userId;
            const otherUserId = conversation?.otherUserId;
            
            const isFromOtherUser = String(incomingMessage.sender) === String(otherUserId);
            const isFromMe = String(incomingMessage.sender) === String(currentUserId);
            
            if (isFromOtherUser || isFromMe) {
                setMessages(prevMessages => {
                    if (prevMessages.some(msg => msg._id === incomingMessage._id)) {
                        return prevMessages;
                    }
                    return [...prevMessages, {
                        _id: incomingMessage._id,
                        sender: incomingMessage.sender,
                        senderName: isFromMe ? 'You' : (conversation.name || 'Support'),
                        text: incomingMessage.text,
                        fileUrl: incomingMessage.fileUrl,
                        fileName: incomingMessage.fileName,
                        fileType: incomingMessage.fileType,
                        timestamp: incomingMessage.createdAt,
                    }];
                });
                
                // Mark message as read if it's from other user and we're in the conversation
                if (isFromOtherUser && conversation?.conversationId) {
                    markAsRead(conversation.conversationId, currentUserId);
                }
            }
        };

        socket.on('newMessage', handleNewMessage);

        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    }, [conversation?.otherUserId, conversation?.conversationId, user]); 


    
    // --- 3. Send message ---
    const handleSendMessage = (e) => {
        if (e) e.preventDefault();
        if (!newMessage.trim()) return;

        socketSend({
            senderId: user?.id || user?._id || user?.userId,
            recipientId: conversation.otherUserId,
            text: newMessage.trim(),
        });
        setNewMessage('');
    };

    // --- שאר הפונקציות (נשארות כמעט זהות) ---
    const onKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } };

    // --- File upload handling ---
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Reset states
        setUploadError(null);
        setUploadSuccess(false);
        setUploadingFile(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append('file', file);

            // Upload file to chat endpoint
            const { data } = await apiClient.post('/chat/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });

            // Send message with file
            socketSend({
                senderId: user?.id || user?._id || user?.userId,
                recipientId: conversation.otherUserId,
                fileUrl: data.fileUrl,
                fileName: data.fileName,
                fileType: data.fileType,
            });

            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 3000); // Hide success message after 3 seconds

        } catch (error) {
            console.error('File upload failed:', error);
            setUploadError('Failed to upload file. Please try again.');
        } finally {
            setUploadingFile(false);
            setUploadProgress(0);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const triggerFileUpload = () => { fileInputRef.current?.click(); };
    const openEmoji = (e) => setEmojiAnchorEl(e.currentTarget);
    const closeEmoji = () => setEmojiAnchorEl(null);
    const addEmoji = (emoji) => { setNewMessage(p => `${p}${emoji}`); closeEmoji(); };

    if (!conversation) {
        return <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><Typography variant="h6" color="text.secondary">Select a conversation to start chatting</Typography></Box>;
    }

    // --- JSX with upload indicators ---
    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#1A1A1A' }}>
            {/* ... Header of chatbox ... */}
            <Box sx={{ p: 3, borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', bgcolor: '#2A2A2A' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 48, height: 48, fontSize: '1.2rem' }}>
                    {(conversation.name || 'U').charAt(0)}
                </Avatar>
                <Box>
                    <Typography variant="h6" fontWeight="bold" color="white">{conversation.name || 'User'}</Typography>
                    <Chip label="Online" size="small" color="success" sx={{ height: 20, fontSize: '0.7rem' }} />
                </Box>
            </Box>

            {/* Upload progress and status indicators */}
            {(uploadingFile || uploadError || uploadSuccess) && (
                <Box sx={{ p: 2, borderBottom: '1px solid #333', bgcolor: '#2A2A2A' }}>
                    {uploadingFile && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <CloudUploadIcon color="primary" />
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="body2" color="white" gutterBottom>
                                    Uploading file... {uploadProgress}%
                                </Typography>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={uploadProgress}
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: 'primary.main'
                                        }
                                    }}
                                />
                            </Box>
                        </Box>
                    )}
                    
                    {uploadError && (
                        <Alert severity="error" onClose={() => setUploadError(null)}>
                            {uploadError}
                        </Alert>
                    )}
                    
                    {uploadSuccess && (
                        <Alert severity="success" onClose={() => setUploadSuccess(false)}>
                            File uploaded and sent successfully! 📎
                        </Alert>
                    )}
                </Box>
            )}

            {/* ... Messages area ... */}
            <Box sx={{ flexGrow: 1, p: 1, overflowY: 'auto', bgcolor: '#1A1A1A' }}>
                {messages.map((msg) => (
                    <MessageBubble key={msg._id || Math.random()} message={msg} isSender={String(msg.sender) === String(user?.id || user?._id || user?.userId)} />
                ))}
                <div ref={messagesEndRef} />
            </Box>

            {/* ... Input area ... */}
            <Box sx={{ p: 3, borderTop: '1px solid #333', bgcolor: '#2A2A2A' }}>
                <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title="Upload files">
                        <IconButton 
                            onClick={triggerFileUpload} 
                            color="primary"
                            disabled={uploadingFile}
                        >
                            <CloudUploadIcon />
                        </IconButton>
                    </Tooltip>
                    <input 
                        ref={fileInputRef} 
                        type="file" 
                        onChange={handleFileUpload} 
                        style={{ display: 'none' }}
                        accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
                    />
                    
                    <Tooltip title="Insert emoji">
                        <IconButton onClick={openEmoji}><InsertEmoticonIcon /></IconButton>
                    </Tooltip>
                    <Menu anchorEl={emojiAnchorEl} open={Boolean(emojiAnchorEl)} onClose={closeEmoji}>
                        {['😀','😉','😍','👍','🔥','🚗','✅','🙏','🎉'].map((e) => <MenuItem key={e} onClick={() => addEmoji(e)}>{e}</MenuItem>)}
                    </Menu>

                    <TextField 
                        fullWidth 
                        multiline 
                        maxRows={4} 
                        onKeyDown={onKeyDown} 
                        placeholder="Type your message here..." 
                        value={newMessage} 
                        onChange={(e) => setNewMessage(e.target.value)} 
                        variant="outlined" 
                    />

                    <Tooltip title="Send">
                        <span>
                            <IconButton 
                                color="primary" 
                                type="submit" 
                                disabled={!newMessage.trim() || uploadingFile}
                            >
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