import express from 'express';
import { applyHire, fetchHiringData, updataHiring } from '../controllers/HiringController.js';

const hireRouter = express.Router()

hireRouter.post('/postHire',applyHire)
hireRouter.get('/getHire/:userId',fetchHiringData)
hireRouter.post('/verifyHire',updataHiring)

export default hireRouter