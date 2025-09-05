import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import generateRoute from './routes/generate.js';
import authRoute from './routes/auth.js';
import ImageRoute from './routes/Image.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)

  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

  const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/generate', generateRoute);
app.use('/api/auth', authRoute);
app.use('/api/images', ImageRoute);

app.get('/', (req, res) => res.send('PromptCraft API running ✅'));
app.listen(5002, () => console.log('Server running on http://localhost:5002'));
