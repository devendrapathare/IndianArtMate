import React, { useState, useContext, useEffect } from 'react';
import './Categories.css';
import { like_dislike_images } from '../../../assets/assets';
import axios from 'axios';
import { PostContext } from '../../../person-2/context/PostContext/PostContext';
import { useAuthContext } from '../../../person-2/context/AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const [showAll, setShowAll] = useState(false);
  const { posts, fetchPostList } = useContext(PostContext);
  const { authUser } = useAuthContext(); // Check if the user is logged in
  const [userNames, setUserNames] = useState({});
  const [filteredPosts, setFilteredPosts] = useState([]);
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  const userId = authUser?._id;

  const fetchUserName = async (userId, postId) => {
    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      const userName = data.user.userName;

      setUserNames((prevUserNames) => ({
        ...prevUserNames,
        [postId]: userName,
      }));
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const GotoPost = async (image, category, description, price, title, userId, id) => {
    if (authUser) {
      navigate('/productDes', {
        state: {
          image: `http://localhost:5000/images/${image}`,
          category,
          description,
          price,
          title,
          userId,
          id,
        },
      });
    } else {
      alert('Please log in to view post details.');
    }
  };

  const fetchBiddingData = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/bidding/biddingData/${postId}`);
  
      if (response.data.userId) {
        return response.data;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching bidding data:', error);
      return null;
    }
  };

  const isBiddingActive = (endTime) => {
    const currentTime = new Date();
    const biddingEndTime = new Date(endTime);
    return currentTime <= biddingEndTime;
  };

  useEffect(() => {
    const filterPostsWithoutBidding = async () => {
      const filtered = [];
    
      for (const post of posts) {
        const biddingData = await fetchBiddingData(post._id);
        if (!biddingData || !isBiddingActive(biddingData.endTime)) {
          filtered.push(post);
        }
      }
    
      setFilteredPosts(filtered);
      setCount((prev) => prev + 1);
    };
    
    if (posts.length >= count) {
      filterPostsWithoutBidding();
    }
  }, [posts]);

  useEffect(() => {
    fetchPostList();
  }, [fetchPostList]);

  useEffect(() => {
    filteredPosts.forEach((post) => {
      if (!userNames[post._id]) {
        fetchUserName(post.userId, post._id);
      }
    });
  }, [filteredPosts, userNames]);

  // Handle like/dislike and update the state instantly
  const handleLikeDislike = async (postId, actionType) => {
    if (authUser) {
      try {
        await axios.post(`http://localhost:5000/posts/${postId}/${actionType}`, { userId });
  
        setFilteredPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post._id === postId) {
              if (actionType === 'like') {
                // If user has liked the post, remove them from dislike array (if present) and add to like array
                const updatedLikes = post.like.includes(userId)
                  ? post.like.filter((id) => id !== userId)
                  : [...post.like, userId];
                const updatedDislikes = post.disLike.includes(userId)
                  ? post.disLike.filter((id) => id !== userId)
                  : post.disLike; // Remove from dislikes if in the dislike array
                
                return { ...post, like: updatedLikes, disLike: updatedDislikes };
              } else if (actionType === 'dislike') {
                // If user has disliked the post, remove them from like array (if present) and add to dislike array
                const updatedDislikes = post.disLike.includes(userId)
                  ? post.disLike.filter((id) => id !== userId)
                  : [...post.disLike, userId];
                const updatedLikes = post.like.includes(userId)
                  ? post.like.filter((id) => id !== userId)
                  : post.like; // Remove from likes if in the like array
                
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
  

  const handleShowMore = () => {
    setShowAll((prev) => !prev);
  };

  const visiblePosts = showAll ? filteredPosts : filteredPosts.slice(0, 6);
  // console.log(visiblePosts);
  

  return (
    <div className='cat'>
      <center>
        <div className="top">
          <h2>Authentic and Modern Indian</h2>
          <h2>Painting Handloom and Handcraft</h2>
        </div>
        <div className="mid">
          {visiblePosts
          .filter(post => post.userId !==authUser._id)
          .map((post) => (
            <div
              className="card"
              key={post._id}
            >
              <img
                id='main-card-img'
                src={`http://localhost:5000/images/${post.image}`}
                alt={post.title}
                onClick={() =>
                  GotoPost(post.image, post.category, post.description, post.price, post.title, post.userId, post._id)
                }
              />
              <div className="card-bottom">
                <div className="arties-name">
                  <p>Made by: <span><b><u>{userNames[post._id] || 'Loading...'}</u></b></span></p>
                </div>
                <div className="card-bottom-right">
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
              </div>
            </div>
          ))}
        </div>
        <div className="bottom">
          {!showAll ? (
            <button className='explore-button' onClick={handleShowMore}>
              Show More
            </button>
          ) : (
            <button className='explore-button' onClick={handleShowMore}>
              Show Less
            </button>
          )}
        </div>
      </center>
    </div>
  );
};

export default Categories;
