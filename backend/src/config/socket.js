import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true
    }
  });

  // Socket Authentication Middleware
  io.use((socket, next) => {
    try {
      // 1. Check for token in cookies
      const cookies = cookie.parse(socket.request.headers.cookie || '');
      const token = cookies.jwt;

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 3. Attach user ID to socket
      socket.userId = decoded.id;
      next();
    } catch (err) {
      console.error('[SOCKET] Auth error:', err.message);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`[SOCKET] User connected: ${socket.userId}`);
    
    // Join a room specific to this user ID
    // This allows sending notifications to a user across multiple devices/tabs
    socket.join(socket.userId);

    socket.on('disconnect', () => {
      console.log(`[SOCKET] User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

// Getter for the io instance to use in services
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized!');
  }
  return io;
};
