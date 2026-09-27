import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('\n⚠️ [Database Warning] MONGODB_URI is not defined in environment variables.');
    console.warn('⚠️ MongoDB Atlas connection will be skipped. Provide MONGODB_URI in backend/.env to persist data.\n');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ [MongoDB Connected] Host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ [MongoDB Connection Error] ${error.message}`);
    // Do not crash the entire process, allow server to run and return friendly errors
    return null;
  }
};
