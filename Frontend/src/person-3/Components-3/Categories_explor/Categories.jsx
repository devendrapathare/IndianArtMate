import React, { useState, useContext, useEffect } from 'react';
import './Categories.css';
import axios from 'axios';
import { PostContext, usePostContext } from '../../../person-2/context/PostContext/PostContext';
import { useAuthContext } from '../../../person-2/context/AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import CategoryComp from '../../../person-2/components-p2/HomePageComp/CategoryComp/CategoryComp';

const Categories = () => {
  const [showAll, setShowAll] = useState(false);
  const { posts, fetchPostList } = useContext(PostContext);
  const { authUser } = useAuthContext(); // Check if the user is logged in
  const [userNames, setUserNames] = useState({});
  const [filteredPosts, setFilteredPosts] = useState([]);
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const { url } = usePostContext();
  const userId = authUser?._id;

  const fetchUserName = async (userId, postId) => {
    try {
      const response = await fetch(`${url}/users/${userId}`);
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      // console.log('data', data.user);

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
          image: `${url}/images/${image}`,
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
      const response = await axios.get(`${url}/api/bidding/biddingData/${postId}`);

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

  // useEffect(() => {
  //   fetchPostList();
  // }, [fetchPostList]);

  useEffect(() => {
    filteredPosts.forEach((post) => {
      if (!userNames[post._id]) {
        fetchUserName(post.userId, post._id);
      }
    });
  }, [filteredPosts, userNames]);
  // console.log('userNames',userNames);


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
                  : post.disLike;

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
            console.log('psto', post);

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

  const renderStars = (rating) => {
    const maxStars = 5;
    const fullStars = Math.floor(rating); // Full stars
    const hasHalfStar = rating % 1 >= 0.5; // Half star check
    const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0); // Empty stars

    return (
      <span className="star-rating">
        {"★".repeat(fullStars)} {/* Full stars */}
        {hasHalfStar ? "⯪" : ""} {/* Half star */}
        {"☆".repeat(emptyStars)} {/* Empty stars */}
      </span>
    );
  };

  // console.log('commentr3eanks', CommentRanks);

  const visiblePosts = showAll ? filteredPosts : filteredPosts.slice(0, 6);
  // console.log(posts);

  const sortedPosts = [...visiblePosts].sort((a, b) => {
    const rankA = (a.commentRank + a.likeDislikeRank) / 2;
    const rankB = (b.commentRank + b.likeDislikeRank) / 2;
    return rankB - rankA; // Descending order
  });


  return (
    <div className='cat'>
      <center>
        <div className="top">
          <h2>Authentic and Modern Indian</h2>
          <h2>Painting Handloom and Handcraft</h2>
        </div>
        <div className="Title">
          <h1>Masterpieces of Our Collection</h1>
        </div>
        <div className="mid">
          {sortedPosts.slice(0, 3).map((post) => (
            <div key={post._id}>
              <CategoryComp post={post} userNames={userNames} url={url} renderStars={renderStars} handleLikeDislike={handleLikeDislike} GotoPost={GotoPost} />
            </div>
          ))}

        </div>
        {/* <center> */}
        {/* <center>
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
        </center> */}
        {/* <center/> */}
      </center>
      
      <center>
        <div className="Title">
          <h1>Our Arts</h1>
        </div>
        <div className="mid">
          {visiblePosts
            .filter(post => post.userId !== authUser?._id)
            .map((post) => (
              <div key={post._id}>
                <CategoryComp post={post} userNames={userNames} url={url} renderStars={renderStars} handleLikeDislike={handleLikeDislike} GotoPost={GotoPost} />
              </div>
            ))}
        </div>

        <center>
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

      </center>

    </div>
  );
};

export default Categories;