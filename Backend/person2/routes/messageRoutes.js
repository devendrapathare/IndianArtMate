import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { getMessage, MessageReceiverDetails, sendMessage } from '../controllers/messageController.js';

const router = express.Router()

router.get('/:id',protectRoute,getMessage)
router.post('/send/:id',protectRoute,sendMessage)
router.get('/receiverDetail/:id',MessageReceiverDetails)

export default router