import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { PORT } from './config/env.config';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import transactionRouter from './routes/transactions.routes';
import vendorRouter from './routes/vendor.routes';

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/transaction', transactionRouter);
app.use('/api/vendor', vendorRouter);


app.listen(PORT || 3003, () => {
    console.log(`Server is running on port ${PORT}`);
});
