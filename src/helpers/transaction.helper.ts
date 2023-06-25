import { ClientSession } from "mongoose";
import { dbModels } from "../config/db.models.config";
const { Transaction, User, Vendor } = dbModels;

interface ICreateTransfer {
    from: string;
    to: string;
    amount: number;
    session: ClientSession;
    remark?: string;
}

interface ICreateOrderTransactionHelper {
    userId: string;
    amount: number;
    items: any[];
    orderId: string;
    session: ClientSession;
    vendorId: any;
}

export const createTranferHelper = async (payload: ICreateTransfer) => {
  try {
    const transactions = [];
    const userA = await User.findById(payload.from);
    if (!userA) return { success: false, message: 'Initiator not found'}
    if (payload.amount > userA.balance) return { success: false, message: 'Insufficient Funds'}

    const userB = await User.findById(payload.to);
    if (!userB) return { success: false, message: 'Recipient not found'}

    userA.balance -= payload.amount;
    userB.balance += payload.amount;

    const debit = new Transaction({
        userId: userA.id,
        amount: payload.amount,
        metadata: {
            subType: 'transfer',
            matric: userB.matric,
            name: userB.name,
            narration: `Transfer to ${userB.matric}`,
        },
        balance: userA.balance,
        type: 'debit',
        remark: payload.remark!,
    });
    const credit = new Transaction({
        userId: userB.id,
        amount: payload.amount,
        metadata: {
            subType: 'receive',
            matric: userA.matric,
            name: userA.name,
            narration: `Transfer from ${userA.matric}`,
        },
        balance: userB.balance,
        type: 'credit',
        remark: payload.remark!,
    });

    transactions.push(debit, credit);

    await Promise.all([
        userA.save({ session: payload.session }),
        userB.save({ session: payload.session }),
        Transaction.insertMany(transactions, { session: payload.session }),
    ]);

    return {
        success: true,
        data: transactions,
    }

  } catch(error: any) {
    console.error(error);
    return {
        success: false,
        message: error.message!,
    }
  }
}

export const createOrderTransactionHelper = async (payload: ICreateOrderTransactionHelper) => {
  try {
    const transactions = [];
    const user = await User.findById(payload.userId);
    if (!user) return { success: false, message: 'User not found'}
    if (payload.amount > user.balance) return { success: false, message: 'Insufficient Funds' }

    const vendor = await Vendor.findById(payload.vendorId);
    if (!vendor) return { success: false, message: 'Vendor not found'}

    user.balance -= payload.amount;
    vendor.balance += payload.amount;

    const debit = new Transaction({
        userId: user.id,
        amount: payload.amount,
        metadata: {
            subType: 'order',
            vendorId: vendor.id,
            name: vendor.name,
            items: payload.items,
            narration: `Payment to ${vendor.name} for items`,
        },
        balance: user.balance,
        type: 'debit',
        remark: `Order Payment to ${vendor.name}`,
    });

    const credit = new Transaction({
        vendorId: vendor.id,
        amount: payload.amount,
        metadata: {
            matric: user.matric,
            name: user.name,
            items: payload.items,
            narration: `Payment from ${user.matric} for items`,
        },
        balance: vendor.balance,
        type: 'credit',
        remark: `Order Payment from ${user.matric}`,
    });

    transactions.push(debit, credit);

    await Promise.all([
        user.save({ session: payload.session }),
        vendor.save({ session: payload.session }),
        Transaction.insertMany(transactions, { session: payload.session }),
    ]);

    return {
        success: true,
        data: transactions,
    }


  } catch(error: any) {
    console.error(error);
    return {
        success: false,
        message: error.message!,
    }
  }
}