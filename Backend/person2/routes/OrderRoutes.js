import express from 'express';
import { placeOrder, updateOrderStatus, userOrders, verifyOrder, biddingOrder, placeOrderWithWallet } from '../controllers/OrderControllers.js';

const orderRouter = express.Router()

orderRouter.post('/placeOrder',placeOrder)
orderRouter.post('/placeBiddingOrder',biddingOrder)
orderRouter.post('/verify',verifyOrder)
orderRouter.post('/userOders',userOrders)
orderRouter.post('/status',updateOrderStatus)
orderRouter.post('/placeOrderWithWallet',placeOrderWithWallet)

export default orderRouter