// controllers/otherTransactionController.js

import OtherTransaction from "../models/OtherTransaction.js";

export const createOtherTransaction = async (req, res) => {
    try {
        const { buyerId, sellerId, amount, purpose } = req.body;

        if (!buyerId || !sellerId || !amount || !purpose) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const transaction = new OtherTransaction({
            buyerId,
            sellerId,
            amount,
            purpose
        });

        await transaction.save();

        res.status(201).json({ success: true, message: "Transaction saved", transaction });
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