import express from 'express'; 
// import { uploadProfilePic } from './person_3/Controlles/profilePicControls.js'; 
import { uploadProfilePic } from '../../person_3/Controlles/profilePicControls.js'; 
import multer from 'multer'; 
import path from 'path'; 
import { fileURLToPath } from 'url'; // Import necessary to handle __dirname equivalent in ES6

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: 'uploads/profilePic',
    // destination: 'uploads',
    filename: (req, file, cb)=> {
        return cb(null,`${Date.now()}${file.originalname}`)
    }
});

const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 5 } }); 
console.log("__dirname",__dirname)

router.post('/users/:id/profile-pic', upload.single('profilePic'), uploadProfilePic); 

export default router;
