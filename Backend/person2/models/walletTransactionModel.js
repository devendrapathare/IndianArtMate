import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "success", "failed"],
        default: "pending"
    },
    paymentId: {
        type: String // Stripe payment ID
    },
    transactionType: {
        type: String,
        enum: ["credit", "debit"],
        required: true
    },
    paymentTxnId: {
        type: String,
        // required: true,  
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("WalletTransaction", walletTransactionSchema);
