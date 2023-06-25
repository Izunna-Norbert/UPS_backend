import { Document } from "mongoose";

export interface MUser extends Document {
  id: string;
  matric: string;
  balance: number;
  name?: string;
  passcode?: string;
  createdAt?: Date;
  updatedAt?: Date;
  comparePasscode(passcode: string): boolean;
}

export interface MVendor extends Document {
  id: string;
  regNo: string;
  name: string;
  balance: number;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}