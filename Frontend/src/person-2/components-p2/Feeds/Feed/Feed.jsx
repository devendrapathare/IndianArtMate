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

        try {
            const response = await axios.post(`${url}/posts/${post._id}/${actionType}`, { userId });
            const { likeCount: updatedLikes, dislikeCount: updatedDislikes } = response.data;
            // console.log('Updated Likes:', updatedLikes);
            // console.log('Updated Dislikes:', updatedDislikes);
            // console.log(response.data);           

            setLike(updatedLikes);
            setDisLike(updatedDislikes);
        } catch (error) {
            console.error('Error updating like/dislike:', error);
            toast.error('Failed to update. Please try again.');
        }
    };

    useEffect(() => {
        if (action) {
            handleLikeDislike(action);
            setAction(''); 
        }
    }, [action]);

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

            <div className="feed-like-dislike-div">
                <div className="like imgs">
                    <img
                        className="respons"
                        src={like_dislike_images.like}
                        alt="Like"
                        onClick={() => setAction('like')}
                    />
                    <p>{like}</p>
                </div>
                <div className="dislike imgs">
                    <img
                        className="respons"
                        src={like_dislike_images.dislike}
                        alt="Dislike"
                        onClick={() => setAction('dislike')}
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
