import React, { useEffect, useState, useContext } from 'react';
import './Sidebar.css';
import { useAuthContext } from '../../../person-2/context/AuthContext/AuthContext';
import axios from 'axios';
import { CartContext } from '../../../person-2/context/CartContext/CartContext';
import { useNavigate } from 'react-router-dom';
import Hire_me from '../Hire_me';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { authUser } = useAuthContext();
  const { getTotalCartAmount } = useContext(CartContext);
  const [biddingNotifications, setBiddingNotifications] = useState([]);
  const [ownerBiddings, setOwnerBiddings] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [loadingOwnerBiddings, setLoadingOwnerBiddings] = useState(false);
  const [winners, setWinners] = useState({});
  const [loadingWinners, setLoadingWinners] = useState({});
  const [postTitles, setPostTitles] = useState({});
  const [artistNames, setArtistNames] = useState({});
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('bidding'); // New state for active tab

  const userId = authUser?._id;

  const NavigationForWinner = (userId) => {
    console.log("userId:", userId);
    navigate(`/temp/${userId}`);
  };

  useEffect(() => {
    const fetchBiddingNotifications = async () => {
      setLoadingNotifications(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/bidding/notifications/${userId}`);
        if (response.data.success) {
          setBiddingNotifications(response.data.activeBiddingsFromRespectedUsers);
        } else {
          console.error("Failed to fetch bidding notifications:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching bidding notifications:", error);
      } finally {
        setLoadingNotifications(false);
      }
    };

    const fetchOwnerBiddings = async () => {
      setLoadingOwnerBiddings(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/bidding/ownerBiddings/${userId}`);
        if (response.data.success) {
          setOwnerBiddings(response.data.ownerBiddings);
        } else {
          console.error("Failed to fetch owner biddings:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching owner biddings:", error);
      } finally {
        setLoadingOwnerBiddings(false);
      }
    };

    if (userId) {
      fetchBiddingNotifications();
      fetchOwnerBiddings();
    }
  }, [userId]);

  useEffect(() => {
    const checkOwnerBiddings = async () => {
      if (ownerBiddings.length > 0) {
        for (const bid of ownerBiddings) {
          const { _id, postId, endTime, highestBiddingAmountSetBy } = bid;
          const isBidEnded = new Date(endTime) < new Date();

          try {
            const postResponse = await axios.get(`http://localhost:5000/api/post/getPostDataByID/${postId}`);
            if (postResponse.data.success) {
              const post = postResponse.data.data;
              setPostTitles(prev => ({ ...prev, [postId]: post.title }));

              const artistResponse = await axios.get(`http://localhost:5000/users/${post.userId}`);
              if (artistResponse.data.success) {
                setArtistNames(prev => ({ ...prev, [postId]: artistResponse.data.user.userName }));
              }
            }
          } catch (error) {
            console.error('Error fetching post or artist data:', error.message);
          }

          if (isBidEnded && highestBiddingAmountSetBy && !winners[_id]) {
            setLoadingWinners(prev => ({ ...prev, [_id]: true }));

            try {
              console.log("in try");
              const winnerResponse = await axios.get(`http://localhost:5000/users/${highestBiddingAmountSetBy}`);
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
              } else {
                console.error(`Failed to fetch winner for bid ID ${_id}:`, winnerResponse.data.message);
              }
            } catch (error) {
              console.error(`Error fetching winner info for bid ID ${_id}:`, error.message);
            } finally {
              setLoadingWinners(prev => ({ ...prev, [_id]: false }));
            }
          }
        }
      }
    };

    checkOwnerBiddings();
  }, [ownerBiddings, winners]);

  const getPostData = async (postId, isOwnerBid = false) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/post/getPostDataByID/${postId}`);
      if (response.data.success) {
        const post = response.data.data;
        const { image, category, description, price, title, userId, _id: id } = post;
        console.log("userId....:",userId)
        console.log("userId---id....:",id)
        const imageUrl = `http://localhost:5000/images/${image}`;

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
      } else {
        console.error('Post data not found');
      }
    } catch (error) {
      console.error('Error fetching post data:', error.message);
    }
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <button className="close-btn" onClick={toggleSidebar}>
          &times;
        </button>
        <div className='sidebar-profile'>
          <img src={authUser.profilePic} alt="Profile" />
        </div>

        {/* New Navigation Buttons */}
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

        {/* Conditional Rendering Based on Active Tab */}
        {activeTab === 'bidding' ? (
          <>
            {/* Bidding Notifications Section */}
            <div className="notifications-section">
              <h3>My Ongoing Bids</h3>
              {loadingNotifications ? (
                <p>Loading...</p>
              ) : biddingNotifications.length > 0 ? (
                <ul>
                  {biddingNotifications.map((bid) => (
                    <li key={bid._id}>
                      {/* <p>Post Title: {postTitles[bid.postId] || 'Loading title...'}</p> */}
                      {/* <p>Artist: {artistNames[bid.postId] || 'Loading artist...'}</p> */}
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

            {/* My Biddings Section */}
            <div className="notifications-section">
              <h3>My Biddings</h3>
              {loadingOwnerBiddings ? (
                <p>Loading...</p>
              ) : ownerBiddings.length > 0 ? (
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
                            <p onClick={() => NavigationForWinner(winners[bid._id].winnerId)} style={{ cursor: 'pointer', color: 'blue' }}>
                              Winner: {winners[bid._id].userName}
                            </p>
                            <p>Email: {winners[bid._id].email}</p>
                            <p>Amount to Pay: {winners[bid._id].amountToPay}</p>
                          </div>
                        ) : loadingWinners[bid._id] ? (
                          <p>Fetching winner information...</p>
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
          // Hire_me Component Section
          <div className="hire-section">
            <Hire_me />
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
