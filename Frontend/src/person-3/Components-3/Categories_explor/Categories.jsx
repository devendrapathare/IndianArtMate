import React, { useState, useContext, useEffect } from 'react';
import './Categories.css';
import { like_dislike_images } from '../../../assets/assets';
import axios from 'axios';
import { PostContext } from '../../../person-2/context/PostContext/PostContext';
import { useAuthContext } from '../../../person-2/context/AuthContext/AuthContext'; 


const Categories = () => {
  const [showAll, setShowAll] = useState(false);
  const { posts, fetchPostList } = useContext(PostContext); // Using posts from context
  const { authUser } = useAuthContext();
  
  const userId = authUser?._id; 

  useEffect(() => {
    fetchPostList(); // Fetching posts on component mount
  }, [fetchPostList]);

  const handleShowMore = () => {
    setShowAll(prev => !prev);
  };

  const handleLikeDislike = async (postId, actionType) => {
    try {
      console.log("clicled")
      const response = await axios.post(`http://localhost:5000/posts/${postId}/${actionType}`, { userId });
      fetchPostList(); // Refresh the posts to reflect the updated likes/dislikes
      console.log("cliclek")

    } catch (error) {
      console.error('Error updating like/dislike:', error);
    }
  };

  const visiblePosts = showAll ? posts : posts.slice(0, 6);

  return (
    <div className='cat'>
      <center>
        <div className="top">
          <h2>Authentic and Modern Indian</h2>
          <h2>Painting Handloom and Handcraft</h2>
        </div>
        <div className="mid">
          {visiblePosts.map((post) => (
            <div className="card" key={post.id}>
              <img
                id='main-card-img'
                src={`http://localhost:5000/images/${post.image}`} 
                alt={post.title}
              />
              <div className="card-bottom">
                <div className="arties-name">
                  <p>Made by: <span><b><u>shashwat</u></b></span></p> 
                </div>
                <div className="card-bottom-right">
                  <div className="like imgs">
                    <img
                      className='respons' 
                      src={like_dislike_images.like} 
                      alt="Like"
                      onClick={() => handleLikeDislike(post._id, 'like')} // Call handleLikeDislike for like
                    />
                    <p>{post.like?.length}</p>
                  </div>
                  <div className="dislike imgs">
                    <img
                      className='respons' 
                      src={like_dislike_images.dislike} 
                      alt="Dislike"
                      onClick={() => handleLikeDislike(post._id, 'dislike')} // Call handleLikeDislike for dislike
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
