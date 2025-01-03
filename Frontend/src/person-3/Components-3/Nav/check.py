import React, { useEffect, useState, useContext } from 'react';
import './Sidebar.css';
import { useAuthContext } from '../../../person-2/context/AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import Hire_me from '../Hire_me';
import HireMeDisplay from '../storeis/HireMeDisplay/HireMeDisplay';
import { useAppContext } from '../../../person-2/context/AppContext'; // Import multi-context provider

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { authUser } = useAuthContext();
  const {
    getBiddingNotifications,
    getOwnerBiddings,
    getPostDataById,
    getUserById,
    removeEndedBiddingNotification
  } = useAppContext(); // Use the multi-context provider
  const [biddingNotifications, setBiddingNotifications] = useState([]);
  const [ownerBiddings, setOwnerBiddings] = useState([]);
  const [winners, setWinners] = useState({});
  const [loadingWinners, setLoadingWinners] = useState({});
  const [postTitles, setPostTitles] = useState({});
  const [artistNames, setArtistNames] = useState({});
  const [activeTab, setActiveTab] = useState('bidding');

  const navigate = useNavigate();
  const userId = authUser?._id;

  useEffect(() => {
    if (userId) {
      getBiddingNotifications(userId).then((notifications) => {
        setBiddingNotifications(notifications);
      });

      getOwnerBiddings(userId).then((biddings) => {
        setOwnerBiddings(biddings);
      });
    }
  }, [userId, getBiddingNotifications, getOwnerBiddings]);

  useEffect(() => {
    const updateOwnerBiddings = async () => {
      for (const bid of ownerBiddings) {
        const { _id, postId, endTime, highestBiddingAmountSetBy } = bid;
        const isBidEnded = new Date(endTime) < new Date();

        try {
          const post = await getPostDataById(postId);
          setPostTitles((prev) => ({ ...prev, [postId]: post.title }));

          const artist = await getUserById(post.userId);
          setArtistNames((prev) => ({ ...prev, [postId]: artist.userName }));

          if (isBidEnded && highestBiddingAmountSetBy && !winners[_id]) {
            setLoadingWinners((prev) => ({ ...prev, [_id]: true }));

            const winner = await getUserById(highestBiddingAmountSetBy);
            setWinners((prev) => ({
              ...prev,
              [_id]: {
                userName: winner.userName,
                email: winner.email,
                amountToPay: bid.highestPriceReceivedDueToBidding,
                winnerId: highestBiddingAmountSetBy,
              },
            }));
            setLoadingWinners((prev) => ({ ...prev, [_id]: false }));
          }
        } catch (error) {
          console.error('Error processing bid:', error);
        }
      }
    };

    if (ownerBiddings.length) {
      updateOwnerBiddings();
    }
  }, [ownerBiddings, winners, getPostDataById, getUserById]);

  const handlePostView = (postId, isOwnerBid = false) => {
    getPostDataById(postId).then((post) => {
      const { image, category, description, price, title, userId, _id: id } = post;
      const imageUrl = `${process.env.REACT_APP_API_URL}/images/${image}`;

      isOwnerBid = authUser?._id === userId;

      navigate('/productDes', {
        state: { image: imageUrl, category, description, price, title, userId, id, isOwner: isOwnerBid },
      });
    });
  };

  return (
    <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <h2 className="Notifications">Notifications</h2>
      <hr />
      <div className="top-work">
        <div className="sidebar-profile">
          <img src={authUser?.profilePic || '/defaultProfilePic.png'} alt="ProfilePic" />
        </div>
        <div className="close-button">
          <p className="close-btn" onClick={toggleSidebar}>X</p>
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
                    <button
                      onClick={() => {
                        handlePostView(bid.postId);
                        if (new Date(bid.endTime) < new Date()) {
                          removeEndedBiddingNotification(bid._id);
                          setBiddingNotifications((prev) => prev.filter((n) => n._id !== bid._id));
                        }
                      }}
                    >
                      View
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No active biddings.</p>
            )}
          </div>

          <div className="notifications-section">
            <h3>My Biddings</h3>
            {ownerBiddings.length > 0 ? (
              <ul>
                {ownerBiddings.map((bid) => (
                  <li key={bid._id}>
                    <p>Post Title: {postTitles[bid.postId] || 'Loading...'}</p>
                    <p>Artist: {artistNames[bid.postId] || 'Loading...'}</p>
                    <p>Starting Price: {bid.startingPrice}</p>
                    <p>Highest Bid: {bid.highestPriceReceivedDueToBidding}</p>
                    <p>End Time: {new Date(bid.endTime).toLocaleString()}</p>
                    {new Date(bid.endTime) < new Date() ? (
                      winners[bid._id] ? (
                        <div className="winner-info">
                          <p
                            onClick={() => navigate(`/temp/${winners[bid._id].winnerId}`)}
                            style={{ cursor: 'pointer', color: 'blue' }}
                          >
                            Winner: {winners[bid._id].userName}
                          </p>
                          <p>Email: {winners[bid._id].email}</p>
                          <p>Amount to Pay: {winners[bid._id].amountToPay}</p>
                        </div>
                      ) : (
                        <p>No winner information available.</p>
                      )
                    ) : (
                      <button onClick={() => handlePostView(bid.postId, true)}>View</button>
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
        <div className="hire-section">
          <HireMeDisplay />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
