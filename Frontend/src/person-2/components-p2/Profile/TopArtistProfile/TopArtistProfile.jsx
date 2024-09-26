import React, { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopArtistProfile.css';
import { useAuthContext } from '../../../context/AuthContext/AuthContext';

const TopArtistsList = memo(() => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { authUser } = useAuthContext();
  
  const userId = authUser?._id;

 useEffect(() => {
  const fetchArtists = async () => {
    try {
      const response = await fetch('http://localhost:5000/profile/find_all');
      if (!response.ok) {
        throw new Error('Error fetching data');
      }
      const data = await response.json();

      // Process the data
      if (Array.isArray(data.user)) {
        const updatedUsers = data.user.map(user => {
          // Check if profilePic starts with 'http', if not, add the server URL
          if (!user.profilePic.startsWith('http')) {
            user.profilePic = `http://localhost:5000/profilePics${user.profilePic.split('/profilePic')[1]}`;
          }
          return user;
        });

        setArtists(updatedUsers);
      } else {
        throw new Error('Invalid data format');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching artists:', error);
      setError('Error fetching data');
      setLoading(false);
    }
  };

  fetchArtists();
}, []);


  const handleViewProfile = (artistId) => {
    navigate(`/temp/${artistId}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="top-artists-list">
      {artists
        .filter((artist) => artist._id !== userId)  // Skip if artist id matches the logged-in user id
        .map((artist) => (
          <div key={artist._id}>
            <img src={artist.profilePic} alt={artist.userName} />
            <p>{artist.userName}</p>
            <button onClick={() => handleViewProfile(artist._id)}>View Profile</button>
          </div>
        ))
      }
    </div>
  );
});

export default TopArtistsList;
