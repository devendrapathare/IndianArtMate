import User from "../models/userModels.js";

export const signupUser = async (req,res) =>{
    try {
        const {name} = req.body;
        const user =  await User.create({
            name,
        })

        await user.save()
        res.status(201).json({_id:user._id,name:user,name})
        
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}

export const loginUser = async (req,res) =>{
    res.send("Login Page")
    console.log("Login page");  
}