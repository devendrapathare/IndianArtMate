import express from "express";
import {for_like,for_dislike } from '../Controlles/Like_dislikeController.js'

const router = express.Router() 

router.post('/:postId/like',for_like)
router.post('/:postId/dislike',for_dislike)
router.post('/like/:postId',for_like)
router.post('/dislike/:postId',for_dislike)

export default router


