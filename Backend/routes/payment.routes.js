import express from 'express';
import { createOrder, verifyPayment } from '../controllers/payments.controller.js';
import { isAuth } from '../middleware/isAuth.js';

const paymentRouter = express.Router();

paymentRouter.get('/payment', (req, res) => {
  res.send('Payment endPoint is working');
});

paymentRouter.post('/create-order', isAuth, createOrder);
paymentRouter.post('/verify-payment', isAuth, verifyPayment);

export default paymentRouter;