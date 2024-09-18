import React, { useEffect, useState } from 'react';
import './Mid_section.css';

const Mid_section = () => {
  const [storeData, setStoreData] = useState(null);
  const [error, setError] = useState(null); 
  const storeId = '66e98753c2f967e8e422269b'; 

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        console.log("entry"); 
        const response = await fetch(`http://localhost:4000/store_by_arti/${storeId}`);
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
  
  // Handle case when received storeData is null
  if (storeData === null) {
    return <div>No store data available</div>;
  }

  // Display loading state if data is not fetched yet
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
          <div>No arties found</div>
        )}
      </div>
    </>
  );
};

export default Mid_section;
