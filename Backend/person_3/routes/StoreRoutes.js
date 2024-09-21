import express from 'express';
import {Find_store_artiest,check_user_has_store_or_not,create_store} from '../Controlles/Storecontroller.js'
const router = express.Router();


// router.get("/sam", (req, res) => {
//     res.send("yes, I'm here");
// });


router.get('/store_by_arti/:artiId',Find_store_artiest)
router.get('/check_store/:userId', check_user_has_store_or_not);

router.post('/create_store', create_store);
  

export default  router;
