import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Connect to MongoDB Atlas (if URI configured) and start Express server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 [BrandCraft AI Backend] Running on http://localhost:${PORT}`);
    console.log(`📡 [API Health Check] http://localhost:${PORT}/api/health`);
    console.log(`======================================================\n`);
  });
};

startServer().catch((err) => {
  console.error('Fatal Server Startup Error:', err);
  process.exit(1);
});
