import OtherTransaction from "../models/OtherTransaction.js";
// import { v4 as uuidv4 } from 'uuid'
import User from "../../person2/models/userModels.js";
import crypto from 'crypto';

export const createOtherTransaction = async (req, res) => {
    try {
        const { buyerId, sellerId, amount } = req.body;

        if (!buyerId || !sellerId || !amount) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Fetch buyer and seller details
        const buyer = await User.findById(buyerId);
        const seller = await User.findById(sellerId);

        if (!buyer || !seller) {
            return res.status(404).json({ success: false, message: "Buyer or Seller not found" });
        }

        const buyerNewBalance = buyer.wallet;
        const sellerNewBalance = seller.wallet;

        // Optional: Prevent negative balances
        if (buyerNewBalance < 0) {
            return res.status(400).json({ success: false, message: "Insufficient balance in buyer's wallet" });
        }

        // Generate unique transaction ID
        // const transactionId = uuidv4();

        // Generate a 24-character transactionId (same length as MongoDB ObjectId)
        const transactionId = crypto.randomBytes(12).toString('hex');
        // Create the transaction
        const transaction = new OtherTransaction({
            buyerId,
            sellerId,
            amount,
            purpose: 'Bidding',
            transactionType: 'bid-won',
            status: "success",
            buyerBalanceAfterTransaction: buyerNewBalance,
            sellerBalanceAfterTransaction: sellerNewBalance,
            transactionId,
        });

        await transaction.save();

        // Update wallet balances
        // buyer.wallet = buyerNewBalance;
        // seller.wallet = sellerNewBalance;
        // await buyer.save();
        // await seller.save();

        res.status(201).json({
            success: true,
            message: "Transaction saved",
            transaction
        });

    } catch (err) {
        console.error("Error in creating other transaction:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getUserTransactions = async (req, res) => {
    const { userId } = req.params;

    try {
        const transactions = await OtherTransaction.find({
            $or: [
                { buyerId: userId },
                { sellerId: userId }
            ]
        })
            .populate("buyerId", "username email")
            .populate("sellerId", "username email")
            .sort({ createdAt: -1 });

        // Add status based on user role in transaction
        const formattedTransactions = transactions.map(txn => ({
            ...txn.toObject(),
            status: txn.buyerId._id.toString() === userId ? "debited" : "credited"
        }));

        res.status(200).json({
            success: true,
            transactions: formattedTransactions
        });
    } catch (err) {
        console.error("Error fetching transactions for user:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};