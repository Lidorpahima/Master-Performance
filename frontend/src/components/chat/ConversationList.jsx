import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Badge, Divider } from '@mui/material';
import { useSelector } from 'react-redux';
import apiClient from '../../services/api/axiosConfig';
import { getSocket } from '../../services/socketService';

const ConversationList = ({ onSelectConversation }) => {
  const { user } = useSelector((state) => state.auth);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await apiClient.get('/chat/conversations');
        const mapped = data.map((c) => {
          const currentUserId = user?.id || user?._id || user?.userId;
          const other = c.participants.find((p) => String(p._id) !== String(currentUserId));
          return {
            id: c._id,
            otherUserId: other?._id,
            name: `${other?.firstName || ''} ${other?.lastName || ''}`.trim() || 'User',
            lastMessage: c.lastMessage?.text || '',
            unread: c.unreadCount || 0,
          };
        });
        setItems(mapped);
      } catch (e) {
        console.error('Failed to load conversations', e);
      }
    };
    if (user?.role === 'admin') {
      fetchConversations();
    } else {
      setItems([]);
    }
  }, [user]);

  // Listen for new messages and update unread counts
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = (incomingMessage) => {
      const currentUserId = user?.id || user?._id || user?.userId;
      
      // Only update if message is from someone else
      if (String(incomingMessage.sender) !== String(currentUserId)) {
        setItems(prevItems => 
          prevItems.map(item => {
            // Find conversation by checking if the sender is the other user in this conversation
            if (String(item.otherUserId) === String(incomingMessage.sender)) {
              return { ...item, unread: item.unread + 1 };
            }
            return item;
          })
        );
      }
    };

    const handleMessagesMarkedAsRead = (data) => {
      // Update unread count when messages are marked as read
      setItems(prevItems => 
        prevItems.map(item => {
          if (item.id === data.conversationId) {
            // Reset unread count for this conversation
            return { ...item, unread: 0 };
          }
          return item;
        })
      );
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('messagesMarkedAsRead', handleMessagesMarkedAsRead);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('messagesMarkedAsRead', handleMessagesMarkedAsRead);
    };
  }, [user]);

  const handleConversationSelect = (conversation) => {
    // Mark conversation as read by resetting unread count immediately
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === conversation.id 
          ? { ...item, unread: 0 }
          : item
      )
    );
    
    // Also mark messages as read on the server if we have conversationId
    if (conversation.id && conversation.id !== conversation.otherUserId) {
      const socket = getSocket();
      if (socket) {
        const currentUserId = user?.id || user?._id || user?.userId;
        socket.emit('markAsRead', { 
          conversationId: conversation.id, 
          userId: currentUserId 
        });
      }
    }
    
    onSelectConversation(conversation);
  };

  return (
    <List sx={{ bgcolor: 'background.paper', height: '100%' }}>
      {items.map((conv, index) => (
        <React.Fragment key={conv.id}>
          <ListItem alignItems="flex-start" button onClick={() => handleConversationSelect(conv)}>
            <ListItemAvatar>
              <Avatar alt={conv.name} />
            </ListItemAvatar>
            <ListItemText
              primary={<Typography component="span" variant="body1" color="text.primary">{conv.name}</Typography>}
              secondary={
                <Typography component="span" variant="body2" color="text.secondary">{conv.lastMessage}</Typography>}
            />
            {conv.unread > 0 && <Badge badgeContent={conv.unread} color="error" />}
          </ListItem>
          {index < items.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default ConversationList;