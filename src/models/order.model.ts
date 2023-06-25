import { Schema } from "mongoose";

const OrderSchema = new Schema({
    vendorId: { type: Schema.Types.ObjectId, required: true, ref: 'Vendor' },
    items: { type: [Schema.Types.Mixed], required: true },
    amount: { type: Number, required: true },
    processed: { type: Boolean, default: false, required: true }
}, { timestamps: true });

export default OrderSchema;
