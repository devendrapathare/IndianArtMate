import cron from 'node-cron';
import BiddingSchemaNoti from '../models/BiddingSchemaNoti'; 
import { endBidding } from '../Controlles/biddingController'; 

const scheduleBiddingEnd = () => {
  cron.schedule('* * * * *', async () => {
    console.log('Checking for biddings to end...');

    const now = new Date();

    try {
      const endedBiddings = await BiddingSchemaNoti.find({
        status: 'active',
        endTime: { $lte: now }
      });

      for (const bidding of endedBiddings) {
        const req = { params: { biddingId: bidding._id } };
        const res = {
          status: (code) => ({
            json: (data) => console.log(`Response [${code}]:`, data),
          }),
        };
        await endBidding(req, res);
      }

    } catch (error) {
      console.error('Error in scheduler:', error);
    }
  });
};

export default  scheduleBiddingEnd;
