import express from 'express';
import { createOrder, createVendor, getOrder, authorizeVendor, getVendor, getOrders, getVendorById } from '../controllers/vendor.controller';
import { authVendorMiddleware } from '../middlewares/auth.middleware';



const router = express.Router();



router.post('/', createVendor);
router.get('/', authVendorMiddleware, getVendor);
router.post('/authorize', authorizeVendor);
router.post('/order', authVendorMiddleware, createOrder);
router.get('/order', getOrder);
router.get('/orders', authVendorMiddleware, getOrders);
router.get('/:id', authVendorMiddleware, getVendorById);



export default router;