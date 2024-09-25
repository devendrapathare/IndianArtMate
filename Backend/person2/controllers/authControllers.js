import User from "../models/userModels.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from '../utils/generateToken.js';

export const signupUser = async (req, res) => {
    try {
        const { userName, email, password, confirmPassword,gender,bio,store_id,respecting,respectors,addressLine1,addressLine2,profile_type } = req.body;

        if (password != confirmPassword) {
            return res.status(400).json({ msg: "Passwords do not match" })
        }
        const username = await User.findOne({ userName })
        if (username) {
            return res.status(400).json({ msg: "Username already exists" })
        }

        const userEmail = await User.findOne({ email })
        if (userEmail) {
            return res.status(400).json({ msg: "Email already exists" })
        }

        // Hashing Passwod
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Taking Avatar For Profile From "https://avatar-placeholder.iran.liara.run/"
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${userName}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${userName}`


        const newUser = await User({
            userName,
            email,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
            bio,
            store_id,
            respecting,
            respectors,
            addressLine1,
            addressLine2,
            profile_type,
        })

        if (newUser) {
            await generateTokenAndSetCookie(newUser._id,res)        
            await newUser.save()
            res.status(201).json({
                _id: newUser._id,
                userName: newUser.userName,
                email: newUser.email, 
                gender:newUser.gender,
                profilePic: newUser.profilePic,
                bio: newUser.bio,
                store_id: newUser.store_id,
                respecting: newUser.respecting,
                respectors: newUser.respectors,
                addressLine1: newUser.addressLine1,
                addressLine2: newUser.addressLine2,
                profile_type: newUser.profile_type
            })
            console.log("new user is here")
        }
        else {
            res.status(400).json({ error: "Failed to Create User Since it is Invalid" })
        }


    } catch (error) {
        console.log("Error in authController.js signupUser", error.message);
        res.status(500).json({ error: "Error in authController.js signupUser" })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { userName,email,password } = req.body;
               
        if (!userName && !email) {
            return res.status(400).json({ error: "Please provide either userName or email" });
        }
        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }
        const query = {};
        if (userName) {
            query.userName = userName;
        }
        if (email) {
            query.email = email;
        }

        const user = await User.findOne(query);
        console.log(query);
        
        const isPasswordCorrect = await bcrypt.compare(password, user?.password ||"")
        

        if (!user || !isPasswordCorrect ) {
            return res.status(400).json({ error: "Invalid userName or Pasword from authController.js loginUser" })
        }

        generateTokenAndSetCookie(user._id,res)

        res.status(200).json({
            _id: user._id,
            userName: user.userName,
            email: user.email,
            // email: user.email,   if you want this too then uncomment it then you will be able to access the email in your client side 
            gender: user.gender,
            profilePic: user.profilePic,
            bio: user.bio,
            store_id: user.store_id,
            respecting: user.respecting,
            respectors: user.respectors,
            addressLine1: user.addressLine1,
            addressLine2: user.addressLine2,
            profile_type: user.profile_type
        })
        
    } catch (error) {
        console.log("Error in authController.js loginUser", error.message);
        res.status(500).json({ error: "Error in authController.js loginUser" })
    }
}

export const logOutUser = async (req, res) => {
    try {
        
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({ message: "User logged out successfully" })
        
    } catch (error) {
        console.log("Error in authController.js logoutUser", error.message);
        res.status(500).json({ error: "Error in authController.js logoutUser" })
    }
}


