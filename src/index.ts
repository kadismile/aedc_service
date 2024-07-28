import mongoose from 'mongoose';

import app from './app.js';
import Logger from './libs/logger.js';
import { seedDBdata } from './models/db_seed.js';

const MONGO_URL = process.env.MONGO_URL || '';
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 8000;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    seedDBdata();
    Logger.info(`Connected to MongoDB at ${NODE_ENV} environment`);
  })
  .catch(error => {
    Logger.error('Error connecting to the database', error);
  });

app.listen(PORT, () => Logger.info(`🌏 Server running on PORT: ${PORT}`));
