import express from "express";
import { listLogedInUserPostData, listPostData, userPostData } from "../controllers/userPostControllers.js";
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
router.get('/listlogedInUserPost/:userId',listLogedInUserPostData)

export default router