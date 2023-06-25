import { Schema } from 'mongoose';


const TransactionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId,  ref: 'User' },
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor' },
    amount: { type: Number, required: true },
    type: { type: String, required: true, enum: ['debit', 'credit'] },
    balance: { type: Number, required: true },
    orderId: { type: Schema.Types.ObjectId, required: false, ref: 'Order' },
    remark: { type: String, required: false },
    metadata: {}
}, { timestamps: true });

export default TransactionSchema;
