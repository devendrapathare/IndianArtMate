import orderModel from "../models/OrderModel.js";
import User from '../models/userModels.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import OtherTransaction from "../../person_3/models/OtherTransaction.js";
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing User Order
const placeOrder = async (req, res) => {
    const frontend_url = 'http://localhost:3000';
    try {
        console.log('placeOrder', req.body);
        const newOrder = new orderModel({
            buyerId: req.body.buyerId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });
        await newOrder.save();
        await User.findByIdAndUpdate(req.body.userId, { cartData: {} });

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

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success == "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" });
            console.log("paid");

        }
        else {
            await orderModel.findByIdAndDelete(orderId, { payment: false });
            res.json({ success: false, message: "Not Paid" });
            console.log("notPaid");
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Backend ordercontroller Error" })
    }
}

// fetching User order for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
        // console.log("orders",req.body.userId);
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Backend OrderController userOrders Error' })
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

// Backend: OrderController.js

const placeOrderWithWallet = async (req, res) => {
    try {
        const buyer = await User.findById(req.body.buyerId);

        // Calculate delivery charges
        let deliveryCharges = req.body.amount > 499 ? 0 : 40;
        const totalItems = req.body.items.length;
        const deliveryChargePerItem = deliveryCharges / totalItems;
        console.log(buyer.wallet, "buyer wallet");
        

        const totalPayableAmount = req.body.amount + deliveryCharges;
        console.log("Total payable amount:", totalPayableAmount);
        

        if (buyer.wallet >= totalPayableAmount) {
            // Deduct totalPayableAmount from buyer's wallet first
            buyer.wallet -= totalPayableAmount;
            // console.log("Updated wallet balance:", buyer.wallet);
            // console.log('amount:', req.body.amount);
            // console.log('deliveryCharges:', deliveryCharges);
            
            
            await buyer.save();

            // Start from current wallet after deduction
            let buyerCurrentWalletBalance = buyer.wallet + totalPayableAmount;
            // console.log("Current wallet balance after deduction:", buyerCurrentWalletBalance);

            for (let item of req.body.items) {

                const seller = await User.findById(item.userId);
                if (!seller) {
                    console.log("Seller not found");
                    return res.status(404).json({ success: false, message: "Seller not found" });
                }
                console.log(seller.wallet, "seller");
                

                const itemTotal = (item.price * item.quantity) + deliveryChargePerItem;
                // console.log("itemTotal", itemTotal);
                

                // Update balance after this item's cost
                buyerCurrentWalletBalance -= itemTotal;
                // console.log('deliveryChargePerItem', deliveryChargePerItem);

                let sellerCurrentWalletBalance = seller.wallet + itemTotal;
                
                // Update seller's wallet in the database
                seller.wallet = sellerCurrentWalletBalance;
                await seller.save();

                // Create individual order per item
                const order = new orderModel({
                    buyerId: req.body.buyerId,
                    items: [item],
                    amount: item.price,
                    deliveryCharge: deliveryChargePerItem || 0,
                    address: req.body.address,
                    payment: true,
                    status: 'Pending',
                });
                await order.save();

                // Create transaction per seller/item
                const transaction = new OtherTransaction({
                    buyerId: req.body.buyerId,
                    sellerId: item.userId,
                    amount: item.price + deliveryChargePerItem,
                    purpose: `Purchase: ${item.category} (Incl. Delivery)`,
                    transactionType: 'order-purchase',
                    status: 'success',
                    buyerBalanceAfterTransaction: buyerCurrentWalletBalance,
                    sellerBalanceAfterTransaction: sellerCurrentWalletBalance,
                    transactionId: order._id.toString(),
                });

                await transaction.save();
            }

            res.json({ success: true, message: 'Order placed successfully using Wallet (with Delivery Charges)' });
        } else {
            res.json({ success: false, message: 'Insufficient wallet balance' });
        }
    } catch (error) {
        console.error('Error placing order with wallet:', error);
        res.json({ success: false, message: 'Backend Error' });
    }
};


export { placeOrder, verifyOrder, userOrders, updateOrderStatus, biddingOrder, placeOrderWithWallet };