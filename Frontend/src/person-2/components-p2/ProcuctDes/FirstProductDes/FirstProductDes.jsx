import React, { useContext, useEffect, useState, useRef } from 'react';
import './FirstProductDes.css';
import images_for_categories, { assets } from '../../../../assets/assets';
import { useAuthContext } from '../../../context/AuthContext/AuthContext';
import { CartContext } from '../../../context/CartContext/CartContext';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import toast from 'react-hot-toast';
import { HireContext } from '../../../context/HireContext/HIreContext';
import { usePostContext } from '../../../../person-2/context/PostContext/PostContext';
import Comment from '../../../../person-3/Components-3/Comments/Comment';
import { useChatContext } from '../../../context/chatContext/chatContext';
import { useConversation } from '../../../Zustand/UseConversation';


const FirstProductDes = ({ image, category, description, price, title, userId, id, isOwner, totalLike, totaldisLike }) => {

  const { authUser } = useAuthContext();
  const { cartItems, addItemToCart, removeItemFromCart } = useContext(CartContext);
  const [userData, setUserData] = useState({});
  const [biddingData, setBiddingData] = useState(null);
  const [userBid, setUserBid] = useState('');
  const navigate = useNavigate();
  const respectorsCount = userData.respectors?.length || 0;
  const [highestBidder, setHighestBidder] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isHired, setIsHired] = useState(false);


  let currentTime = new Date();
  let endTime = biddingData?.endTime ? new Date(biddingData.endTime) : null;
  // const { url } = usePostContext()
  let checker = true;
  const { url, deletePostById } = usePostContext()

  const { setMyId, setReceiverId, getMessageReceiverDetails } = useChatContext()

  const { applyHire } = useContext(HireContext)

  const { setSelectedConversation } = useConversation()

  // Reference for the product container
  const productContainerRef = useRef(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);

    // Focus on the product container
    if (productContainerRef.current) {
      productContainerRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }, []);

  const handleChat = async () => {
    setMyId(authUser._id)
    await getMessageReceiverDetails(userId)
    setSelectedConversation(userId)
    navigate('/myChats')
  }

  const handleDeletePost = async () => {
    await deletePostById(id)
    navigate('/profilePage')
  }

  const handleDownloadCA = async () => {
    try {
      const response = await axios.get(`${url}/api/post/downloadPostCA/${id}`, {
        responseType: 'blob', // Important for handling binary data
      });

      // Create a URL for the downloaded file
      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const fileLink = document.createElement('a');
      fileLink.href = fileURL;

      // Set the file name (you can customize this based on your backend response)
      fileLink.setAttribute('download', `Certificate_${id}.pdf`);
      document.body.appendChild(fileLink);

      // Trigger the download
      fileLink.click();

      // Clean up
      fileLink.parentNode.removeChild(fileLink);
      toast.success('Certificate downloaded successfully!');
    } catch (error) {
      console.error('Error downloading certificate:', error.message);
      toast.error('Failed to download the certificate. Please try again.');
    }
  };

  

  useEffect(() => {

    const fetchUserData = async () => {
      if (authUser) {
        try {
          const response = await axios.get(`${url}/users/${userId}`);
          if (response.data) {
            setUserData(response.data.user);
          }
        } catch (error) {
          console.error('Error fetching user data:', error.message);
        }
      }
    };
    fetchUserData();
  }, [userId]);



  useEffect(() => {
    if (userData.profilePic) {
      let currentImageUrl = userData.profilePic;
      const desiredPath = 'https://avatar.iran.liara.run/public/';

      if (currentImageUrl.startsWith(desiredPath)) {
        currentImageUrl = userData.profilePic;
      } else {
        const fullPath = userData.profilePic;
        const wantedpath = fullPath.replace('/uploads/profilePic', '');
        currentImageUrl = `${url}/profilePics${wantedpath}`;
      }
      setImageUrl(currentImageUrl);
    }
  }, [userData.profilePic, authUser.profilePic]);

  // console.log(imageUrl);


  const getTheHighestBidderData = async (userId) => {
    if (authUser) {

      // console.log("from first:", userId)
      const response = await axios.get(`${url}/users/${userId}`);
      if (response.data.success) {
        setHighestBidder(response.data.user);
      }
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
        const response = await axios.get(`${url}/api/bidding/biddingData/${id}`);
        setBiddingData(response.data);
      } catch (error) {
        console.error('Error fetching bidding data:', error.message);
      }
    };

    fetchBiddingData();
  }, [userId]);

  useEffect(() => {
    currentTime = new Date();
    endTime = biddingData?.endTime ? new Date(biddingData.endTime) : null;
  })

  const handleNavigate = () => {
    navigate('/cart');
  };

  const handleProfilePage = () => {
    navigate(`/temp/${userId}`);
  };


  const handleBidSubmit = async () => {

    try {
      const userResponse = await axios.get(`${url}/users/${authUser._id}`);
      const bidAmount = parseFloat(userBid);
      // console.log("userData:", userResponse.data.user);
      if (userResponse.data.user.isUpdated === false) {
        toast.error('Please complete your profile before placing a bid.');
        return;
      }
      if (isNaN(bidAmount) || bidAmount <= biddingData?.highestPriceReceivedDueToBidding) {
        toast.error('Your bid must be higher than the current highest bid!');
        return;
      }


      // Fetch updated user data to get wallet balance
      const userWalletBalance = userResponse.data.user.wallet; // Assuming 'wallet' holds the balance

      if (bidAmount > userWalletBalance) {
        toast.error('Insufficient funds! Please add money to your wallet, After that you can place a bid.');
        return;
      }

      // Proceed with placing the bid
      const response = await axios.post(`${url}/api/bidding/placeBid`, {
        postId: id,
        userId: authUser._id,
        bidAmount: bidAmount
      });

      if (response.data.success) {
        setBiddingData((prevData) => ({
          ...prevData,
          highestPriceReceivedDueToBidding: bidAmount,
          highestBiddingAmountSetBy: authUser?._id
        }));

        handleLock(bidAmount);
        toast.success('Bid placed successfully!');
      } else {
        toast.error('Failed to place the bid. Try again.');
      }
    } catch (error) {
      console.error('Error placing bid:', error.message);
      toast.error('An error occurred. Please try again later.');
    }
  };


  const gotoProfile = (artistId) => {
    navigate(`/temp/${artistId}`);
  };





  const updateLock = async ({ userId, lock, biddingId, biddingOwnerId }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/lock', {
        userId,
        lock,
        biddingId,
        biddingOwnerId
      });

      console.log("Lock updated successfully:", response.data);
      return response.data;

    } catch (error) {
      console.error("Error updating lock:", error.response?.data || error.message);
      throw error;
    }
  };


  const handleLock = async (amount) => {
    const data = {
      userId: authUser?._id,
      lock: amount,
      biddingId: biddingData._id,
      biddingOwnerId: biddingData.userId
    };

    console.log("Data to be sent:", data);

    try {
      const result = await updateLock(data);
      toast.success("Locked successfully! New wallet balance: " + result.wallet?.toFixed(2));
    } catch (err) {
      toast.error("Failed to lock amount");
    }
  };

  return (
    <div className='FirstProductDes-container' ref={productContainerRef}>
      <div className="FirstProductDes-img">
        <img src={image} alt={title} />
      </div>
      <div className="comments-wrapper">
        <div className="section-title">Comments</div>
        <Comment postId={id} Recived_userId={userId} />
      </div>
      <div className="FirstProductDes-main-info">
        <div className="product-panel">
          <div className="section-title">Product Information</div>
          <div className="header-title">
            <h2>{title}</h2>
            <p>({category})</p>
          </div>
        </div>

        <div className="product-panel">
          <div className="section-title">Price Details</div>
          <div className="price header-title">
            <p>₹{price}</p>
            <div id='taxes'>
              <p>No hidden fees – all taxes are included!</p>
            </div>
          </div>
        </div>

        <div className="product-panel description-panel">
          <div className="section-title">Description</div>
          <div className="summery">
            <p>{description}</p>
          </div>
        </div>

        <div className="product-panel">
          <div className="section-title">Artist</div>
          <div onClick={handleProfilePage} className="item-owner">
            <div className="owner-profile">
              <div className="owner-img">
                <img src={imageUrl} alt="Owner Profile" />
              </div>
              <div className="owner-detail">
                <div className="owner-name">
                  <p>{userData.userName}</p>
                </div>
                <div className="owner-respecters">
                  <p><span>{respectorsCount}</span> Respecters</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isOwner === true ? (
          <div className="product-panel">
            <div className="section-title">Bidding Status</div>
            <div className="bidding-section">
              <p>Current Highest Bid: ₹{biddingData?.highestPriceReceivedDueToBidding}</p>
              <p id="profileView" onClick={() => gotoProfile(highestBidder?._id)}>
                Highest Bidder: {highestBidder?.userName || 'No bids yet'}
              </p>
            </div>
          </div>
        ) : isOwner === false ? (
          endTime && currentTime < endTime ? (
            <div className="product-panel">
              <div className="section-title">Place Your Bid</div>
              <div className="bidding-section">
                <p>Current Highest Bid: ₹{biddingData?.highestPriceReceivedDueToBidding}</p>
                <p id="profileView" onClick={() => gotoProfile(highestBidder?._id)}>
                  Highest Bidder: {highestBidder?.userName || 'No bids yet'}
                </p>

                <div className="place-bid">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Enter your bid"
                    value={userBid}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (/^\d*$/.test(value)) {
                        const numericValue = parseInt(value, 10);
                        setUserBid(value === '' ? '' : numericValue);
                      }
                    }}
                  />

                  <button onClick={handleBidSubmit} className="place-bid-btn">
                    Place Bid
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="product-panel">
              <div className="section-title">Bidding Status</div>
              <p>Bidding has ended </p>
            </div>

          )
        ) : (
          (authUser?._id === userId ? (
            <div className="product-panel">
              <div className="section-title">Actions</div>
              <div className="impressions">
                <p>Likes <span>{totalLike}</span> </p>
                <p>Dislikes <span>{totaldisLike}</span> </p>
                <button onClick={handleDeletePost}>Delete Post</button>
                <button onClick={handleDownloadCA}>Download CA</button>
              </div>
            </div>
          ) : (
            <div className="product-panel">
              <div className="section-title">Purchase Options</div>
              <div className="impressions">
                <button onClick={handleChat}>Chat</button>
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
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FirstProductDes;

