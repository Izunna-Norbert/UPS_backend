import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { MUser } from "./interfaces/model.interface";

const UserSchema = new mongoose.Schema<MUser>({
   matric: { type: String, required: true, unique: true },
   passcode: { type: String, required: true },
   name: { type: String, uppercase: true, required: true },
   balance: { type: Number, required: true, default: 1000000 },
}, { timestamps: true });

UserSchema.index({ matric: 1 }, { unique: true });

UserSchema.pre('save', function (next) {
    const user = this;
    const passcode: any = user.passcode;
    if (!user.isModified('passcode')) return next();
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(passcode, salt, (err, hash) => {
            if (err) return next(err);
            user.passcode = hash;
            next();
        });
    });
})

UserSchema.methods.comparePasscode = function (passcode: string) {
    return bcrypt.compareSync(passcode, this.passcode);
}

UserSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.passcode;
    obj.id = obj._id;
    delete obj._id;
    return obj;
}

export default UserSchema;