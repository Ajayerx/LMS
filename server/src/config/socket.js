import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io = null;

export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Socket authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error: Token required'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      socket.user = decoded;
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join user's personal room for targeted notifications
    socket.join(socket.userId);

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

// Helper function to emit notification to specific user
export const emitNotification = (userId, notification) => {
  if (!io) {
    console.warn('Socket.io not initialized, cannot emit notification');
    return;
  }

  io.to(userId).emit('new_notification', {
    notification,
    timestamp: new Date().toISOString()
  });

  console.log(`Notification emitted to user ${userId}`);
};

export default {
  initializeSocket,
  getIO,
  emitNotification
};
