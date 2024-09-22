
import express from "express";

import {fetch_any_user_data_by_id, update_profile, fetch_all_users} from '../Controlles/UserController.js'


const router = express.Router() 

router.get('/users/:userId', fetch_any_user_data_by_id);
router.put('/profile/update/:id',update_profile);
router.get('/profile/find_all',fetch_all_users);

export default router