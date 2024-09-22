import React, { useState, useEffect , memo } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopArtistProfile.css'
// import ProfilePage from './person-2/Pages-p2/profilePage/ProfilePage';
import ProfilePage from '../../../Pages-p2/profilePage/ProfilePage';

const TopArtistsList = memo(() => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  console.log("TopArtistsList rendered"); 
  useEffect(() => {
    console.log("useEffect triggered");
  
    const fetchArtists = async () => {
      try {
        const response = await fetch('http://localhost:5000/profile/find_all');
        if (!response.ok) {
          throw new Error('Error fetching data');
        }
        const data = await response.json();
        console.log('Fetched Data:', data);
  
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
    navigate(`/temp/${artistId}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="top-artists-list">
      {artists.map((artist) => (
        <div key={artist._id}>
          <img src={artist.profilePic} alt={artist.userName} />
          <p>{artist.userName}</p>
          <button onClick={() => handleViewProfile(artist._id)}>View Profile</button>
        </div>
      ))}
    </div>
  );
});


export default TopArtistsList
