// routes/HiringRouter.js

import express from 'express';
import {hire} from '../Controlles/HiringController.js'; // Corrected path

const router = express.Router();

// Define the POST route for hiring
router.post('/', hire);

export default router;