import React, { useState, useEffect } from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Badge,
  IconButton,
  Typography,
  Drawer 
} from '@mui/material';
import { 
  Notifications as NotificationsIcon,
  Build as BuildIcon,
  Speed as SpeedIcon,
  Schedule as ScheduleIcon 
} from '@mui/icons-material';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'service':
        return <BuildIcon />;
      case 'performance':
        return <SpeedIcon />;
      case 'schedule':
        return <ScheduleIcon />;
      default:
        return <NotificationsIcon />;
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    updateUnreadCount();
  };

  const updateUnreadCount = () => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  };

  return (
    <>
      <IconButton color="inherit" onClick={() => setOpen(true)}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Box sx={{ width: 350, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Notifications
          </Typography>
          <List>
            {notifications.map((notification) => (
              <ListItem 
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                sx={{
                  bgcolor: notification.read ? 'transparent' : 'action.hover',
                  cursor: 'pointer'
                }}
              >
                <ListItemAvatar>
                  <Avatar>
                    {getNotificationIcon(notification.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={notification.title}
                  secondary={notification.message}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default NotificationCenter;
