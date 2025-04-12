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
    phoneNumber:{
        type: String,
        unique: true,
        default: null
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    wallet: {
        type: Number,
        default: 0
    },

    locked: {
        type: Array,
        default: [],
        lock: Number,
        biddingId: mongoose.Schema.Types.ObjectId,
        biddingOwnerId: mongoose.Schema.Types.ObjectId,
    },

    // 🔽 Optional: Add walletTransactionRefs if needed later
    // walletTransactions: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "WalletTransaction"
    // }],

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
    },
    isUpdated:{
        type: Boolean,
        default: false
    }
}, { timestamps: true, minimize: false });

const User = mongoose.model("User", userSchema, "users");

export default User;
