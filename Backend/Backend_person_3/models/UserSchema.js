const mongoose = require("mongoose");

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
        ref: "Store", // Refers to the Store model
        default: null // Initially null, will be updated when the user creates a store
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema, "users");

// export default User;
module.exports = User;
