import dotenv from 'dotenv';
import http from 'http';
import app from './app.js';
import { connectDB } from './config/db.js';
import { initializeSocket } from './config/socket.js';

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

// Create HTTP server instead of listening directly on app
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

server.listen(PORT, () => {
  console.log(`[SERVER] Running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
