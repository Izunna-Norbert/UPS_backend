import { Request, Response } from 'express';
import joi from 'joi';
import jwt from 'jsonwebtoken';
import { dbModels } from '../config/db.models.config';

const { Order, Vendor } = dbModels;

export const createVendor = async (req: Request, res: Response) => {
    try {
      const schema = joi.object({
        name: joi.string().required(),
        regNo: joi.string().required(),
        phone: joi.string()
      });

      const { error, value } = schema.validate(req.body);
      if (error) return res.status(400).json({ error: error.message!, message: 'Bad Request' });
      const { name, regNo, phone} = value;

      const findVendor = await Vendor.findOne({ regNo });

      if (findVendor) return res.status(400).json({ message: 'Vendor already exists' });

      const vendor = await Vendor.create({
        name, regNo, phone
      });

      return res.status(201).json({ message: 'Created vendor successfully', data: vendor })
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error', error: error.message! });
    }
}

export const authorizeVendor = async (req: Request, res: Response) => {
    try {
      const schema = joi.object({
        regNo: joi.string().required(),
      });

      const { error, value } = schema.validate(req.body);
      if (error) return res.status(400).json({ error: error.message!, message: 'Bad Request' });
      const { regNo } = value;

      const findVendor = await Vendor.findOne({ regNo });

      if (!findVendor) return res.status(400).json({ message: 'Vendor not found' });

      const token = jwt.sign({ id: findVendor.id }, process.env.JWT_SECRET!);

      return res.status(200).json({ message: 'Authorized', data: { token } })
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error', error: error.message! });
    }
}

export const createOrder = async (req: Request, res: Response) => {
    try {
      const schema = joi.object({
        amount: joi.number().required(),
        items: joi.array().items(joi.any()).required(),
      });
  
      const { error, value } = schema.validate(req.body);
      if (error) return res.status(400).json({ error: error.message!, message: 'Bad Request' });
      const { amount, items } = value;

      const vendor = req.vendor;
      if(!vendor) return res.status(400).json({ message: 'Vendor not found' });

      const order = await Order.create({
        amount,
        items,
        vendorId: vendor.id,
      });

      return res.status(201).json({ message: 'Order created successfully', order });

    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error', error: error.message! });
    }
}

export const getOrder = async (req: Request, res: Response) => {
    try {
      const schema = joi.object({
        id: joi.string().required(),
      });
  
      const { error, value } = schema.validate(req.params);
      if (error) return res.status(400).json({ error: error.message!, message: 'Bad Request' });
      const { id } = value;

      const order = await Order.findById(id);

      if (!order) return res.status(404).json({ message: 'Order not found' });

      return res.status(200).json({ message: 'Order found', order });

    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error', error: error.message! });
    }
}

export const getOrders = async (req: Request, res: Response) => {
    try {
      const vendor = req.vendor;
      if (!vendor) return res.status(400).json({ message: 'Vendor not found' });
      const orders = await Order.find({ vendorId: vendor!.id });
      return res.status(200).json({ message: 'Orders found', orders });

    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error', error: error.message! });
    }
}

export const getVendor = async (req: Request, res: Response) => {
    try {
      const vendor = req.vendor;
      if (!vendor) return res.status(400).json({ message: 'Vendor not found' });
      return res.status(200).json({ message: 'Vendor found', vendor });

    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error', error: error.message! });
    }
}

export const getVendorById = async (req: Request, res: Response) => {
  try {
    const schema = joi.object({
        id: joi.string().required(),
    });

    const { error, value } = schema.validate(req.params);
    if (error) return res.status(400).json({ error: error.message!, message: 'Bad Request' });

    const { id } = value;

    const vendor = await Vendor.findById(id);

    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    return res.status(200).json({ message: 'Vendor found', vendor });

  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message! });
  }
}