import React, { useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import ConversationList from './ConversationList';
import ChatBox from './ChatBox';
import { useSelector } from 'react-redux';

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

  // Here you can add logic to determine the initial conversation to load (if any)
  useEffect(() => {
    // For customers, automatically set the default support conversation
    if (user?.role !== 'admin') {
      setSelectedConversation(defaultConversation);
    }
  }, [user]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: 'calc(100vh - 120px)', // Reduced height from 64px to 120px for more compact view
        bgcolor: '#1E1E1E', // Dark background to match the rest of the page
      }}
    >
      <Box
        sx={{
          width: '280px', // Slightly reduced width from 300px
          borderRight: '1px solid #333',
          overflowY: 'auto',
        }}
      >
        {/* Conversation list (if relevant for this user) */}
        {user?.role === 'admin' ? (
          <ConversationList onSelectConversation={handleSelectConversation} />
        ) : (
          <Box sx={{ p: 2, textAlign: 'center', color: 'grey' }}>
            {/* For customers, show the default support conversation */}
            <Box 
              sx={{ 
                p: 2, 
                bgcolor: '#2A2A2A', 
                borderRadius: 1, 
                cursor: 'pointer',
                '&:hover': { bgcolor: '#3A3A3A' }
              }}
              onClick={() => handleSelectConversation(defaultConversation)}
            >
              <Box sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                {defaultConversation.name}
              </Box>
              <Box sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
                {defaultConversation.lastMessage}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          flexGrow: 1, // ChatBox will take up all remaining space
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