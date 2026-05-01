import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

let socket = null;

export const initializeSocket = (token) => {
  if (!token) {
    return null;
  }

  // Disconnect existing socket if any
  if (socket) {
    socket.disconnect();
  }

  // Create new socket connection with auth token
  socket = io(SOCKET_URL, {
    auth: {
      token
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });

  // Connection event handlers
  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => {
  return socket;
};

export const subscribeToNotifications = (callback) => {
  if (!socket) {
    return;
  }

  socket.on('new_notification', (data) => {
    callback(data);
  });
};

export const unsubscribeFromNotifications = () => {
  if (!socket) return;
  socket.off('new_notification');
};

export default {
  initializeSocket,
  disconnectSocket,
  getSocket,
  subscribeToNotifications,
  unsubscribeFromNotifications
};
