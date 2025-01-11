import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { getMessage, getUserAllConversations, getUserLastMessage, MessageReceiverDetails, sendMessage } from '../controllers/messageController.js';

const router = express.Router()

router.get('/:id',protectRoute,getMessage)
router.post('/send/:id',protectRoute,sendMessage)
router.get('/receiverDetail/:id',MessageReceiverDetails)
router.get('/getUserAllConversations/:id',getUserAllConversations)
router.get('/getUserLastMessage/:id',getUserLastMessage)

export default router