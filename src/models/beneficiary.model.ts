import { Schema } from "mongoose";

const BeneficiarySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    beneficiaries: [{
        name: { type: String, required: true },
        matric: { type: String, required: true },
        id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    }],
}, { timestamps: true });

export default BeneficiarySchema;