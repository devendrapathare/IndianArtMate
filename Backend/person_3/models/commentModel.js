import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true 
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    comments: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            commentText: {
                type: String,
                required: true
            },
            isEdited: {
                type: Boolean,
                default: false
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            updatedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    rank: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true // Adds createdAt and updatedAt fields to the schema
});

export default mongoose.model('Comment', CommentSchema);
