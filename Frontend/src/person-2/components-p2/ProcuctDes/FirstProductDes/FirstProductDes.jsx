import React, { useContext, useEffect, useState } from 'react';
import './FirstProductDes.css';
import images_for_categories, { assets } from '../../../../assets/assets';
import { useAuthContext } from '../../../context/AuthContext/AuthContext';
import { CartContext } from '../../../context/CartContext/CartContext';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import toast from 'react-hot-toast';
import { HireContext } from '../../../context/HireContext/HIreContext';

const FirstProductDes = ({ image, category, description, price, title, userId, id, isOwner }) => {
  const { authUser } = useAuthContext();
  // console.log("userID:",userId)
  const { cartItems, addItemToCart, removeItemFromCart } = useContext(CartContext);
  const [userData, setUserData] = useState({});
  const [biddingData, setBiddingData] = useState(null);
  const [userBid, setUserBid] = useState(''); 
  const navigate = useNavigate();
  const respectorsCount = userData.respectors?.length || 0;
  const [highestBidder, setHighestBidder] = useState(null);
  const [isHired, setIsHired] = useState(false);

  const { applyHire } = useContext(HireContext)

    
    const handleHireMe = async () => {
      const ProjectOwnerId = authUser?._id;
      const ContributerId = userId;
      console.log("owner",ProjectOwnerId);
      console.log("receiver",ContributerId);
      console.log("userData",userData);
      console.log("authUser",authUser);
      
      // Validate that ownerId and receiverId are not the same
      if (!ProjectOwnerId) {
        toast.error('You must be logged in to hire.');
        return;
      }
  
      if (ProjectOwnerId === ContributerId) {
        toast.error('You cannot hire yourself.');
        return;
      }
  
      try {
        applyHire(ProjectOwnerId,ContributerId,authUser,userData)
        setIsHired(true); 
      } catch (error) {
        console.error('Error sending hiring request:', error);
        toast.error(error.response?.data?.message || 'An error occurred.');
      }
    };



  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${userId}`);
        if (response.data) {
          setUserData(response.data.user);
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };
    fetchUserData();
  }, [userId]);

  const getTheHighestBidderData = async (id) => {
    const response = await axios.get(`http://localhost:5000/users/${id}`);
    if (response.data) {
      setHighestBidder(response.data);
    }
  };

  useEffect(() => {
    if (biddingData?.highestBiddingAmountSetBy) {
      getTheHighestBidderData(biddingData.highestBiddingAmountSetBy);
    }
  }, [biddingData?.highestBiddingAmountSetBy]);

  useEffect(() => {
    const fetchBiddingData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/bidding/biddingData/${id}`);
        setBiddingData(response.data);
      } catch (error) {
        console.error('Error fetching bidding data:', error.message);
      }
    };

    fetchBiddingData();
  }, [id]);

  const currentTime = new Date();
  const endTime = biddingData?.endTime ? new Date(biddingData.endTime) : null;

  const handleNavigate = () => {
    navigate('/cart');
  };

  const handleProfilePage = () => {
    navigate(`/temp/${userId}`);
  };

  const handleBidSubmit = async () => {
    if (parseFloat(userBid) <= biddingData?.highestPriceReceivedDueToBidding) {
      alert('Your bid must be higher than the current highest bid!');
      return;
    }
    try {
      const response = await axios.post(`http://localhost:5000/api/bidding/placeBid`, {
        postId: id,
        userId: authUser._id,
        bidAmount: userBid
      });

      if (response.data.success) {
        setBiddingData((prevData) => ({
          ...prevData,
          highestPriceReceivedDueToBidding: userBid,
          highestBiddingAmountSetBy: authUser.userName
        }));
        toast.success('Bid placed successfully!');
      } else {
        toast.error('Failed to place the bid. Try again.');
      }
    } catch (error) {
      console.error('Error placing bid:', error.message);
      alert('An error occurred. Please try again later.');
    }
  };

  const gotoProfile = (artistId) => {
    navigate(`/temp/${artistId}`);
  };

  return (
   
   
    <div className='FirstProductDes-container'>
      <div className="FirstProductDes-img">
        <img src={image} alt={title} />
        <center>
        <button onClick={handleHireMe} disabled={isHired}>
            {isHired ? 'Sent' : 'Hire me'}
          </button>        
        </center>
      </div>
      <div className="FirstProductDes-main-info">
        <div className="header-title">
          <h2>{title}</h2>
          <p>({category})</p>
        </div>
        <hr />
        <div className="price">
          <p>₹{price}</p>
          <div>
            <p>No hidden fees – all taxes are included!</p>
          </div>
        </div>
        <hr />
        <div className="summery">
          <p>{description}</p>
        </div>
        <hr />
        <div onClick={handleProfilePage} className="item-owner">
          <p>Designed by</p>
          <div  className="owner-profile">
            <div className="owner-img">
              <img src={userData.profilePic} alt="Owner Profile" />
            </div>
            <div className="owner-detail">
              <div className="owner-name">
                <p>{userData.userName }</p>
              </div>
              <div className="owner-respecters">
                <p><span>{respectorsCount}</span> Respecters</p>
              </div>
            </div>
          </div>
        </div>
        <hr />
        {isOwner === true ? (
          <div className="bidding-section">
            <p>Current Highest Bid: ₹{biddingData?.highestPriceReceivedDueToBidding}</p>
            <p id="profileView" onClick={() => gotoProfile(highestBidder?._id)}>
            Highest Bidder: {highestBidder?.userName || 'No bids yet'}
            </p>
          </div>
        ) : isOwner === false ? (
          endTime && currentTime < endTime ? (
            <div className="bidding-section">
              <p>Current Highest Bid: ₹{biddingData?.highestPriceReceivedDueToBidding}</p>
              <p id="profileView" onClick={() => gotoProfile(highestBidder?._id)}>
                Highest Bidder: {highestBidder?.userName || 'No bids yet'}
              </p>

              <div className="place-bid">
                <input
                  type="number"
                  placeholder="Enter your bid"
                  value={userBid}
                  onChange={(e) => setUserBid(e.target.value)}
                />
                <button onClick={handleBidSubmit} className="place-bid-btn">
                  Place Bid
                </button>
              </div>
            </div>
          ) : (
            <p>Bidding has ended or is not active yet.</p>
          )
        ) : (
          <div className="buttons">
            {!cartItems[id] ? (
              <button onClick={() => addItemToCart(id)} className="buy-btn">Buy Now</button>
            ) : (
              <div className='add-to-cart-edit'>
                <div className="minus-plus">
                  <img onClick={() => removeItemFromCart(id)} src={assets.minus_icon} alt="Remove from Cart" />
                  <p>Quantity: <span>{cartItems[id]}</span></p>
                  <img onClick={() => addItemToCart(id)} src={assets.plus_icon} alt="Add to Cart" />
                </div>
                <button onClick={handleNavigate} className="add-to-cart-btn">Go to Cart</button>
              </div>
            )}
          </div>
        )}

        <hr />
        {authUser._id === userId ? (
          <div className="impressions buttons">
            {/* Add any specific buttons for the owner here if needed */}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>

  );
};

export default FirstProductDes;
