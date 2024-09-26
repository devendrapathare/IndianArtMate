import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    bio: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female"]
    },
    profilePic: {
        type: String,
        default: ""
    },
    store_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store", 
        default: null 
    },
    respecting: {
        type: [mongoose.Schema.Types.ObjectId],  
        ref: "User",
        default: []  
    },
    respectors: {
        type: [mongoose.Schema.Types.ObjectId],  
        ref: "User",
        default: []  
    },
    addressLine1: {
        type: String,
        default: ''
    },
    addressLine2: {
        type: String,
        default: ''
    },
    profile_type: {
        type: String, 
        default : ''
    },
    cartData: {
        type: Object,
        default: {}
    }
}, { timestamps: true,minimize: false });

const User = mongoose.model("User", userSchema, "users");

export default User;
