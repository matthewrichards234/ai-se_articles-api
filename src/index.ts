import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import router from './routes/index.js';
import { errorHandler } from './middleware/error.js';

const app = express();
const port = 3000;
const mongoUri = 'mongodb://127.0.0.1:27017/articles';

app.use(express.json());

mongoose
  .connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error', err));

app.get('/health', (_, res) => {
  res.json({
    status: 'ok',
    port: port,
    mongoUri: mongoUri,
  });
});

app.use(router);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
