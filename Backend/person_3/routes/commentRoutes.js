import express from 'express';
import { addComment, updateComment, deleteComment, getComments, getCommentRankAndRatioById } from '../Controlles/commentController.js';

const router = express.Router();

router.post('/add', addComment);
router.put('/update', updateComment);
router.delete('/delete', deleteComment);
router.get('/:postId', getComments);

// Krish
router.get('/getComment/ratioAndRank',getCommentRankAndRatioById)

export default router;
