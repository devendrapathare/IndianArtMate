import React, { useContext, useEffect, useState } from 'react';
import './Hire_me.css';
import { usePostContext } from '../../person-2/context/PostContext/PostContext';
import axios from 'axios';
import { CartContext } from '../../person-2/context/CartContext/CartContext';

const Hire_me = ({ profilePic, userName, respectors, hireId }) => {
  const { url } = usePostContext();
  const { token } = useContext(CartContext);
  
  // State to trigger re-render
  const [hireState, setHireState] = useState(null); // Hold the hiring state

  const fullPath = profilePic;
  const wantedPath = fullPath.replace('/uploads/profilePic', '');

  useEffect(() => {
  }, [hireState]);

  const HireStateHandler = async (event, HireId) => {
    try {
      const newState = event.target.value;
      console.log("statees", newState);

      if (newState === "Reject") {
        if (window.confirm("You cannot change the status again after this. Do you want to proceed?")) {
          const response = await axios.post(`${url}/api/hiring/verifyHire`, {
            HireId,
            hiringState: newState,
          });
          setHireState(newState); // Update state here
        } else {
          return;
        }
      } else {
        const response = await axios.post(`${url}/api/hiring/verifyHire`, {
          HireId,
          hiringState: newState,
        });
        setHireState(newState); // Update state here
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='Hire-me-container'>
      <div className="Hire-me-components">
        <div className="profile-pic">
        <img src={`${url}/profilePics${wantedPath}`} alt="ProfilePic" />
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
            disabled={hireState === 'Accept'} // Disable if already accepted
          >
            Accept
          </button>
          <button
            className="hire-button"
            value="Reject"
            onClick={(event) => HireStateHandler(event, hireId)}
            disabled={hireState === 'Reject'} // Disable if already rejected
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