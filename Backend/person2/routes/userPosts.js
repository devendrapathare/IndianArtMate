import express from "express";
import { listLogedInUserPostData, listPostData, userPostData ,get_post_data_by_post_id, get_post_data_by_name, deletePostById } from "../controllers/userPostControllers.js";
import multer from 'multer'
import protectRoute from "../middleware/protectRoute.js";

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
router.get('/listlogedIUserPost',listLogedInUserPostData)
router.get('/listlogedInUserPost/:userId',listLogedInUserPostData)
router.get('/getPostDataByID/:id',get_post_data_by_post_id)
router.post('/listPostByName',get_post_data_by_name)
router.post('/deletePostById/:id',protectRoute,deletePostById)
export default router