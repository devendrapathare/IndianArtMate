import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Show_resp_respting.css'; // Import the CSS file
import ProfileInfo from '../../person-2/components-p2/Profile/ProfileInfo/ProfileInfo';
import Hire_me from './Hire_me';
// import { usePostContext } from '../../../../person-2/context/PostContext/PostContext';
import { usePostContext } from '../../person-2/context/PostContext/PostContext';


const MyProfileDetails = () => {
  const { whatToDo, userId } = useParams();
  const [artiesData, setArtiesData] = useState({});
  const [respectorsData, setRespectorsData] = useState([]);
  const [respectingData, setRespectingData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { url } = usePostContext()


  const modifyImageUrl = (profilePic) => {
    const desiredPath = 'https://avatar.iran.liara.run/public/';
    
    if (profilePic.startsWith(desiredPath)) {
      return profilePic; // Use the existing URL if it's from the desired path
    } else {
      const fullPath = profilePic.replace('/uploads/profilePic', ''); // Adjust the path as needed
      return `${url}/profilePics${fullPath}`; // Construct the desired URL
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/users/${userId}`);
  
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  
        const result = await response.json();
        const userData = result.user; // Adjusted to get the 'user' from the response
  
        if (!userData) {
          throw new Error('User data not found');
        }
  
        setArtiesData(userData);
  
        // Fetch respectors' data
        const respectorsPromises = userData.respectors.map(id => getData(id));
        const respectors = await Promise.all(respectorsPromises);
        setRespectorsData(respectors);
  
        // Fetch respecting's data
        const respectingPromises = userData.respecting.map(id => getData(id));
        const respecting = await Promise.all(respectingPromises);
        setRespectingData(respecting);
  
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.message);
        setLoading(false);
      }
    };
  
    fetchData();
  }, [userId]);
  
  const getData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`);
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const result = await response.json();
      const user = result.user;

      if (user) {
        user.profilePic = modifyImageUrl(user.profilePic); // Modify the profile picture URL
      }

      return user; // Return the 'user' object from the response
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error.message);
      return null; // Return null in case of error
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container_res">
      <div>
        <h3>Respectors</h3>
        {respectorsData.length > 0 ? (
          respectorsData.map((respector, index) => (
            <div key={index} className="respector">
              <img src={respector.profilePic} alt={`${respector.userName}'s Profile`} width="50" />
              <div>
                <strong>Name:</strong> {respector.userName} <br />
                <strong>Respectors:</strong> {respector.respectors.length} <br />
              </div>
              <Link to={`/temp/${respector._id}`}>
                <button className="button">View Profile</button>
              </Link>
            </div>
          ))
        ) : (
          <p className="no-data">No respectors found.</p>
        )}
      </div>

      <div>
        <h3>Respecting</h3>
        {respectingData.length > 0 ? (
          respectingData.map((respecting, index) => (
            <div key={index} className="respector">
              <img src={respecting.profilePic} alt={`${respecting.userName}'s Profile`} width="50" />
              <div>
                <strong>Name:</strong> {respecting.userName} <br />
                <strong>Respectors:</strong> {respecting.respectors.length} <br />
              </div>
              <Link to={`/temp/${respecting._id}`}>
                <button className="button">View Profile</button>
              </Link>
            </div>
          ))
        ) : (
          <p className="no-data">No respecting users found.</p>
        )}
      </div>
    </div>
  );
};

export default MyProfileDetails;
