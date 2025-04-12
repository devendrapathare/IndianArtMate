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
    type: String, // e.g., "Bought AirPods", "Bid on iPhone"
    required: true
  },
  transactionType: {
    type: String,
    enum: ["bid-won", "refund", "order-purchase", "wallet-recharge", "order-sale"],
    default: "order-purchase"
  },
  status: {
    type: String,
    enum: ["success", "failed"],
    default: "success"
  },
  buyerBalanceAfterTransaction: {
    type: Number
  },
  sellerBalanceAfterTransaction: {
    type: Number
  },
  transactionId: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("OtherTransaction", otherTransactionSchema);
