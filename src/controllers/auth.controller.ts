import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import joi from "joi";
import { dbModels } from "../config/db.models.config";

const { User } = dbModels;

export const register = async (req: Request, res: Response) => {
  try {
    const schema = joi.object({
      matric: joi.string().required(),
      name: joi.string().required().uppercase(),
      passcode: joi.string().required().min(4).max(4)
    });
    
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message!, message: 'Bad Request' });

    const { matric, passcode, name } = req.body;

    const findUser = await User.findOne({ matric });

    if (findUser) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({ matric, passcode, name });
    await newUser.save();

    return res.status(201).json({ message: 'User created successfully', data: newUser });

  } catch (error: any) {
    return res.status(500).json({ error: error.message!, message: 'An error occurred' });
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { matric, passcode } = req.body;
    if (!matric || !passcode) return res.status(400).json({ message: 'Please provide matric and passcode' });

    const user = await User.findOne({ matric });

    if (!user) return res.status(400).json({ message: 'User does not exist' });

    const isMatch = user.comparePasscode(passcode);

    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

    return res.status(200).json({ message: 'User logged in successfully', data: { token, user } });

  } catch (error: any) {
    return res.status(500).json({ error: error.message!, message: 'An error occurred' });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({ message: 'User found', data: user });

  } catch (error: any) {
    return res.status(500).json({ error: error.message!, message: 'An error occurred' });
  }
};

export const checkMatric = async (req: Request, res: Response) => {
  try {

    const schema = joi.object({
      matric: joi.string().required(),
    });

    const { error } = schema.validate(req.query);
    if (error) return res.status(400).json({ error: error.message!, message: 'Bad Request' });
    const { matric } = req.query;
    const user = await User.findOne({ matric: matric as string });
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({ message: 'User found', data: user });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message!, message: 'An error occurred' });
  }
};