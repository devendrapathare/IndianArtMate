import mongoose from 'mongoose';

const BiddingSchemaNoti = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Owner of the bidding
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  purpose: { type: String, required: true },
  status: { type: String, enum: ['active', 'ended'], default: 'active' },
  startingPrice: { type: Number, required: true },
  highestPriceReceivedDueToBidding: { type: Number, default: 0 },
  highestBiddingAmountSetBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  winnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  biddingNotiReceivers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  orderPlaced: { type: Boolean, default: false },

  // bidders: [
  //   {
  //     bidderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  //     amount: { type: Number, required: true },
  //     bidTime: { type: Date, default: Date.now },
  //     backedOut: { type: Boolean, default: false } // optional: if you want to support backout feature
  //   }
  // ],

  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true, index: { expires: 0 } },
  endedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

BiddingSchemaNoti.index({ postId: 1, status: 1 });
BiddingSchemaNoti.index({ endTime: 1 });

export default mongoose.model('BiddingSchemaNoti', BiddingSchemaNoti);
