import express from 'express'
import { addItemToCart, removeItemFromCart,fetchCartData } from '../controllers/cartControllers.js'

const cartRouter = express.Router()

cartRouter.post('/add/:authId',addItemToCart)
cartRouter.post('/remove/:authId',removeItemFromCart)
cartRouter.post('/get/:authId',fetchCartData)

export default cartRouter;