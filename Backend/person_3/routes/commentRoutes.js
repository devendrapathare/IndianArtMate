import express from 'express';
import { addComment, updateComment, deleteComment, getComments } from '../Controlles/commentController.js';

const router = express.Router();

router.post('/add', addComment);
router.put('/update', updateComment);
router.delete('/delete', deleteComment);
router.get('/:postId', getComments);

export default router;
