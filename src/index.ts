import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import router from './routes/index.js';
import { errorHandler } from './middleware/error.js';

dotenv.config();

if (!process.env.NEBIUS_API_KEY) {
  console.error('Error: NEBIUS_API_KEY is not set in .env');
  process.exit(1);
}

const app = express();
const port = process.env.PORT;
const mongoUri = process.env.MONGO_URI;

console.log('MongoUri: ', mongoUri);

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
