import User from "../models/userModels.js";

// Add item to user Cart
const addItemToCart = async (req, res) => {
    try {   
        const userId = req.params.authId;
        // console.log(userId);
        let userData = await User.findById(userId)
        let cartData = await userData.cartData
        
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1
            
            
        } else {
            cartData[req.body.itemId] += 1
            // console.log("data",cartData);
        }
        await User.findByIdAndUpdate(userId,{cartData});
        res.status(200).json({success:true,message: "Item added to cart successfully"})
        console.log(cartData);
        
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
        console.log(error);
        
    }
}

// Remove items from cart
const removeItemFromCart = async (req, res) => {
    try {   
        const userId = req.params.authId;
        let userData = await User.findById(userId)
        let cartData = await userData.cartData
        console.log("beforedata",cartData);
        if (cartData[req.body.itemId] >0) {
            cartData[req.body.itemId] -= 1
        }
        await User.findByIdAndUpdate(userId,{cartData})
        console.log("data",cartData);
        res.status(200).json({success:true,message: "Item removed from cart successfully"})
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
        console.log(error);
        
    }
}

// fetch user cart data
const fetchCartData = async (req, res) => {
    try {
        const userId = req.params.authId;
        let userData = await User.findById(userId)       
        let cartData = await userData.cartData
        res.status(200).json({success:true,message: "Cart data fetched successfully",cartData})
        // console.log("cartdata",cartData);
        
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
        console.log(error);
    }
}


export { addItemToCart,removeItemFromCart,fetchCartData }