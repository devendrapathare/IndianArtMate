import { forEach } from 'lodash';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Show_resp_respting.css'; // Import the CSS file
import ProfileInfo from '../../person-2/components-p2/Profile/ProfileInfo/ProfileInfo';
import Hire_me from './Hire_me';

const MyProfileDetails = () => {
  const { whatToDo, userId } = useParams();
  const [artiesData, setArtiesData] = useState({});
  const [respectorsData, setRespectorsData] = useState([]);
  const [respectingData, setRespectingData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/users/${userId}`);

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setArtiesData(data);

        // Fetch respectors' data
        const respectorsPromises = data.respectors.map(id => getData(id));
        const respectors = await Promise.all(respectorsPromises);
        setRespectorsData(respectors);

        // Fetch respecting's data
        const respectingPromises = data.respecting.map(id => getData(id));
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

      const data = await response.json();
      return data; // Return the fetched data
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
      {/* <h2>Profile Details</h2> */}
      {/* <div className="user-data">
        <img src={artiesData.profilePic} alt="Your Profile" width="50" />
        <div className="user-info">
          <h3>Your Data</h3>
          <p>Name: {artiesData.name}</p>
        </div>
      </div> */}

      <div>
        <h3>Respectors</h3>
        {respectorsData.length > 0 ? (
          respectorsData.map((respector, index) => (
            <div key={index} className="respector">
              <img src={respector.profilePic} alt={`${respector.name}'s Profile`} width="50" />
              <div>
                <strong>Name:</strong> {respector.userName} <br />
                <strong>Respectors Count:</strong> {respector.respectors.length} <br />
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
                <strong>Respectors Count:</strong> {respecting.respectors.length} <br />
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
