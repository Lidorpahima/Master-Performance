import React from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Badge, Divider } from '@mui/material';

const conversations = [
  { id: 1, name: 'Lidor Pahima', lastMessage: 'Hey, can you check my file?', unread: 2 },
  { id: 2, name: 'Jane Doe', lastMessage: 'Thanks for the help!', unread: 0 },
  { id: 3, name: 'John Smith', lastMessage: 'Perfect!', unread: 0 },
];

const ConversationList = ({ onSelectConversation }) => {
  return (
    <List sx={{ bgcolor: 'background.paper', height: '100%' }}>
      {conversations.map((conv, index) => (
        <React.Fragment key={conv.id}>
          <ListItem 
            alignItems="flex-start" 
            button 
            onClick={() => onSelectConversation(conv)}
          >
            <ListItemAvatar>
              <Avatar alt={conv.name} src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography component="span" variant="body1" color="text.primary">
                  {conv.name}
                </Typography>
              }
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    {conv.lastMessage}
                  </Typography>
                </React.Fragment>
              }
            />
            {conv.unread > 0 && <Badge badgeContent={conv.unread} color="error" />}
          </ListItem>
          {index < conversations.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default ConversationList;