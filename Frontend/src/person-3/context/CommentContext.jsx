import React, { createContext, useContext, useState } from 'react';
import { usePostContext } from '../../person-2/context/PostContext/PostContext';

import axios from 'axios';

const CommentContext = createContext();

export const useComments = () => useContext(CommentContext);

export const CommentProvider = ({ children }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [CommentRatioAndRank, setCommentRatioAndRank] = useState()
    const { url } = usePostContext()

    const fetchComments = async (postId) => {
        try {
            // setComments([]); 
            const path = `${url}/comment/${postId}`;
            
            setLoading(true); 
            
            const response = await axios.get(path);
            if (response.data.comments && response.data.comments.length > 0) {
                
                const sortedComments = response.data.comments.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setComments(sortedComments);
            } else {
                
                setComments([]); 
            }
            setError(null); 
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch comments');
            setComments([]); 
        } finally {
            setLoading(false); 
        }
    };
    
    
    // Add a new comment
    const addComment = async (postId, userId, commentText) => {
        try {
            // setComments([])
            const response = await axios.post(`${url}/comment/add`, { postId, userId, commentText });
    
            // Ensure `response.data` is accessed correctly
            const newComments = response.data.comment.comments;
    
            // setComments((prev) => [...prev, ...newComments]);
            setComments(newComments)
            // console.log("comme:",comments)
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add comment');
        }
    };
    

    // Update a comment
    const updateComment = async (postId, commentId, commentText) => {
        try {
            const response = await axios.put(`${url}/comment/update`, { postId, commentId, commentText });
            setComments((prev) =>
                prev.map((comment) =>
                    comment._id === commentId ? { ...comment, commentText, isEdited: true } : comment
                )
            );
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update comment');
        }
    };

    // Delete a comment
    const deleteComment = async (postId, commentId) => {
        try {
            await axios.delete(`${url}/comment/delete`, { data: { postId, commentId } });
            setComments((prev) => prev.filter((comment) => comment._id !== commentId));
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete comment');
        }
    };

    const fetchCommentRankAndRatioById = async (postId) => {
        try {
            const response = await axios.get(`${url}/comment/getComment/ratioAndRank`, {
                params: { postId }
            });
            setCommentRatioAndRank(response.data)
        }
        catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch comment rank and ratio');
        }
    }
    // console.log('CommentRatioAndRank',CommentRatioAndRank);
    

    return (
        <CommentContext.Provider
            value={{
                comments, 
                loading,
                error,
                fetchComments,
                addComment,
                updateComment,
                deleteComment,
                fetchCommentRankAndRatioById,
                CommentRatioAndRank,
            }}
        >
            {children}
        </CommentContext.Provider>
    );
};
