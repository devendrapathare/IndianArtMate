import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouters from './person2/routes/authRoutes.js';
import connectToMongoDB from './person2/database/connectToMongoDB.js';
import artiest_rout from './Backend_person_3/routes/Artiest_routes.js';

const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Jai Shree Ram");
});

app.use("/api/auth", authRouters);
// app.use( artiest_rout);

app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on port ${PORT}`);
});
