import cron from 'node-cron';
import BiddingSchemaNoti from '../models/BiddingSchemaNoti.js'; 
import connectDB from '../../person2/database/connectToMongoDB.js'; 

// Connect to the database
connectDB();

// Schedule the cron job
const checkBiddingStatus = async () => {
  console.log('Checking and updating expired bidding statuses...');
  const now = new Date();

  try {
    const result = await BiddingSchemaNoti.updateMany(
      { endTime: { $lte: now }, status: 'active' },
      { status: 'inactive', endedAt: now }
    );

    if (result.modifiedCount > 0) {
      console.log(`Updated ${result.modifiedCount} bidding records to inactive.`);
    }
  } catch (error) {
    console.error('Error updating bidding statuses:', error);
  }
};

// Set the interval to run every 5 seconds
setInterval(checkBiddingStatus, 5000)