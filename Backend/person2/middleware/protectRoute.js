import jwt from 'jsonwebtoken';
import User from '../models/userModels.js'

const protectRoute = async (req,res,next) =>{
    try {

        // console.log('token',req.cookies.jwt);
        
        const token = req.cookies.jwt
        
        if (!token) {
            return res.status(401).json({error:"Unauthorized - No Token Provided"})
        }
        
        const decoded =  jwt.verify(token,process.env.JWT_SECRET_KEY)
        
        if (!decoded) {
            return res.status(401).json({error:"Unauthorized - Invalid Token"})
        }
        // console.log('decoded',decoded);
        
        
        const user = await User.findById(decoded.userId).select("-password")
        // console.log('user',decoded.userId);
        
        
        if (!decoded) {
            return res.status(401).json({error:"User Not Found"})
        }

        req.user = user

        next()
        
    } catch (error) {
        console.log("Error in protectRoute =>",error.message);
        res.status(500).json({error:"Internal Server Error"}) 
    }
}

export default protectRoute