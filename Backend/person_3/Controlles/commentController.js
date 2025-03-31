import Comment from '../models/commentModel.js';
import axios from 'axios'; // Axios for API requests
import userPosts from '../../person2/models/postModels.js';

// Define Python server URL (Modify if needed)
const PYTHON_SERVER_URL = "http://127.0.0.1:6000"; 

export const addComment = async (req, res) => {
    try {
        const { postId, userId, commentText } = req.body;
        console.log("postId:", postId);
        console.log("userId:", userId);
        console.log("commentText:", commentText);
        
        if (!postId || !userId || !commentText) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // *Step 1: Call Python Server for Sentiment Prediction*
        console.log('Sending comment to Python server for sentiment prediction...');
        const { data } = await axios.post(`${PYTHON_SERVER_URL}/sentiment/predict`, { 
            text: commentText, 
            post_id: postId 
        });

        console.log('Sentiment prediction processed successfully');

        // *Step 2: Fetch Sentiment Ratio and Rank*
        // console.log('Fetching sentiment ratio and rank from Python server...');
        // const { data } = await axios.get(`${PYTHON_SERVER_URL}/sentiment/calculate-ratio?post_id=${postId}`);

        // if (!data || !data.ratio || !data.rank) {
        //     throw new Error(`${data.ratio}  ${data.rank} `);
        // }

        console.log('Sentiment Data:', data);

        // *Step 3: Find or Create Comment Document*
        let commentDoc = await Comment.findOne({ postId });

        if (!commentDoc) {
            commentDoc = new Comment({
                postId,
                comments: [{ userId, commentText, createdAt: new Date() }],
                rank: parseFloat(data.rank),
            });
        } else {
            commentDoc.comments.push({ userId, commentText, createdAt: new Date() });
            commentDoc.rank = parseFloat(data.rank);
        }

        await commentDoc.save();

        // *Step 4: Update the commentRank in UserPosts*
        const updatedPost = await userPosts.findOneAndUpdate(
            { _id: postId }, // Find the post by postId
            { commentRank: parseFloat(data.rank) }, // Update the commentRank
            { new: true } // Return the updated document
        );

        res.status(201).json({
            message: 'Comment added successfully',
            comment: commentDoc,
            updatedPost,
        });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: 'Failed to add comment', error: error.message });
    }
};

// Update a comment
export const updateComment = async (req, res) => {
    try {
        const { postId, commentId, commentText } = req.body;

        const commentDoc = await Comment.findOneAndUpdate(
            { postId, "comments._id": commentId },
            {
                $set: {
                    "comments.$.commentText": commentText,
                    "comments.$.isEdited": true,
                    "comments.$.updatedAt": new Date()
                }
            },
            { new: true }
        );

        if (!commentDoc) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json({ message: 'Comment updated successfully', comment: commentDoc });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update comment', error: error.message });
    }
};

// Delete a comment
export const deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.body;

        const commentDoc = await Comment.findOneAndUpdate(
            { postId },
            { $pull: { comments: { _id: commentId } } },
            { new: true }
        );

        if (!commentDoc) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json({ message: 'Comment deleted successfully', comment: commentDoc });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete comment', error: error.message });
    }
};

// Get all comments for a post
export const getComments = async (req, res) => {
    try {
        const { postId } = req.params;

        const commentDoc = await Comment.findOne({ postId }).populate('comments.userId', 'username');

        if (!commentDoc) {
            return res.status(200).json({ comments: [], message: 'No comments found for this post' });
        }

        res.status(200).json({ comments: commentDoc.comments });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch comments', error: error.message });
    }
};

// Fetch Comment Rank and Ratio
export const getCommentRankAndRatioById = async (req, res) => {
    const { postId } = req.query;

    try {
        const response = await Comment.findOne({ postId });
        if (!response) {
            return res.status(404).json({ message: 'Comments not found' });
        }
        res.status(200).json({ success: true, rank: response.rank });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
