import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../../person-2/context/AuthContext/AuthContext';
import './Winning.css'; // Importing the CSS file
import { useNavigate } from 'react-router-dom';

const Winning = () => {
  const { authUser, fetchUserData } = useAuthContext();
  const [wonBiddings, setWonBiddings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ownerData, setOwnerData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWinnerBiddings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/bidding/allBiddingData');
        const allBiddings = response.data;

        // Filter the biddings where the authUser is the winner
        const userWonBiddings = allBiddings.filter(
          (bid) => bid.winnerId && bid.winnerId === authUser._id
        );

        setWonBiddings(userWonBiddings);

        // Fetch owner data for each winning bid
        for (const bid of userWonBiddings) {
          if (bid.userId) {
            const userData = await fetchUserData(bid.userId);
            setOwnerData((prevOwnerData) => ({
              ...prevOwnerData,
              [bid._id]: userData, // Store the user data using the bidding ID as key
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching bidding data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (authUser && authUser._id) {
      fetchWinnerBiddings();
    }
  }, [authUser, fetchUserData]);

  if (loading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  const handleProfilePage = (userId) => {
    navigate(`/temp/${userId}`);
  };

  return (
    <div className="winner-container">
      <h2 className="winner-heading">🏆 Your Winning Bids</h2>

      {wonBiddings.length === 0 ? (
        <p className="no-wins">You haven't won any biddings yet.</p>
      ) : (
        <div className="winner-grid">
          {wonBiddings.map((bid) => (
            <div key={bid._id} className="winner-card">
              {/* <p><span className="bold-text">Post ID:</span> {bid.postId}</p> */}
              <p><span className="bold-text">Bidding Amount:</span> ₹{bid.highestPriceReceivedDueToBidding}</p>
              <p className="bold-text"  onClick={()=>handleProfilePage(bid.userId)}>
                <span >Bidding Owner:</span> 
                {ownerData[bid._id] ? ownerData[bid._id].userName : 'Loading...'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Winning;
