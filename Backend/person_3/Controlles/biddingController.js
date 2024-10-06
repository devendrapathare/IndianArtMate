import mongoose from 'mongoose';
import BiddingSchemaNoti from '../models/BiddingSchemaNoti.js';
import UserPost from '../../person2/models/postModels.js';
import User from '../../person2/models/userModels.js'

const startBidding = async (req, res) => {
  try {
    const { postId, startingPrice, duration ,respectors } = req.body;

    if (!postId || !startingPrice || !duration) {
      return res.status(400).json({ message: 'postId, startingPrice, and duration are required.' });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid postId format.' });
    }

    const post = await UserPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    const art_ownerId = post.userId

    const existingAuction = await BiddingSchemaNoti.findOne({
      postId: postId,
      status: 'active'
    });

    if (existingAuction) {
      return res.status(400).json({ message: 'An active auction already exists for this post.' });
    }

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000); 
    // const endTime = new Date(startTime.getTime() + duration * 3 * 1000); 

    
      const newBiddingNoti = new BiddingSchemaNoti({
      userId: art_ownerId, 
      postId: postId,
      purpose: 'auction',
      status: 'active',
      startingPrice: startingPrice,
      highestPriceReceivedDueToBidding: startingPrice, 
      highestBiddingAmountSetBy: null, 
      biddingNotiReceivers: respectors, 
      startTime: startTime,
      endTime: endTime
    });

    await newBiddingNoti.save();

    return res.status(201).json({
      success:true,
      message: 'Bidding auction started successfully.',
      auction: {
        id: newBiddingNoti._id,
        postId: newBiddingNoti.postId,
        startingPrice: newBiddingNoti.startingPrice,
        currentBid: newBiddingNoti.highestPriceReceivedDueToBidding,
        startTime: newBiddingNoti.startTime,
        endTime: newBiddingNoti.endTime,
        status: newBiddingNoti.status
      }
    });

  } catch (err) {
    console.error('Error in startBidding controller:', err);
    return res.status(500).json({success:false, message: 'Internal server error.' });
  }
};

const getBiddingNotifications = async (req, res) => {
  const { userId } = req.params;

  try {
      // Find the current user and populate 'respecting'
      const user = await User.findById(userId).populate('respecting');
      
      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

      // Fetch the users respected by the current user
      const respectingUserIds = user.respecting.map(user => user._id);

      // Fetch the respectors of the current user
      const respectors = await User.find({ respecting: userId });
      const respectorIds = respectors.map(user => user._id);

      // console.log("respectorIds:",respectorIds)

      // Fetch active biddings from users that the current user is respecting
      const activeBiddingsFromRespectedUsers = await BiddingSchemaNoti.find({
          userId: { $in: respectingUserIds }, 
          status: 'active', 
          endTime: { $gte: new Date() } 
      });

      // Fetch active biddings from users who respect the current user (respectors)
      const activeBiddingsForUserToBid = await BiddingSchemaNoti.find({
          userId: { $in: respectorIds },   
          status: 'active',
          endTime: { $gte: new Date() }
      }).select('userId postId'); 

      res.status(200).json({
          success: true,
          message: "Active biddings notifications",
          activeBiddingsFromRespectedUsers,
          activeBiddingsForUserToBid 
      });

  } catch (error) {
      console.error('Error fetching bidding notifications:', error);
      res.status(500).json({ success: false, message: "Error fetching bidding notifications" });
  }
};




const getBiddingByPostId = async (req, res) => {
  try {
    const { postId } = req.params; 
    const biddingData = await BiddingSchemaNoti.findOne({ postId });

    if (!biddingData) {
      return res.json({ message: 'Bidding data not found' });
    }

    res.status(200).json(biddingData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const placeBid = async (req, res) => {
  try {
      const { postId, userId, bidAmount } = req.body;

      const biddingData = await BiddingSchemaNoti.findOne({ postId });

      if (!biddingData) {
          return res.status(404).json({ message: 'Bidding data not found' });
      }

      const currentHighestBid = biddingData.highestPriceReceivedDueToBidding || biddingData.startingPrice;

      if (parseFloat(bidAmount) <= currentHighestBid) {
          return res.status(400).json({ message: 'Your bid must be higher than the current highest bid' });
      }

      // Update the bidding data with the new highest bid
      biddingData.highestPriceReceivedDueToBidding = bidAmount;
      biddingData.highestBiddingAmountSetBy = userId;

      await biddingData.save();

      return res.status(200).json({success:true, message: 'Bid placed successfully', biddingData });
  } catch (error) {
      return res.status(500).json({ message: 'Error placing bid', error: error.message });
  }
};

const myBidings = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all bidding data for the given userId
    const biddingData = await BiddingSchemaNoti.find({
      userId: userId 
    });

    if (biddingData.length === 0) {
      return res.status(404).json({ message: 'No bidding data found for the specified users' });
    }

    res.status(200).json(biddingData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const getOwnerBiddings = async (req, res) => {
  const { userId } = req.params;

  try {
    const ownerBiddings = await BiddingSchemaNoti.find({ userId }).sort({ endTime: -1 });
    // console.log("ownerBiddings:",ownerBiddings)
    res.status(200).json({
      success: true,
      message: "Biddings where user is the owner",
      ownerBiddings
    });
  } catch (error) {
    console.error('Error fetching owner biddings:', error);
    res.status(500).json({ success: false, message: "Error fetching owner biddings" });
  }
};

const endBidding = async (req, res) => {
  try {
    const { biddingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(biddingId)) {
      return res.status(400).json({ message: 'Invalid biddingId format.' });
    }

    const bidding = await BiddingSchemaNoti.findById(biddingId);
    if (!bidding) {
      return res.status(404).json({ message: 'Bidding not found.' });
    }

    if (bidding.status === 'ended') {
      return res.status(400).json({ message: 'Bidding has already ended.' });
    }

    const winnerId = bidding.highestBiddingAmountSetBy;

    bidding.status = 'ended';
    bidding.winnerId = winnerId;
    bidding.endedAt = new Date();

    await bidding.save();

    res.status(200).json({ 
      success: true, 
      message: 'Bidding ended successfully.', 
      bidding 
    });

  } catch (err) {
    console.error('Error in endBidding controller:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};


export default {
  startBidding ,getBiddingNotifications,getBiddingByPostId ,placeBid ,myBidings,getOwnerBiddings,endBidding
};
