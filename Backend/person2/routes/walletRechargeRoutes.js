import express from 'express';
import { getWalletHistory, rechargeWallet, verifyRecharge } from '../controllers/walletRechargeController.js';
import protectRoute from '../middleware/protectRoute.js';  

const walletRechargeRouter = express.Router()

walletRechargeRouter.post("/recharge", protectRoute ,rechargeWallet);
walletRechargeRouter.post("/verify-recharge", verifyRecharge);
walletRechargeRouter.get("/history", protectRoute ,getWalletHistory);

export default walletRechargeRouter