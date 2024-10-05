const mongoose = require('mongoose');

const AuctionWinnerNotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserPost',
    required: true
  },
  purpose: {
    type: String,
    enum: ['auction_winner_notification'],
    default: 'auction_winner_notification',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'read'],
    default: 'pending',
    required: true
  },
  bidPriceReached: {
    type: Number,
    required: true,
    min: 0
  },
  bidderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

AuctionWinnerNotificationSchema.index({ postId: 1, status: 1 });

module.exports = mongoose.model('AuctionWinnerNotification', AuctionWinnerNotificationSchema);
