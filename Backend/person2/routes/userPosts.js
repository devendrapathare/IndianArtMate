import express from "express";
import { listLogedInUserPostData, listPostData, userPostData ,for_like,for_dislike } from "../controllers/userPostControllers.js";
import multer from 'multer'

const router = express.Router() 

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb)=> {
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage:storage})

router.post('/uploadPost',upload.single('image'),userPostData)
router.get('/listPost',listPostData)
<<<<<<< HEAD
router.get('/listlogedIUserPost',listLogedInUserPostData)
router.post('/:postId/like',for_like)
router.post('/:postId/dislike',for_dislike)
=======
router.get('/listlogedInUserPost/:userId',listLogedInUserPostData)
>>>>>>> 38a3753250e608921a441f6155e69ae2749c1803

export default router