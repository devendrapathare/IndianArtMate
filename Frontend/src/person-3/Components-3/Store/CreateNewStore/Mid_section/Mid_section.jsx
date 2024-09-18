import React, { useEffect, useState } from 'react';
import './Mid_section.css';
import { useAuthContext } from '../../../../../person-2/context/AuthContext/AuthContext'; 


const Mid_section = () => {
  const [storeData, setStoreData] = useState(null);
  const [error, setError] = useState(null); 
  const { authUser } = useAuthContext();
  console.log("User info from AuthContext:", authUser);

  const userId = authUser?._id; 
  console.log("User ID:", userId);


  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        console.log("entry"); 
        const response = await fetch(`http://localhost:4000/store_by_arti/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStoreData(data);
        console.log(data); 
      } catch (error) {
        console.error('Error fetching store data:', error);
        setError(error.message); 
      }
    };
    fetchStoreData();
  }, []);
  
  if (storeData === null) {
    return <div>No store data available</div>;
  }

  if (!storeData) {
    return <div>Loading...</div>;
  }
  
  const arties = Array.isArray(storeData.arties) ? storeData.arties : [];

  return (
    <>
      <div className="mid-secton-top">
        <h2><u>Your Store Arties</u></h2>
        <button id='mid-secton-top_btn'>Hire Arties</button>
      </div>
      <div className='mid_section-bottom'>
        {arties.length > 0 ? (
          arties.map((artist) => (
            <div key={artist._id} className="artist_card">
              <div className="artist_card_right">
                <h3>{artist.name}</h3>
                <p>Respecters: {artist.respectors?.length || 0}</p> 
                <p id='Contact_info'>Email: {artist.email}</p>
              </div>
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
