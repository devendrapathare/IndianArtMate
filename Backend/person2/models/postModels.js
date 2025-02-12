import mongoose from "mongoose";

const userPostSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
    },

    like: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    },

    disLike: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    },

    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    commentRank: {
        type: Number,
        default: 0
    },
    likeDislikeRank: {
        type: Number,
        default: 0
    }
}, { timestamps: (true) })

const userPosts = mongoose.model.Post || mongoose.model('UserPosts', userPostSchema)

export default userPosts