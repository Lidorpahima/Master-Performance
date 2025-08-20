import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Badge, Divider } from '@mui/material';
import { useSelector } from 'react-redux';
import apiClient from '../../services/api/axiosConfig';

const ConversationList = ({ onSelectConversation }) => {
  const { user } = useSelector((state) => state.auth);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await apiClient.get('/chat/conversations');
        const mapped = data.map((c) => {
          const other = c.participants.find((p) => String(p._id) !== String(user?.id));
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
    fetchConversations();
  }, [user]);

  return (
    <List sx={{ bgcolor: 'background.paper', height: '100%' }}>
      {items.map((conv, index) => (
        <React.Fragment key={conv.id}>
          <ListItem alignItems="flex-start" button onClick={() => onSelectConversation(conv)}>
            <ListItemAvatar>
              <Avatar alt={conv.name} />
            </ListItemAvatar>
            <ListItemText
              primary={<Typography component="span" variant="body1" color="text.primary">{conv.name}</Typography>}
              secondary={
                <Typography component="span" variant="body2" color="text.secondary">{conv.lastMessage}</Typography>
              }
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