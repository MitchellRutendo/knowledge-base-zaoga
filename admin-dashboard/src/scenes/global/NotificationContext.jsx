import React, { createContext, useState } from 'react';

export const NotificationContext = createContext(); // Create the context

export const NotificationProvider = ({ children }) => {
  const [notificationCount, setNotificationCount] = useState(0);

  const incrementNotification = () => {
    setNotificationCount((prevCount) => prevCount + 1); // Function to increment notifications
  };

  return (
    <NotificationContext.Provider value={{ notificationCount, incrementNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
