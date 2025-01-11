import React, { useEffect, useState } from 'react'
import './Feed.css'
import { assets, like_dislike_images } from '../../../../assets/assets.js'
import { usePostContext } from '../../../context/PostContext/PostContext.jsx'
import { useAuthContext } from '../../../context/AuthContext/AuthContext.jsx'
import axios from 'axios'

const Feed = ({ post }) => {

    const { url } = usePostContext();

    const { authUser } = useAuthContext()

    const [UserDetail, setUserDetail] = useState([])

    const userId = authUser._id;

    const handleLikeDislike = async (postId, actionType) => {
        if (authUser) {
            try {
                await axios.post(`${url}/posts/${postId}/${actionType}`, { userId });

                setFilteredPosts((prevPosts) =>
                    prevPosts.map((post) => {
                        if (post._id === postId) {
                            if (actionType === 'like') {
                                const updatedLikes = post.like.includes(userId)
                                    ? post.like.filter((id) => id !== userId)
                                    : [...post.like, userId];
                                const updatedDislikes = post.disLike.includes(userId)
                                    ? post.disLike.filter((id) => id !== userId)
                                    : post.disLike; // Remove from dislikes if in the dislike array

                                return { ...post, like: updatedLikes, disLike: updatedDislikes };
                            } else if (actionType === 'dislike') {
                                const updatedDislikes = post.disLike.includes(userId)
                                    ? post.disLike.filter((id) => id !== userId)
                                    : [...post.disLike, userId];
                                const updatedLikes = post.like.includes(userId)
                                    ? post.like.filter((id) => id !== userId)
                                    : post.like;

                                return { ...post, like: updatedLikes, disLike: updatedDislikes };
                            }
                        }
                        return post;
                    })
                );
            } catch (error) {
                console.error('Error updating like/dislike:', error);
                alert('Failed to update. Please try again.');
            }
        } else {
            alert('Please log in to like or dislike a post.');
        }
    };

    const getUserDetails = async () => {
        
        try {

            const response = await fetch(`${url}/users/${post.userId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch user details');
            }
            const userDetails = await response.json();

            setUserDetail(userDetails.user);

        } catch (error) {
            console.error('Error fetching user data:', error);
        }

    }

    useEffect(() => {
        getUserDetails();
    }, [post])

    // console.log('post',post);    

    // console.log('UserDetail',UserDetail);

    let fullImageUrl;

    if (UserDetail && UserDetail.profilePic) {
        if (UserDetail.profilePic.startsWith('http')) {
            fullImageUrl = UserDetail.profilePic;
            // console.log('fullImageUrl 1', UserDetail.profilePic);
        } else {
            const imageUrl = `${url}/profilePics${UserDetail.profilePic.split('/profilePic')[1]}`;
            fullImageUrl = imageUrl;
            // console.log('fullImageUrl 2', imageUrl);
        }
    } else {
        console.log('ReceiverData or ReceiverData.profilePic is missing');
    }
    
    

    return (
        <div className='feed-container'>

            <div className='feed-profile'>
                <div className='feed-profile-img-div'>
                    <img src={fullImageUrl} alt="" />
                </div >
                <div className='feed-profile-userName'>
                    <p>{UserDetail.userName}</p>
                </div>
            </div>

            <div className='feed-main-img-div'>
                <img src={`${url}/images/${post.image}`} alt="" />
            </div>

            <div className='feed-like-dislike-div'>
                <div className="like imgs">
                    <img
                        className='respons'
                        src={like_dislike_images.like}
                        alt="Like"
                        onClick={() => handleLikeDislike(post._id, 'like')}
                    />
                    <p>{post.like?.length}</p>
                </div>
                <div className="dislike imgs">
                    <img
                        className='respons'
                        src={like_dislike_images.dislike}
                        alt="Dislike"
                        onClick={() => handleLikeDislike(post._id, 'dislike')}
                    />
                    <p>{post.disLike?.length}</p>
                </div>
            </div>

            <div className='feed-title-div'>
                <p>{post.title}</p>
            </div>

        </div>
    )
}

export default Feed