import orderModel from "../models/OrderModel.js";
import User from '../models/userModels.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing User Order
const placeOrder = async (req,res) => {
    const frontend_url = 'http://localhost:3000';
    try {
        console.log('placeOrder',req.body);
        const newOrder = new orderModel ({
            buyerId: req.body.buyerId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });
        await newOrder.save();
        await User.findByIdAndUpdate(req.body.userId,{cartData:{}});   
        
        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.title
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity,
        }));

        let deliveryCharges = req.body.amount > 499 ? 0 : 40;

        line_items.push({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Delivery Fee'
                },  
                unit_amount: deliveryCharges * 100
            },
            quantity: 1
        });        

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        res.json({ success: true, session_url: session.url });
        
    } catch (error) {
        console.error("Error placing order:", error); 
        res.json({ success: false, message: "Backend Error" });
    }
}
const biddingOrder = async (req, res) => {
    try {
        console.log('biddingOrder', req.body);
        const newOrder = new orderModel({
            buyerId: req.body.buyerId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });
        const savedOrder = await newOrder.save();
        console.log('Newly saved order ID:', savedOrder._id);

        res.json({ success: true, message: "Order placed successfully", orderId: savedOrder._id });
    } catch (error) {
        console.error("Error placing bidding order:", error);
        res.json({ success: false, message: "Backend Error" });
    }
};

const verifyOrder = async (req,res) => {
    const { orderId,success } = req.body;
    try {
        if (success == "true") {
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({ success: true, message: "Paid" });
            console.log("paid");
            
        } 
        else{
            await orderModel.findByIdAndDelete(orderId,{payment:false});
            res.json({ success: false, message: "Not Paid" });
            console.log("notPaid");
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Backend ordercontroller Error"})
    }
}

// fetching User order for frontend
const userOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({userId:req.body.userId});
        res.json({ success: true, data: orders });
        // console.log("orders",req.body.userId);
    } catch (error) {
        console.log(error);
        res.json({success:false,message:'Backend OrderController userOrders Error'})
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const updatedOrder = await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Order status updated" });
        console.log("status", req.body.status);
        
        // Check if the status is 'Delivered'
        if (req.body.status === 'Delivered') {
            console.log("Scheduling deletion of order:", updatedOrder._id);
            // Schedule deletion after a certain time (e.g., 24 hours)
            setTimeout(async () => {
                try {
                    await orderModel.findByIdAndDelete(updatedOrder._id);
                    console.log("Order deleted after delivery:", updatedOrder._id);
                } catch (deleteError) {
                    console.error("Error deleting order:", deleteError);
                }
            }, 10000); // 24 hours in milliseconds
        }

        console.log("done");
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Backend OrderController updateStatus error' });
    }
};


export { placeOrder,verifyOrder,userOrders,updateOrderStatus,biddingOrder }