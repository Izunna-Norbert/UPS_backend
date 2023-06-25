import { Schema } from "mongoose";

const VendorSchema = new Schema({
    name: { type: String, required: true },
    regNo: { type: String, required: true },
    phone: { type: String, required: false },
    balance: { type: Number, default: 10000000 },
}, { timestamps: true });

export default VendorSchema;