import express from 'express';
import { register, login, getUser, checkMatric } from '../controllers/auth.controller';


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/check-matric', checkMatric);
router.get('/:id', getUser);

export default router;