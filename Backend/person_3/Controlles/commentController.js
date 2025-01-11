import Comment from '../models/commentModel.js'; 

// Add a comment
export const addComment = async (req, res) => {
    try {
        const { postId, userId, commentText } = req.body;

        if (!postId || !userId || !commentText) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Find or create a comment document for the post
        let commentDoc = await Comment.findOne({ postId });

        if (!commentDoc) {
            // Create a new comment document if none exists
            commentDoc = new Comment({
                postId,
                comments: [{ userId, commentText, createdAt: new Date() }],
            });
        } else {
            // Add the new comment to the existing document
            commentDoc.comments.push({ userId, commentText, createdAt: new Date() });
        }

        await commentDoc.save();

        res.status(201).json({
            message: 'Comment added successfully',
            comment: commentDoc,
        });
    } catch (error) {
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

        console.log('Fetched comment document:', commentDoc);

        if (!commentDoc) {
            return res.status(200).json({ comments: [], message: 'No comments found for this post' });
        }

        res.status(200).json({ comments: commentDoc.comments });
    } catch (error) {
        // console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Failed to fetch comments', error: error.message });
    }
};


