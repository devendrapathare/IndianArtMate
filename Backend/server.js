import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authRouters from './person2/routes/authRoutes.js'
import userPosts from './person2/routes/userPosts.js'
import connectToMongoDB from './person2/database/connectToMongoDB.js'
import store_rout from './person_3/routes/StoreRoutes.js'
import profile_rout from './person_3/routes/ProfileRoutes.js'
import profile_pic_router from './person_3/routes/Profile_pic_routes.js'
import cartRoutes from './person2/routes/cartRoutes.js'
import orderRouter from './person2/routes/OrderRoutes.js'
import like_dislike_controlls from './person_3/routes/setLikeDislikeroutes.js'
import setRespectingRoutes from './person_3/routes/setRespectingRoutes.js'
import biddingRoutes from './person_3/routes/biddingRoutes.js'
import HIringRouter from './person2/routes/HIringRouter.js'
import CommentRoute from './person_3/routes/commentRoutes.js'

import http from 'http';

import { initializeSocket } from './socket.js';
import messageRoutes from './person2/routes/messageRoutes.js'
import cookieParser from 'cookie-parser';
import walletRechargeRouter from './person2/routes/walletRechargeRoutes.js'
import { cleanPendingTransactions } from './person2/utils/cleanup.js'
import otherTransactionRoutes from './person_3/routes/otherTransactionRoutes.js'

const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,  // Allow cookies
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser())

app.get("/", (req, res) => {
    res.send("Jai Shree Ram");
});

app.use("/api/auth", authRouters);
app.use("/api/post", userPosts);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRouter);
app.use("/images", express.static('uploads'));
app.use("/api/messages", messageRoutes)
app.use('/api/wallet', walletRechargeRouter)

app.use(store_rout);
app.use(profile_rout);
app.use(profile_pic_router);
app.use(setRespectingRoutes);
app.use("/posts", like_dislike_controlls);
app.use('/profilePics', express.static('uploads/profilePic'));
app.use('/api/bidding', biddingRoutes);
app.use('/api/hiring', HIringRouter);
app.use('/comment', CommentRoute);
app.use("/api/other-transactions", otherTransactionRoutes);



const server = http.createServer(app);
initializeSocket(server);

server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on port ${PORT}`);

    // Background job for cleaning pending wallet transactions
    setInterval(cleanPendingTransactions, 15 * 60 * 1000);

});
