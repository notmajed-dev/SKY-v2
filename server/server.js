import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import routes from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sky-v2';

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', routes);

// MongoDB connection setup (placeholder - not connecting yet)
export const connectDB = async () => {
  try {
    // await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connection ready to be configured');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
};

// Start server
app.listen(PORT, () => {
  console.log(`SKY-v2 Backend server running on port ${PORT}`);
});

export default app;
