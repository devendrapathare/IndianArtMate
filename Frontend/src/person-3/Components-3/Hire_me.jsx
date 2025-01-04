import React, { useContext, useEffect, useState } from 'react';
import './Hire_me.css';
import { usePostContext } from '../../person-2/context/PostContext/PostContext';
import axios from 'axios';
import { CartContext } from '../../person-2/context/CartContext/CartContext';

const Hire_me = ({ profilePic, userName, respectors, hireId, ProjectOwnerId }) => {
  const { url } = usePostContext();
  const { token } = useContext(CartContext);
  const [winners, setWinners] = useState({});
  const [hireState, setHireState] = useState(null); 
 

  console.log(ProjectOwnerId);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const winnerResponse = await axios.get(`${url}/users/${ProjectOwnerId}`);
        if (winnerResponse.data.success) {
          setWinners(winnerResponse.data.user);
        } else {
          console.error(`Failed to fetch winner for ProjectOwnerId ${ProjectOwnerId}:`, winnerResponse.data.message);
        }
      } catch (error) {
        console.error(`Error fetching winner info for ProjectOwnerId ${ProjectOwnerId}:`, error.message);
      }
    };
    getUserData();
  }, [ProjectOwnerId]);

  const HireStateHandler = async (event, HireId) => {
    try {
      const newState = event.target.value;
      console.log("statees", newState);

      if (newState === "Reject") {
        if (window.confirm("You cannot change the status again after this. Do you want to proceed?")) {
          await axios.post(`${url}/api/hiring/verifyHire`, {
            HireId,
            hiringState: newState,
          });
          setHireState(newState);
        } else {
          return;
        }
      } else {
        await axios.post(`${url}/api/hiring/verifyHire`, {
          HireId,
          hiringState: newState,
        });
        setHireState(newState);
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  let imageUrl = winners.profilePic;
  const avatarBaseUrl = 'https://avatar.iran.liara.run/public/';

  if (imageUrl && !imageUrl.startsWith(avatarBaseUrl)) {
    
     imageUrl = `${url}${imageUrl.replace('/uploads/profilePic', '/profilePics')}`;
           

  }

  console.log("Final imageUrl:", imageUrl);

  return (
    <div className='Hire-me-container'>
      <div className="Hire-me-components">
        <div className="profile-pic">
<<<<<<< HEAD
        <img src={`${url}/profilePics${wantedPath}`} alt="ProfilePic" />
=======
          <img src={imageUrl} alt="ProfilePic" />
>>>>>>> acf5acb6854574281dea809c3ca3db3dc8f18e39
        </div>
        <div className="info">
          <p>{userName}</p>
          <p><span>{respectors.length}</span> Respectors</p>
        </div>
        <div className="buttons">
          <button
            className="hire-button"
            value="Accepted"
            onClick={(event) => HireStateHandler(event, hireId)}
            disabled={hireState === 'Accept'} 
          >
            Accept
          </button>
          <button
            className="hire-button"
            value="Reject"
            onClick={(event) => HireStateHandler(event, hireId)}
            disabled={hireState === 'Reject'} 
          >
            Reject
          </button>
        </div>
      </div>
      <hr />
    </div>
  );
}

export default Hire_me;