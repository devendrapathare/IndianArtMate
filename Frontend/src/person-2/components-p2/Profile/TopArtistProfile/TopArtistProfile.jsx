import React, { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopArtistProfile.css';
import { useAuthContext } from '../../../context/AuthContext/AuthContext';
import { usePostContext } from '../../../context/PostContext/PostContext';

const TopArtistsList = memo(() => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { authUser } = useAuthContext();
  const { fetchSingleUserDetailById } = usePostContext();
  
  const respecting = authUser?.respecting || []; 
  const respectors = authUser?.respectors || [];  
  const userId = authUser?._id;

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await fetch('http://localhost:5000/profile/find_all');
        if (!response.ok) {
          throw new Error('Error fetching data');
        }
        const data = await response.json();
  
        if (Array.isArray(data.user)) {
          setArtists(data.user);
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
    if (fetchSingleUserDetailById) {
      fetchSingleUserDetailById(artistId);
    }
    navigate(`/temp/${artistId}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Filter function to find artists based on the ID arrays (respecting or respectors)
  const filterArtistsByIds = (idArray) => {
    return artists.filter((artist) => idArray.includes(artist._id));
  };

  return (
    <div className="top-artists-list">
    {

      artists
        .filter((artist) => artist._id !== userId)
        .map((artist) => (
          <div key={artist._id} className="artist-card">
            <img src={artist.profilePic} alt={artist.userName} className="artist-profile-pic" />
            <p className="artist-name">{artist.userName}</p>
            <button className="view-profile-button" onClick={() => handleViewProfile(artist._id)}>View Profile</button>
          </div>
        ))
    }
  </div>
);

});
export default TopArtistsList;
