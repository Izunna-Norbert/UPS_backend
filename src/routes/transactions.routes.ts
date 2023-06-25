import express from 'express';
import { getTransaction, getTransactions, createTranfer, createOrderTransaction } from '../controllers/transaction.controller';
import { authMiddleware } from '../middlewares/auth.middleware';


const router = express.Router();

router.use(authMiddleware);

router.get('/', getTransactions);
router.get('/:id', getTransaction);
router.post('/transfer', createTranfer);
router.post('/order', createOrderTransaction);


export default router;