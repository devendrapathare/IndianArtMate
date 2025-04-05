import WalletTransaction from "../models/walletTransactionModel.js";
import User from "../models/userModels.js";
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const frontend_url = 'http://localhost:3000';

// Start Wallet Recharge
export const rechargeWallet = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user._id; // Assuming userId is available in req.user
        const newTransaction = await WalletTransaction.create({
            userId,
            amount,
            paymentStatus: "pending",
            transactionType: "credit"
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Wallet Recharge'
                    },
                    unit_amount: amount * 100
                },
                quantity: 1
            }],
            mode: 'payment',
            success_url: `${frontend_url}/wallet-verify?success=true&txnId=${newTransaction._id}`,
            cancel_url: `${frontend_url}/wallet-verify?success=false&txnId=${newTransaction._id}`
        });

        newTransaction.paymentId = session.id;
        await newTransaction.save();

        res.json({ success: true, session_url: session.url });

    } catch (err) {
        console.log(err);
        res.json({ success: false, message: "Recharge error" });
    }
};

// Verify Wallet Recharge
export const verifyRecharge = async (req, res) => {
    const { txnId, success } = req.body;

    try {
        const txn = await WalletTransaction.findById(txnId);
        if (!txn) return res.json({ success: false, message: "Transaction not found" });

        if (success == "true") {
            txn.paymentStatus = "success";
            await txn.save();

            await User.findByIdAndUpdate(txn.userId, {
                $inc: { wallet: txn.amount }
            });

            res.json({ success: true, message: "Wallet recharged successfully" });
        } else {
            txn.paymentStatus = "failed";
            await txn.save();

            res.json({ success: false, message: "Recharge failed or cancelled" });
        }

    } catch (err) {
        console.log(err);
        res.json({ success: false, message: "Verification error" });
    }
};

// Get Wallet Recharge History
export const getWalletHistory = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming userId is available in req.user
        // console.log("userId", userId);          
        if (!userId) return res.json({ success: false, message: "User ID not found" });// Add error handling for this case

        const history = await WalletTransaction.find({ userId }).sort({ createdAt: -1 });

        res.json({ success: true, data: history });

    } catch (err) {
        console.log(err);
        res.json({ success: false, message: "Failed to fetch history" });
    }
};
