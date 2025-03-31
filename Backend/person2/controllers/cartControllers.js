import orderModel from "../models/OrderModel.js";
import User from "../models/userModels.js";

// Add item to user Cart
const addItemToCart = async (req, res) => {
    try {   
        const userId = req.params.authId;
        let userData = await User.findById(userId)
        let cartData = await userData.cartData
        
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1
        } else {
            cartData[req.body.itemId] += 1
        }
        await User.findByIdAndUpdate(userId,{cartData});
        res.status(200).json({success:true,message: "Item added to cart successfully"})
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
    }
}

// Remove items from cart
const removeItemFromCart = async (req, res) => {
    try {   
        const userId = req.params.authId;
        let userData = await User.findById(userId)
        let cartData = await userData.cartData
        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1
        }
        await User.findByIdAndUpdate(userId,{cartData})
        res.status(200).json({success:true,message: "Item removed from cart successfully"})
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
    }
}

// fetch user cart data
const fetchCartData = async (req, res) => {
    try {
        const userId = req.params.authId;
        let userData = await User.findById(userId)       
        let cartData = await userData.cartData

        let order = await orderModel.findOne({ buyerId: userId });
        if (order && order.payment === true) {
            // Clear the cart data if payment is true
            await User.findByIdAndUpdate(userId, { cartData: {} });
            cartData = {}; // Set cartData to empty for response
        }

        res.status(200).json({success:true,message: "Cart data fetched successfully", cartData})
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
    }
}

export { addItemToCart, removeItemFromCart, fetchCartData }
