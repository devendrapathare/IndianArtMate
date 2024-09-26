import React, { useEffect, useState } from 'react';
import './Mid_section.css';
import { useAuthContext } from '../../../../../person-2/context/AuthContext/AuthContext'; 

const Mid_section = () => {
  const [storeData, setStoreData] = useState(null);
  const [artiesData, setArtiesData] = useState([]); // State for artist data
  const [error, setError] = useState(null); 
  const { authUser } = useAuthContext();
  
  const userId = authUser?._id; 

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/store_by_arti/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStoreData(data);

        // Fetch artist data for each artist ID
        const artistPromises = data.store.list_of_store_arties.map(artistId =>
          fetch(`http://localhost:5000/users/${artistId}`).then(res => {
            if (!res.ok) {
              throw new Error(`Error fetching artist data: ${res.status}`);
            }
            return res.json();
          })
        );

        const fetchedArtiesData = await Promise.all(artistPromises);
        setArtiesData(fetchedArtiesData); 
      } catch (error) {
        console.error('Error fetching store data:', error);
        setError(error.message); 
      }
    };

    fetchStoreData();
  }, [userId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (storeData === null) {
    return <div>No store data available</div>;
  }

  if (!storeData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="mid-secton-top">
        <h2><u>Your Store Arties</u></h2>
        <button id='mid-secton-top_btn'>Hire Arties</button>
      </div>
      <div className='mid_section-bottom'>
        {artiesData.length > 0 ? (
          artiesData.map((artist) => (
            <div key={artist._id} className="artist_card">
              <div className="artist_card_right">
                <p>Artiest Name : <u>{artist.userName}</u></p>
                <p>Respecters: {artist.respectors?.length || 0}</p> 
                <p id='Contact_info'>Email: {artist.email}</p>
              </div>
                <button id = "arti-chat">Chat</button>
            </div>
          ))
        ) : (
          <div>No arties currently</div>
        )}
      </div>
    </>
  );
};

export default Mid_section;
