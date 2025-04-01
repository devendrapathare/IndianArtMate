import express from "express";
import {fetch_any_user_data_by_id, update_profile, fetch_all_users,fetchPostsByUserId,user_recommendation} from '../Controlles/UserController.js'


const router = express.Router() 

// router.get('/test', user_recommesndation);
router.get('/users/:userId', fetch_any_user_data_by_id);
router.put('/profile/update/:id',update_profile);
router.post('/profile/find_all',fetch_all_users);
router.get('/fetchPostsByUserId/:id',fetchPostsByUserId)
router.put('/like_dislike/:id')

export default router