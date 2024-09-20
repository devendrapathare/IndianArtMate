import express from 'express';
import {Find_store_artiest,check_user_has_store_or_not} from '../Controlles/Storecontroller.js'
import {fetch_any_user_data_by_id,create_store} from '../Controlles/Storecontroller.js'
const router = express.Router();



// router.get("/sam", (req, res) => {
//     res.send("yes, I'm here");
// });


router.get('/store_by_arti/:artiId',Find_store_artiest)
router.get('/check_store/:userId', check_user_has_store_or_not);
router.get('/users', fetch_any_user_data_by_id);

router.post('/create_store', create_store);
  

export default  router;
