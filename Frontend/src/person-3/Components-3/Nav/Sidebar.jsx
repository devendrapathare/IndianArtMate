import React, { useEffect, useState, useContext } from 'react';
import './Sidebar.css';
import { useAuthContext } from '../../../person-2/context/AuthContext/AuthContext';
import axios from 'axios';
import { CartContext } from '../../../person-2/context/CartContext/CartContext';
import { useNavigate } from 'react-router-dom';
import HireMeDisplay from '../storeis/HireMeDisplay/HireMeDisplay';
import { usePostContext } from '../../../person-2/context/PostContext/PostContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { authUser } = useAuthContext();
  const { getTotalCartAmount } = useContext(CartContext);
  const { url } = usePostContext();
  const navigate = useNavigate();

  const [biddingNotifications, setBiddingNotifications] = useState([]);
  const [ownerBiddings, setOwnerBiddings] = useState([]);
  const [winners, setWinners] = useState({});
  const [postTitles, setPostTitles] = useState({});
  const [artistNames, setArtistNames] = useState({});
  const [activeTab, setActiveTab] = useState('bidding');
  const [profileImage, setProfileImage] = useState('/defaultProfilePic.png');
  const [imageError, setImageError] = useState(false);
  const userId = authUser?._id;

  // Get user initials for placeholder
  const getUserInitials = () => {
    if (!authUser?.userName) return 'U';
    
    const nameParts = authUser.userName.split(' ');
    if (nameParts.length === 1) return nameParts[0][0].toUpperCase();
    
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  };

  // Load profile picture
  useEffect(() => {
    if (authUser?.profilePic && url) {
      const constructedUrl = `${url}/profilePics${authUser.profilePic.replace('/uploads/profilePic', '')}`;
      
      // Check if the image URL is valid
      const checkImage = new Image();
      checkImage.onload = () => {
        setProfileImage(constructedUrl);
        setImageError(false);
      };
      checkImage.onerror = () => {
        setProfileImage('/defaultProfilePic.png');
        setImageError(true);
      };
      checkImage.src = constructedUrl;
    } else {
      setImageError(true);
    }
  }, [authUser, url]);

  useEffect(() => {
    const fetchBiddingNotifications = async () => {
      try {
        const response = await axios.get(`${url}/api/bidding/notifications/${userId}`);
        if (response.data.success) {
          setBiddingNotifications(response.data.activeBiddingsFromRespectedUsers);
        }
      } catch (error) {
        console.error("Error fetching bidding notifications:", error);
      }
    };

    const fetchOwnerBiddings = async () => {
      try {
        const response = await axios.get(`${url}/api/bidding/ownerBiddings/${userId}`);
        if (response.data.success) {
          setOwnerBiddings(response.data.ownerBiddings);
        }
      } catch (error) {
        console.error("Error fetching owner biddings:", error);
      }
    };

    const startFetching = () => {
      fetchBiddingNotifications();
      fetchOwnerBiddings();
      setInterval(() => {
        fetchBiddingNotifications();
        fetchOwnerBiddings();
      }, 5000);
    };

    if (userId) {
      startFetching();
    }

    return () => {
      clearInterval();
    };
  }, [userId]);

  useEffect(() => {
    const checkOwnerBiddings = async () => {
      if (ownerBiddings.length > 0) {
        for (const bid of ownerBiddings) {
          const { _id, postId, endTime, highestBiddingAmountSetBy } = bid;
          const isBidEnded = new Date(endTime) < new Date();

          try {
            const postResponse = await axios.get(`${url}/api/post/getPostDataByID/${postId}`);
            if (postResponse.data.success) {
              const post = postResponse.data.data;
              setPostTitles(prev => ({ ...prev, [postId]: post.title }));
              console.log("pst:", postResponse);

              const artistResponse = await axios.get(`${url}/users/${post.userId}`);
              if (artistResponse.data.success) {
                setArtistNames(prev => ({ ...prev, [postId]: artistResponse.data.user.userName }));
              }
            }
          } catch (error) {
            console.error('Error fetching post or artist data:', error.message);
          }

          if (isBidEnded && highestBiddingAmountSetBy && !winners[_id]) {
            try {
              const winnerResponse = await axios.get(`${url}/users/${highestBiddingAmountSetBy}`);
              if (winnerResponse.data.success) {
                setWinners(prev => ({
                  ...prev,
                  [_id]: {
                    userName: winnerResponse.data.user.userName,
                    email: winnerResponse.data.user.email,
                    amountToPay: bid.highestPriceReceivedDueToBidding,
                    winnerId: bid.highestBiddingAmountSetBy,
                  },
                }));
              }
            } catch (error) {
              console.error(`Error fetching winner info for bid ID ${_id}:`, error.message);
            }
          }
        }
      }
    };

    checkOwnerBiddings();
  }, [ownerBiddings, winners]);

  const getPostData = async (postId, isOwnerBid = false) => {
    try {
      const response = await axios.get(`${url}/api/post/getPostDataByID/${postId}`);
      if (response.data.success) {
        const post = response.data.data;
        const { image, category, description, price, title, userId, _id: id } = post;
        const imageUrl = `${url}/images/${image}`;

        isOwnerBid = authUser?._id === userId

        navigate('/productDes', {
          state: {
            image: imageUrl,
            category,
            description,
            price,
            title,
            userId,
            id,
            isOwner: isOwnerBid,
          },
        });
      }
    } catch (error) {
      console.error('Error fetching post data:', error.message);
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <h2 className="Notifications">Notifications</h2>
      <hr />
      <div className="top-work">
        <div className='sidebar-profile'>
          {!imageError ? (
            <img 
              src={profileImage} 
              alt="ProfilePic" 
              onError={(e) => {
                e.target.onerror = null; 
                setImageError(true);
              }} 
            />
          ) : (
            <div className="profile-placeholder">
              <span>{getUserInitials()}</span>
            </div>
          )}
        </div>
        <div className="close-button">
          <p className="close-btn" onClick={toggleSidebar}>
            X
          </p>
        </div>
      </div>
      <hr />
      <div className="sidebar-navigation">
        <button
          className={`nav-button ${activeTab === 'bidding' ? 'active' : ''}`}
          onClick={() => setActiveTab('bidding')}
        >
          Bidding
        </button>
        <button
          className={`nav-button ${activeTab === 'hire' ? 'active' : ''}`}
          onClick={() => setActiveTab('hire')}
        >
          Hire
        </button>
      </div>
      {activeTab === 'bidding' ? (
        <>
          <div className="notifications-section">
            <h3>My Ongoing Bids</h3>
            {biddingNotifications.length > 0 ? (
              <ul>
                {biddingNotifications.map((bid) => (
                  <li key={bid._id}>
                    <p>Starting Price: {bid.startingPrice}</p>
                    <p>Highest Bid: {bid.highestPriceReceivedDueToBidding}</p>
                    <p>End Time: {new Date(bid.endTime).toLocaleString()}</p>
                    <button onClick={() => getPostData(bid.postId)}>View</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No active biddings.</p>
            )}
          </div>

          <hr />

          <div className="notifications-section">
            <h3>My Biddings</h3>
            {ownerBiddings.length > 0 ? (
              <ul>
                {ownerBiddings.map((bid) => (
                  <li key={bid._id}>
                    <p>Post Title: {postTitles[bid.postId] || 'Loading title...'}</p>
                    <p>Artist: {artistNames[bid.postId] || 'Loading artist...'}</p>
                    <p>Starting Price: {bid.startingPrice}</p>
                    <p>Highest Bid: {bid.highestPriceReceivedDueToBidding}</p>
                    <p>End Time: {new Date(bid.endTime).toLocaleString()}</p>
                    {new Date(bid.endTime) < new Date() ? (
                      winners[bid._id] ? (
                        <div className="winner-info">
                          <p onClick={() => navigate(`/temp/${winners[bid._id].winnerId}`)} style={{ cursor: 'pointer', color: '#dfe6ff' }}>
                            Winner: {winners[bid._id].userName}
                          </p>
                          <p>Email: {winners[bid._id].email}</p>
                          <p>Amount to Pay: {winners[bid._id].amountToPay}</p>
                        </div>
                      ) : (
                        <p>No winner information available.</p>
                      )
                    ) : (
                      <button onClick={() => getPostData(bid.postId, true)}>View</button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No biddings owned.</p>
            )}
          </div>
        </>
      ) : (
        <div className="no-notifications">
          <p>You Don't Have any Hire Request Now.</p>
          <button 
            className="hire-button"
            onClick={() => navigate('/hire')}
          >
            Hire
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
