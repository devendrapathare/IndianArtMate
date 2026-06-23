import React, { useState, useContext, useEffect, useRef } from 'react';
import './Categories.css';
import axios from 'axios';
import { PostContext, usePostContext } from '../../../person-2/context/PostContext/PostContext';
import { useAuthContext } from '../../../person-2/context/AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import CategoryComp from '../../../person-2/components-p2/HomePageComp/CategoryComp/CategoryComp';

const Categories = () => {
  const [showAll, setShowAll] = useState(false);
  const [animateNewCards, setAnimateNewCards] = useState(false);
  const { posts, fetchPostList } = useContext(PostContext);
  const { authUser } = useAuthContext(); // Check if the user is logged in
  const [userNames, setUserNames] = useState({});
  const [filteredPosts, setFilteredPosts] = useState([]);
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const { url } = usePostContext();
  const userId = authUser?._id;
  
  // Refs for scroll animation
  const topRef = useRef(null);
  const firstTitleRef = useRef(null);
  const secondTitleRef = useRef(null);
  const bottomRef = useRef(null);
  const cardRefs = useRef([]);
  const lastScrollY = useRef(0);
  const isHeadingVisible = useRef(false);

  // Trigger top heading animation on mount
  useEffect(() => {
    // Add a small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      if (topRef.current) {
        topRef.current.classList.add('animate');
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Scroll animation handler with reset functionality
  useEffect(() => {
    const resetHeadingAnimation = () => {
      if (topRef.current) {
        topRef.current.classList.remove('animate');
        // Force reflow to reset the animation
        void topRef.current.offsetWidth;
        // Re-add the class after a short delay
        setTimeout(() => {
          if (topRef.current) {
            topRef.current.classList.add('animate');
          }
        }, 50);
      }
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingUp = currentScrollY < lastScrollY.current;
      
      // Create IntersectionObserver
      const scrollObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Handle the top heading specially
            if (entry.target === topRef.current) {
              if (entry.isIntersecting) {
                if (!isHeadingVisible.current && scrollingUp) {
                  // Reset animation when scrolling up into view
                  resetHeadingAnimation();
                }
                isHeadingVisible.current = true;
              } else {
                isHeadingVisible.current = false;
              }
              entry.target.classList.toggle('animate', entry.isIntersecting);
            } 
            // Handle other elements normally
            else if (entry.isIntersecting) {
              entry.target.classList.add('animate');
            }
          });
        },
        { threshold: 0.1 }
      );

      // Observe main sections
      if (topRef.current) scrollObserver.observe(topRef.current);
      if (firstTitleRef.current) scrollObserver.observe(firstTitleRef.current);
      if (secondTitleRef.current) scrollObserver.observe(secondTitleRef.current);
      if (bottomRef.current) scrollObserver.observe(bottomRef.current);

      // Observe all card elements
      cardRefs.current.forEach((ref) => {
        if (ref) scrollObserver.observe(ref);
      });
      
      // Update last scroll position
      lastScrollY.current = currentScrollY;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [filteredPosts]);

  // Initialize card refs
  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, filteredPosts.length);
  }, [filteredPosts]);

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

  useEffect(() => {
    filteredPosts.forEach((post) => {
      if (!userNames[post._id]) {
        fetchUserName(post.userId, post._id);
      }
    });
  }, [filteredPosts, userNames]);

  const handleShowMore = () => {
    if (!showAll) {
      // When showing more cards, set the animation flag
      setAnimateNewCards(true);
      // Scroll to the "Our Arts" heading
      secondTitleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // When showing fewer cards, reset the animation flag
      setAnimateNewCards(false);
    }
    setShowAll(!showAll);
  };

  const handleLikeDislike = async (postId, action) => {
    if (!authUser) {
      alert('Please log in to like or dislike posts.');
      return;
    }

    try {

      const path = `${url}/posts/${action}/${postId}`
      console.log(postId)
      // Make API request to like/dislike endpoint
      await axios.post(path, {
        userId: authUser._id,
      });

      // Refresh posts to update UI
      fetchPostList();
    } catch (error) {
      console.error(`Error ${action === 'like' ? 'liking' : 'disliking'} post:`, error);
    }
  };

  const renderStars = (rating) => {
    const maxStars = 5;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <span className="star-rating">
        {"★".repeat(fullStars)}
        {hasHalfStar ? "⯪" : ""}
        {"☆".repeat(emptyStars)}
      </span>
    );
  };

  // Determine visible posts
  const visiblePosts = showAll ? filteredPosts.slice(0, 12) : filteredPosts.slice(0, 6);

  const sortedPosts = [...visiblePosts].sort((a, b) => {
    const rankA = (a.commentRank + a.likeDislikeRank) / 2;
    const rankB = (b.commentRank + b.likeDislikeRank) / 2;
    return rankB - rankA;
  });

  return (
    <div className='cat'>
      <div className="top" ref={topRef}>
        <h2 className="headline-text">Authentic and Modern Indian</h2>
        <h2 className="headline-text">Painting Handloom and Handcraft</h2>
      </div>
      
      <div className="Title" ref={firstTitleRef}>
        <h1>Masterpieces of Our Collection</h1>
      </div>
      
      <div className="mid">
        {sortedPosts.slice(0, 3).map((post, index) => (
          <div key={post._id} ref={el => cardRefs.current[index] = el}>
            <CategoryComp 
              post={post} 
              userNames={userNames} 
              url={url} 
              renderStars={renderStars} 
              handleLikeDislike={handleLikeDislike} 
              GotoPost={GotoPost} 
            />
          </div>
        ))}
      </div>
      
      <div className="Title" ref={secondTitleRef}>
        <h1>Our Arts</h1>
      </div>
      
      <div className="mid">
        {sortedPosts.slice(3, 6).map((post, index) => (
          <div 
            key={post._id} 
            ref={el => cardRefs.current[index + 3] = el}
          >
            <CategoryComp 
              post={post} 
              userNames={userNames} 
              url={url} 
              renderStars={renderStars} 
              handleLikeDislike={handleLikeDislike} 
              GotoPost={GotoPost} 
            />
          </div>
        ))}
        
        {showAll && sortedPosts.slice(6, 12).map((post, index) => (
          <div 
            key={post._id} 
            ref={el => cardRefs.current[index + 6] = el}
            className={animateNewCards ? 'pop-animation' : ''}
          >
            <CategoryComp 
              post={post} 
              userNames={userNames} 
              url={url} 
              renderStars={renderStars} 
              handleLikeDislike={handleLikeDislike} 
              GotoPost={GotoPost} 
            />
          </div>
        ))}
      </div>

      <div className="bottom" ref={bottomRef}>
        <button className='explore-button' onClick={handleShowMore}>
          {!showAll ? 'Show More' : 'Show Less'}
        </button>
      </div>
    </div>
  );
};

export default Categories;