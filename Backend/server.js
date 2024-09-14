import express from 'express'
import dotenv from 'dotenv'
import authRouters from './routes/authRoutes.js'
import connectToMongoDB from './database/connectToMongoDB.js'

const app = express()
const PORT = process.env.PORT || 5000;

dotenv.config()

// Middleware to convert JSON request bodies to req.body
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Jai Shree Ram")
})

app.use("/api/auth", authRouters)

app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on port ${PORT}`);
})