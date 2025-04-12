
import express from "express";
import { createOtherTransaction, getUserTransactions } from "../Controlles/otherTransactionController.js";

const router = express.Router();

router.post("/create", createOtherTransaction);
router.get("/:userId", getUserTransactions); 

export default router;
