import React, { useEffect, useContext } from 'react';
import { Badge, IconButton } from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { NotificationContext } from '../NotificationContext'; // Import NotificationContext
import { io } from 'socket.io-client'; // Import socket.io-client

const Topbar = () => {
  const { notificationCount, incrementNotification } = useContext(NotificationContext);

  useEffect(() => {
    const socket = io('http://localhost:3001'); // Connect to the backend WebSocket server

    // Listen for the "newContribution" event
    socket.on('newContribution', (data) => {
      console.log('Received notification:', data);
      incrementNotification(); // Increment notification count
    });

    return () => {
      socket.disconnect(); // Cleanup on component unmount
    };
  }, [incrementNotification]);

  return (
    <IconButton>
      <Badge badgeContent={notificationCount} color="error">
        <NotificationsOutlinedIcon />
      </Badge>
    </IconButton>
  );
};

export default Topbar;
