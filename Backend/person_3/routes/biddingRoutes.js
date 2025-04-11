// const express = require('express');
import express from  'express';
const router = express.Router();
import biddingController from  '../Controlles/biddingController.js';
// import authenticate from  ('../middleware/authenticate'); // Authentication middleware

// Route: POST /api/bidding/start
// Description: Artist starts a bidding auction on their post
router.post('/start', biddingController.startBidding);
router.get('/notifications/:userId',biddingController.getBiddingNotifications)
router.get('/biddingData/:postId',biddingController.getBiddingByPostId)
router.post('/placeBid', biddingController.placeBid);
router.get('/myBidings/:userId',biddingController.myBidings)
router.get('/ownerBiddings/:userId',biddingController.getOwnerBiddings);
router.post('/endBidding/:biddingId', biddingController.endBidding);
router.post('/end-and-settle', biddingController.endBiddingAndSettle);

export default router;
