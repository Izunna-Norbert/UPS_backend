import { Request, Response } from 'express';
import joi from 'joi';
import { dbModels } from '../config/db.models.config';
import { db } from '../config/db.config';
import { createOrderTransactionHelper, createTranferHelper } from '../helpers/transaction.helper';

const { Transaction, User, Order } = dbModels;

export const createTranfer = async (req: Request, res: Response) => {
  try {
    const schema = joi.object({
      amount: joi.number().required(),
      matric: joi.string().required(),
      remark: joi.string()
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message!, message: 'Bad Request' });
    const { amount, matric, remark } = req.body;

    const findAccount = await User.findOne({ matric });
    if(!findAccount) return res.status(404).json({ message: 'User not found', error: 'User not found' });

    const user = req.user;
    if(!user) return res.status(401).json({ message: 'Unauthorized', error: 'Unauthorized' });

    if (amount > user.balance) return res.status(400).json({ message: 'Insuficient Funds', error: 'Insuficient Funds' });
    
    const session = await db.startSession()
    
    const response = await createTranferHelper({
        from: user.id,
        to: findAccount.id,
        amount,
        session,
        remark,
    });

    if (!response.success) {
        await session.abortTransaction();
        return res.status(400).json({ message: 'Could not complete transfer', error: response.message! })
    }
    await session.commitTransaction();
    return res.status(200).json({ message: 'Transfer Successful', data: { transaction: response.data![0] } });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message! });
  }
}

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const schema = joi.object({
      page: joi.number().min(1),
      limit: joi.number().min(1),
    });

    const { error, value } = schema.validate(req.query);
    if (error) return res.status(400).json({ error: error.message!, message: 'Bad Request' });
    const { page = 1, limit = 10 } = value;

    const user = req.user;

    const transactions = await Transaction.find({ userId: user!.id })
        .skip((parseInt(page) - 1) * limit)
        .limit(parseInt(limit))

    const total = await Transaction.countDocuments({ userId: user!.id });

    return res.status(200).json({
        message: "Successfully fetched Transactions",
        data: {
            transactions,
            total
        }
    });

  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message! });
  }
}

export const getTransaction = async (req: Request, res: Response) => {
  try {
    const schema = joi.object({
      id: joi.string().required(),
    });

    const { error, value } = schema.validate(req.params);
    if (error) return res.status(400).json({ error: error.message!, message: 'Bad Request' });
    const { id } = value;

    const transaction = await Transaction.findById(id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found', error: 'Transaction not found' });

    return res.status(200).json({
        message: "Successfully fetched Transaction",
        data: {
            transaction,
        }
    });

  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message! });
  }
}

export const createOrderTransaction = async (req: Request, res: Response) => {
  try {
    const schema = joi.object({
      orderId: joi.string().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message!, message: 'Bad Request' });

    const { orderId } = value;
    const user = req.user;

    if (!user) return res.status(401).json({ message: 'Unauthorized', error: 'Unauthorized' });

    const order = await Order.findById(orderId);

    if(!order) return res.status(404).json({ message: 'Order not found', error: 'Order not found' });

    const { amount, items, vendorId } = order;

    const session = await db.startSession();

    const payload = {
      userId: user.id,
      amount,
      items,
      orderId,
      session,
      vendorId,
    }

    const response = await createOrderTransactionHelper(payload);

    if (!response.success) {
        await session.abortTransaction();
        return res.status(400).json({ message: 'Could not complete transaction', error: response.message! })
    }

    await session.commitTransaction();
    return res.status(200).json({ message: 'Transaction Successful', data: { transaction: response.data![0] } });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message! });
  }
};


