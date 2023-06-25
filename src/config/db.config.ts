
import mongoose from 'mongoose';
import { MONGO_URI } from './env.config';

export const db = mongoose.createConnection(MONGO_URI);

db.asPromise().then((conn) =>
  console.info(
    `MongoDB connected successfully to ${conn.host}:${conn.port}/${conn.db.databaseName}`,
  ),
);

db.on('connected', () => {
  console.info('db connected');
});
