// models/OtherTransaction.js

import mongoose from "mongoose";

const otherTransactionSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purpose: {
        type: String, // e.g., "Artwork Purchase", "Commission Payment"
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("OtherTransaction", otherTransactionSchema);
