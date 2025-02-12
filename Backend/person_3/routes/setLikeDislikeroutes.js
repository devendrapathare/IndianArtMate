import express from "express";
import {for_like,for_dislike } from '../Controlles/Like_dislikeController.js'

const router = express.Router() 

router.post('/:postId/like',for_like)
router.post('/:postId/dislike',for_dislike)
// Krish
// router.get('/getLikesDislikes',getAllLIkesDislikesByPostId)

export default router


