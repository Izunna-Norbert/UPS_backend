import express from 'express';
import { getBeneficiaries, getMe, getUserById, getTransactions, addBeneficiary, getUserByMatric } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';


const router = express.Router();

router.use(authMiddleware);

router.get('/', getMe);
router.get('/:id', getUserById);
router.get('/:id/transactions', getTransactions);
router.get('/:id/beneficiaries', getBeneficiaries);
router.post('/:id/beneficiaries', addBeneficiary);
router.get('/matric/:matric', getUserByMatric);

export default router;