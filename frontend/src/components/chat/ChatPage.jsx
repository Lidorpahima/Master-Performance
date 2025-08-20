import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ConversationList from './ConversationList';
import ChatBox from './ChatBox';
import { useSelector } from 'react-redux';
import apiClient from '../../services/api/axiosConfig';
import { initiateSocketConnection, disconnectSocket } from '../../services/socketService';

const ChatPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Default conversation for demonstration
  const defaultConversation = {
    id: 'default-support',
    name: 'Site Manager',
    type: 'support',
    lastMessage: 'Hello! How can we help you today?'
  };

  useEffect(() => {
    if (!user?.id) return;
    initiateSocketConnection(user.id);
    const setup = async () => {
      if (user?.role !== 'admin') {
        try {
          const { data } = await apiClient.get('/chat/default-admin');
          setSelectedConversation({ otherUserId: data._id, name: data.name });
        } catch (e) {
          console.error('Failed to get default admin', e);
        }
      }
    };
    setup();
    return () => disconnectSocket();
  }, [user]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: 'calc(100vh - 120px)', 
        bgcolor: '#1E1E1E', 
      }}
    >
      <Box
        sx={{
          width: '280px', 
          borderRight: '1px solid #333',
          overflowY: 'auto',
        }}
      >
        {user?.role === 'admin' ? (
          <ConversationList onSelectConversation={handleSelectConversation} />
        ) : (
          <Box sx={{ p: 2, textAlign: 'center', color: 'grey' }}>
            <Box sx={{ p: 2, bgcolor: '#2A2A2A', borderRadius: 1 }}>
              Chat with support
            </Box>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          flexGrow: 1, 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {selectedConversation ? (
          <ChatBox conversation={selectedConversation} />
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'grey' }}>
            Select a conversation from the side to start chatting
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatPage;