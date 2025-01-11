import React, { useState, useEffect } from 'react';
import { useComments } from '../../context/CommentContext.jsx';
import { useAuthContext } from '../../../person-2/context/AuthContext/AuthContext.jsx';
import { usePostContext } from '../../../person-2/context/PostContext/PostContext.jsx';
import { useNavigate } from 'react-router-dom';

import './Comments.css';

const Comment = ({ postId }) => {
    const { authUser, fetchUserData } = useAuthContext();
    const Curr_post = postId;
    const Curr_userId = authUser._id;
    const { url } = usePostContext();

    const { comments, fetchComments, addComment, updateComment, deleteComment } = useComments();
    const [comment, setComment] = useState('');
    const [userMap, setUserMap] = useState({});
    const [editingCommentId, setEditingCommentId] = useState(null); // Track the comment being edited
    const navigate = useNavigate();

    useEffect(() => {
        if (Curr_post) fetchComments(Curr_post);
        // console.log("use effect")
    }, [postId, comments]);

    const handleAddComment = () => {
        if (!comment.trim()) return;
        const userId = Curr_userId;
        if (editingCommentId) {
           
            updateComment(postId, editingCommentId, comment.trim());
        } else {
            
            addComment(Curr_post, userId, comment.trim());
        }
        setComment('');
        setEditingCommentId(null); // Reset editing state after adding/updating comment
    };

    useEffect(() => {
        // console.log("user")
        // setComment('')
        const fetchUsersForComments = async () => {
            const userIds = [...new Set(comments?.map((comment) => comment.userId._id))];
            const userData = {};
            for (const userId of userIds) {
                if (!userMap[userId]) {
                    console.log("userID")
                    const data = await fetchUserData(userId);
                    if (data) userData[userId] = data;
                }
            }
            setUserMap((prevMap) => ({ ...prevMap, ...userData }));
        };
        if (comments?.length > 0) fetchUsersForComments();
    }, [comments]);

    const gotoProfile = (artistId) => {
        navigate(`/temp/${artistId}`);
    };

    const handleEditComment = (commentId, text) => {
        // Set the comment text in the input field for editing
        setComment(text);
        setEditingCommentId(commentId);
    };

    const handleDeleteComment = (commentId) => {
        deleteComment(postId, commentId);
    };

    const formatTime = (isoString) => {
        const now = new Date();
        const date = new Date(isoString);
        const diffInMs = now - date; // Time difference in milliseconds
        const diffInSeconds = Math.floor(diffInMs / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
        const diffInMonths = Math.floor(diffInDays / 30);
        const diffInYears = Math.floor(diffInMonths / 12);
      
        if (diffInYears >= 1) {
          return diffInYears === 1 ? "1 year ago" : `${diffInYears} years ago`;
        }
        if (diffInMonths >= 1) {
          return diffInMonths === 1 ? "1 month ago" : `${diffInMonths} months ago`;
        }
        if (diffInDays >= 1) {
          return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
        }
        if (diffInHours >= 1) {
          return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
        }
        if (diffInMinutes >= 1) {
          return diffInMinutes === 1 ? "1 minute ago" : `${diffInMinutes} minutes ago`;
        }
        return "Just now";
      };

    function checker(userId) {
        return userId === Curr_userId;
    }

    return (
        <>
            <div className="parent">


                <div className="comments">
                    <h3>Comments</h3>
                    {/* {comments = []} */}
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            
                            <div className="card" key={comment._id}>
                            <div className="clickable card-left" onClick={() => gotoProfile(comment.userId._id)}>
                                <div className="profile-picture-date">
                                    <img
                                        src={
                                            userMap[comment.userId._id]?.profilePic.startsWith("https://avatar.iran.liara.run/public/")
                                                ? userMap[comment.userId._id]?.profilePic
                                                : `${url}/profilePics${userMap[comment.userId._id]?.profilePic.split("/profilePic")[1]}`
                                        }
                                        alt="User"
                                    />
                                    <small>
                                        {comment.isEdited ? formatTime(comment.updatedAt) : formatTime(comment.createdAt)}
                                    </small>
                                </div>
                                <div>
                                    <p>
                                        <strong>{userMap[comment.userId._id]?.userName}: </strong>
                                    </p>
                                    <small>{comment.isEdited ? "(edited)" : ""}</small>
                                </div>
                            </div>
                            <p className="card-center">{comment.commentText}</p>
                            <div className="card-right">
                                {checker(comment.userId._id) && (
                                    <div className="modify-btn">
                                        <button onClick={() => handleEditComment(comment._id, comment.commentText)}>Edit</button>
                                        <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        ))
                    ) : (
                        <p>No comments yet. Be the first to comment!</p>
                    )}

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleAddComment();
                        }}
                    >
                        <div className="form-left">
                            <label htmlFor="new-comment">Comment:</label>
                            <input
                                id="new-comment"
                                type="text"
                                value={comment}
                                onChange={(e) => {
                                    const words = e.target.value.split(/\s+/).filter((word) => word.length > 0); // Count non-empty words
                                    if (words.length <= 30) {
                                        setComment(e.target.value); // Allow input only if words are 30 or fewer
                                    }
                                }}
                                placeholder="Write your comment here..."
                            />
                        </div>

                        <div className="form-right">
                            <button type="submit">{editingCommentId ? 'Update Comment' : 'Add Comment'}</button>
                            <small>{comment.split(/\s+/).filter((word) => word.length > 0).length}/30 words</small>
                        </div>
                    </form>
                </div>
            </div>
        </>

    );
};

export default Comment;
