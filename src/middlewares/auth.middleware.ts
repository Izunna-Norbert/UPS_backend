import { Request, Response, NextFunction } from 'express';
import joi from 'joi';
import jwt from 'jsonwebtoken';
import { dbModels } from '../config/db.models.config';


const { User, Vendor } = dbModels;

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const schema = joi.object({
            authorization: joi.string().required(),
        }).unknown()
        const { error, value } = schema.validate(req.headers);
        if (error) return res.status(400).json({ error: error.message!, message: 'Bad Request' });
        const { authorization } = value;
    
        const token = authorization.split(' ')[1];
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: 'User not found', error: 'User not found' });
        req.user = user;
        next();
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message! });
    }
};

export const authVendorMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const schema = joi.object({
            authorization: joi.string().required(),
        }).allow(joi.object().unknown())
        const { error, value } = schema.validate(req.headers);
        if (error) return res.status(400).json({ error: error.message!, message: 'Bad Request' });
        const { authorization } = value;
    
        const token = authorization.split(' ')[1];
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const vendor = await Vendor.findById(decoded.id);
        if (!vendor) return res.status(404).json({ message: 'Vendor not found', error: 'Vendor not found' });
        req.vendor = vendor;
        next();
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message! });
    }
};