import express from 'express';
import { placeOrder, updateOrderStatus, userOrders, verifyOrder } from '../controllers/OrderControllers.js';

const orderRouter = express.Router()

orderRouter.post('/placeOrder',placeOrder)
orderRouter.post('/verify',verifyOrder)
orderRouter.post('/userOders',userOrders)
orderRouter.post('/status',updateOrderStatus)

export default orderRouter