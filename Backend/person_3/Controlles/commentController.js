import Comment from '../models/commentModel.js';
import { exec } from 'child_process';

import { promisify } from "util";
import userPosts from '../../person2/models/postModels.js';
const execPromise = promisify(exec); // exec ko promise-based function banane ke liye

export const addComment = async (req, res) => {
    try {
        const { postId, userId, commentText } = req.body;
        console.log("postId:", postId);
        console.log("userId:", userId);
        console.log("commentText:", commentText);
        
        if (!postId || !userId || !commentText) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Python executable and script path
        const pythonPath = "D:\\VsCode\\miniproject-2A\\IndianArtMate-2.O\\env\\Scripts\\python.exe";
        const scriptPath = "D:\\VsCode\\miniproject-2A\\IndianArtMate-2.O\\env\\src\\Krish\\predict.py";

        console.log('Python script paths:');
        
        // **Step 1: Run Python Script for Sentiment Prediction**
        console.log('Running sentiment prediction script...');
        await execPromise(`"${pythonPath}" "${scriptPath}" "${commentText}" "${postId}"`);
        console.log('Python script executed successfully');
        
        // **Step 2: Run Python Script to Calculate Sentiment Ratio and Rank**
        console.log('Calculating sentiment ratio and rank...');
        const { stdout } = await execPromise(`"${pythonPath}" -c "from predict import calculate_sentiment_ratio; result = calculate_sentiment_ratio('${postId}'); print(result['ratio'], result['rank'])"`,
            { cwd: "D:\\VsCode\\miniproject-2A\\IndianArtMate-2.O\\env\\src\\Krish" });

        // **Step 3: Process Output**
        console.log('Processing output...');
        const [ratio, rank] = stdout.trim().split(" "); // Split Python output
        console.log('Ratio:', ratio);
        console.log('Rank:', rank);

        // **Step 4: Find or Create Comment Document**
        let commentDoc = await Comment.findOne({ postId });

        if (!commentDoc) {
            commentDoc = new Comment({
                postId,
                comments: [{ userId, commentText, createdAt: new Date() }],
                rank: parseFloat(rank),
            });
        } else {
            commentDoc.comments.push({ userId, commentText, createdAt: new Date() });
            commentDoc.rank = parseFloat(rank);
        }

        await commentDoc.save();

        // **Step 5: Update the commentRank in UserPosts**
        const updatedPost = await userPosts.findOneAndUpdate(
            { _id: postId }, // Find the post by postId
            { commentRank: parseFloat(rank) }, // Update the commentRank
            { new: true } // Return the updated document
        );

        // console.log('updatedPost',updatedPost);
        
        res.status(201).json({
            message: 'Comment added successfully',
            comment: commentDoc,
            updatedPost, // Returning updated post to confirm the change
        });
        console.log('commentDoc', commentDoc);

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: 'Failed to add comment', error: error.message });
    }
};

// Update a comment
export const updateComment = async (req, res) => {
    try {
        // console.log("im in uodate")
        const { postId, commentId, commentText } = req.body;
        // console.log("commentId:",commentId)

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

        const commentDoc = await Comment.findOne({ postId }).populate('comments.userId', 'username'); // Populate user details if needed

        // console.log('Fetched comment document:', commentDoc);

        if (!commentDoc) {
            return res.status(200).json({ comments: [], message: 'No comments found for this post' });
        }

        res.status(200).json({ comments: commentDoc.comments });
    } catch (error) {
        // console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Failed to fetch comments', error: error.message });
    }
};

//Krish
export const getCommentRankAndRatioById = async (req, res) => {

    const { postId } = req.query

    try {
        const response = await Comment.findOne({'postId':postId})
        if (!response) {
            return res.status(404).json({ message: 'Comments not found' });
        }
        res.status(200).json({ success: true, rank: response.rank });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
        console.log({ error: error.message });

    }
};