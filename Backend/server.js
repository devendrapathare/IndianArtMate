import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authRouters from './person2/routes/authRoutes.js'
import userPosts from './person2/routes/userPosts.js'
import connectToMongoDB from './person2/database/connectToMongoDB.js'
import store_rout from './person_3/routes/StoreRoutes.js'
import profile_rout from './person_3/routes/ProfileRoutes.js'
import cartRoutes  from './person2/routes/cartRoutes.js'

const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Jai Shree Ram");
});

app.use("/api/auth", authRouters)
app.use("/api/post", userPosts)
app.use("/api/cart",cartRoutes)
app.use("/images",express.static('uploads'))
app.use(store_rout)
app.use(profile_rout)


app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on port ${PORT}`);
});
