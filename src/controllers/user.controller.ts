import { Request, Response } from "express";
import joi from "joi";
import { dbModels } from "../config/db.models.config";

const { Transaction, Beneficiary, User } = dbModels;

export const getTransactions = async (req: Request, res: Response) => {
    try {
        const schema = joi.object({
        page: joi.number().min(1),
        limit: joi.number().min(1),
        });
    
        const { error, value } = schema.validate(req.query);
        if (error) return res.status(400).json({ error: error.message!, message: "Bad Request" });
        const { page = 1, limit = 10 } = value;
    
        const user = req.user;
        if (!user) return res.status(401).json({ message: "Unauthorized", error: "Unauthorized" });
    
        const transactions = await Transaction.find({ userId: user.id })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    
        return res.status(200).json({ message: "Successful", data: { transactions } });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message! });
    }
};

export const addBeneficiary = async (req: Request, res: Response) => {
  try {
    const schema = joi.object({
        name: joi.string().required(),
        matric: joi.string().required(),
        userId: joi.string().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message!, message: "Bad Request" });

    const { name, matric, userId } = value;
    const user = req.user;
    const payload = {
        name,
        matric,
        id: userId,
    }
    if (!user) return res.status(401).json({ message: "Unauthorized", error: "Unauthorized" });
    const beneficiary = await Beneficiary.findOneAndUpdate({ userId }, { $addToSet: { beneficiaries: payload } }, { upsert: true });

    return res.status(200).json({ message: "Successful", data: { beneficiary } });

  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message! });
  }
};

export const getBeneficiaries = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ message: "Unauthorized", error: "Unauthorized" });
        const beneficiary = await Beneficiary.findOne({ userId: user.id });

        return res.status(200).json({ message: "Successful", data: { beneficiary } });
    
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message! });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {

        console.log(req.params);
        const schema = joi.object({
          id: joi.string().required(),
        });
    
        const { error, value } = schema.validate(req.params);
        if (error) return res.status(400).json({ error: error.message!, message: "Bad Request" });
    
        const { id } = value;
        const user = await User.findById(id);
    
        return res.status(200).json({ message: "Successful", data: { user } });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message! });
    }
};

export const getMe = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ message: "Unauthorized", error: "Unauthorized" });
        return res.status(200).json({ message: "Successful", data: { user } });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message! });
    }
};

export const getUserByMatric = async (req: Request, res: Response) => {
  try {
    const schema = joi.object({
        matric: joi.string().required(),
    });

    const { error, value } = schema.validate(req.params);
    if (error) return res.status(400).json({ error: error.message!, message: "Bad Request" });

    const { matric } = value;

    const user = await User.findOne({ matric });
    if (!user) return res.status(404).json({ message: "User not found", error: "User not found" });

    return res.status(200).json({ message: "Successful", data: { user } });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message! });
  }
};
  


