import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true,
        default:2000,
        min: 0
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "success", "failed"],
        default: "pending"
    },
    // paymentId: {
    //     type: String 
    // },
    transactionType: {
        type: String,
        enum: ["credit", "debit"],
        required: true
    },
    // paymentTxnId: {
    //     type: String,
    // },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("WalletTransaction", walletTransactionSchema);
