import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

// Route Imports
import jobRoutes from './routes/jobRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

// Middleware Imports
import { notFoundMiddleware } from './middleware/notFoundMiddleware.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';

const app = express();

// 1. Global Middleware
app.use(express.json()); // Parse incoming JSON payloads
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payloads
app.use(cookieParser()); // Parse HTTP-only cookies
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
})); // Enable Cross-Origin Resource Sharing with credentials
app.use(helmet()); // Set security HTTP headers
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Log HTTP requests
}

// 2. Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

// 3. API Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/notifications', notificationRoutes);

// 4. Error Handling Middleware
app.use(notFoundMiddleware); // Catches 404s
app.use(errorMiddleware);    // Catches all other errors

export default app;
