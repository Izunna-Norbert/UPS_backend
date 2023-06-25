import BeneficiarySchema from "../models/beneficiary.model";
import { MUser, MVendor } from "../models/interfaces/model.interface";
import OrderSchema from "../models/order.model";
import TransactionSchema from "../models/transaction.model";
import UserSchema from "../models/user.model";
import VendorSchema from "../models/vendor.model";
import { db } from "./db.config";

export const dbModels = {
    User: db.model<MUser>('User', UserSchema),
    Order: db.model('Order', OrderSchema),
    Transaction: db.model('Transaction', TransactionSchema),
    Vendor: db.model<MVendor>('Vendor', VendorSchema),
    Beneficiary: db.model('Beneficiary', BeneficiarySchema),
};