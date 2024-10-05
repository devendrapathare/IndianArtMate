import React, { useContext, useEffect, useState } from 'react';
import './Mid_section.css';
import { useAuthContext } from '../../../../../person-2/context/AuthContext/AuthContext'; 
import { HireContext } from '../../../../../person-2/context/HireContext/HIreContext';
import { usePostContext } from '../../../../../person-2/context/PostContext/PostContext'; // Import usePostContext

const Mid_section = () => {
  const [storeData, setStoreData] = useState(null);
  const [artiesData, setArtiesData] = useState([]); 
  const [error, setError] = useState(null); 
  const { authUser } = useAuthContext();
  const { fetchHiring } = useContext(HireContext);
  const { url } = usePostContext(); 

  // Map through fetchHiring and include _id
  const projectOwnerDetails = fetchHiring.map(item => {
    const owner = item.ProjectOwnerDetails[0];
    return owner ? { ...owner, _id: item._id, hiringState: item.hiringState } : null;
  }).filter(Boolean);
  
  const userId = authUser?._id; 

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await fetch(`${url}/store_by_arti/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStoreData(data);

        // Fetch artist data for each artist ID
        const artistPromises = data.store.list_of_store_arties.map(artistId =>
          fetch(`${url}/users/${artistId}`).then(res => {
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
    <div className='container'>
      <div className="mid-secton-top">
        <h2><u>Your Store Arties</u></h2>
        <button id='mid-secton-top_btn'>Hire Arties</button>
      </div>
      <hr />
      <div className='mid_section-bottom'>
        {projectOwnerDetails.length > 0 ? (
          projectOwnerDetails.filter(artist => artist.hiringState === "Accepted").map((artist) => {
            let imageUrl = artist.profilePic;
            const desiredPath = 'https://avatar.iran.liara.run/public/'; 

            if (imageUrl.startsWith(desiredPath)) {
              imageUrl = artist.profilePic;
            } else {
              const fullPath = artist.profilePic;
              const wantedPath = fullPath.replace('/uploads/profilePic', '');
              imageUrl = `${url}/profilePics${wantedPath}`;
            }
  
            return (
              <React.Fragment key={artist._id}>
                <div className="artist_card">
                  <div className="artist_card_image">
                    <img src={imageUrl} alt="ProfilePic" />
                  </div>
                  <div className="artist-name-respect">
                    <p>{artist.userName}</p>
                    <p><span>{artist.respectors?.length || 0}</span> Respecters</p>
                  </div>
                  <div className="email">
                    <p id='Contact_info'>Email: {artist.email}</p>
                  </div>
                  <div className="chat">
                    <button id="arti-chat">Chat</button>
                  </div>
                </div>
                <hr />
              </React.Fragment>
            );
          })
        ) : (
          <div>No arties currently</div>
        )}
      </div>
    </div>
  );
  
};

export default Mid_section;
