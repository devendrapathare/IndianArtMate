import React, { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopArtistProfile.css';
import { useAuthContext } from '../../../context/AuthContext/AuthContext';
import { usePostContext } from '../../../context/PostContext/PostContext';
import axios from 'axios';

const TopArtistsList = memo(() => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { authUser } = useAuthContext();
  const { fetchSingleUserDetailById, url } = usePostContext();

  const respecting = authUser?.respecting || [];
  const respectors = authUser?.respectors || [];
  const userId = authUser?._id;

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.post(`${url}/profile/find_all`, { userId });
        if (response.status !== 200) {
          throw new Error('Error fetching data');
        }
        const data = response.data;
        console.log("recomm:", data)

        // if (Array.isArray(data.user)) {
          if(data.user.length > 0)setArtists(data.user);
          else setError("No recommended users available")
        // } else {
        //   throw new Error('Invalid data format');
        // }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching artists:', error);
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchArtists();
  }, [userId, url]);

  const handleViewProfile = (artistId) => {
    if (fetchSingleUserDetailById) {
      fetchSingleUserDetailById(artistId);
    }
    navigate(`/temp/${artistId}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const filterArtistsByIds = (idArray) => {
    return artists.filter((artist) => idArray.includes(artist._id));
  };

  return (
    <div className="top-artists-list">
      {
        artists
          .filter((artist) => artist._id !== userId)
          .map((artist) => {
            let imageUrl = artist.profilePic;
            const desiredPath = 'https://avatar.iran.liara.run/public/';

            if (imageUrl.startsWith(desiredPath)) {
              imageUrl = artist.profilePic;
            } else {
              const fullPath = artist.profilePic;
              const wantedpath = fullPath.replace('/uploads/profilePic', '');
              imageUrl = `${url}/profilePics${wantedpath}`
            }
            return (
              <div key={artist._id} className="artist-card">
                <img src={imageUrl} alt={artist.userName} className="artist-profile-pic" />
                <p className="artist-name">{artist.userName}</p>
                <button className="view-profile-button" onClick={() => handleViewProfile(artist._id)}>Profile</button>
              </div>
            )
          })
      }
    </div>
  );
});

export default TopArtistsList;