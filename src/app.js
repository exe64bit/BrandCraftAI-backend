import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// CORS configuration (no credentials: true when origin is wildcard '*')
const frontendUrl = process.env.FRONTEND_URL || '*';
app.use(
  cors({
    origin: frontendUrl === '*' ? '*' : frontendUrl,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Brand Intelligence & Brand Builder Platform Backend',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', aiRoutes);
app.use('/api/projects', projectRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
