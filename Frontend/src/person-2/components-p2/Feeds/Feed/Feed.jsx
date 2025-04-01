import React, { useEffect, useState } from 'react';
import './Feed.css';
import { like_dislike_images } from '../../../../assets/assets.js';
import { usePostContext } from '../../../context/PostContext/PostContext.jsx';
import { useAuthContext } from '../../../context/AuthContext/AuthContext.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';


const Feed = ({ post }) => {
    const { url } = usePostContext();
    const { authUser } = useAuthContext();

    const [userDetail, setUserDetail] = useState(null);
    const [like, setLike] = useState(post.like.length);
    const [disLike, setDisLike] = useState(post.disLike.length);
    const [action, setAction] = useState('');
    const [isLiking, setIsLiking] = useState(false);

    const userId = authUser._id;

    const getUserDetails = async () => {
        try {
            const response = await axios.get(`${url}/users/${post.userId}`);
            setUserDetail(response.data.user);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        getUserDetails();
    }, [post.userId]);


    const handleLikeDislike = async (actionType) => {
        if (!authUser) {
            toast.error('Please log in to like or dislike a post.');
            return;
        }

        if (isLiking) return; // Prevent multiple rapid clicks
        
        setIsLiking(true);
        
        try {
            const response = await axios.post(`${url}/posts/${post._id}/${actionType}`, { userId });
            const { likeCount: updatedLikes, dislikeCount: updatedDislikes } = response.data;
            
            // Update state with new counts
            setLike(updatedLikes);
            setDisLike(updatedDislikes);
            
            // Show success toast
            toast.success(actionType === 'like' ? 'Post liked!' : 'Post disliked!', {
                duration: 2000,
                position: 'bottom-center',
                style: {
                    background: '#7B96D9',
                    color: '#fff'
                }
            });
            
        } catch (error) {
            console.error('Error updating like/dislike:', error);
            toast.error('Failed to update. Please try again.');
        } finally {
            setIsLiking(false);
            setAction(''); // Reset action after handling
        }
    };

    const handleLikeClick = (e) => {
        e.stopPropagation(); // Stop event propagation
        setAction('like');
        handleLikeDislike('like');
    };
    
    const handleDislikeClick = (e) => {
        e.stopPropagation(); // Stop event propagation
        setAction('dislike');
        handleLikeDislike('dislike');
    };

    const fullImageUrl = userDetail?.profilePic?.startsWith('http')
        ? userDetail.profilePic
        : userDetail?.profilePic
        ? `${url}/profilePics${userDetail.profilePic.split('/profilePic')[1]}`
        : '';

    return (
        <div className="feed-container">
            <div className="feed-profile">
                <div className="feed-profile-img-div">
                    <img src={fullImageUrl} alt="Profile" />
                </div>
                <div className="feed-profile-userName">
                    <p>{userDetail?.userName || 'Loading...'}</p>
                </div>
            </div>

            <div className="feed-main-img-div">
                <img src={`${url}/images/${post.image}`} alt="Post" />
            </div>

            <div className="feed-like-dislike-div" onClick={(e) => e.stopPropagation()}>
                <div className="like imgs">
                    <img
                        className="respons"
                        src={like_dislike_images.like}
                        alt="Like"
                        onClick={handleLikeClick}
                    />
                    <p>{like}</p>
                </div>
                <div className="dislike imgs">
                    <img
                        className="respons"
                        src={like_dislike_images.dislike}
                        alt="Dislike"
                        onClick={handleDislikeClick}
                    />
                    <p>{disLike}</p>
                </div>
            </div>

            <div className="feed-title-div">
                <p>{post.title}</p>
            </div>
        </div>
    );
};

export default Feed;
