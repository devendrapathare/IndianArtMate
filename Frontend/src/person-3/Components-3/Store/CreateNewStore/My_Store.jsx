import React, { useState } from 'react';
import './My_Store.css';
import ProfileInfo from '../../../../person-2/components-p2/Profile/ProfileInfo/ProfileInfo';
import TopArtistProfileDisplay from '../../../../person-2/components-p2/ProfileDisplay/TopArtistProfileDisplay/TopArtistProfileDisplay';
import Mid_section from './Mid_section/Mid_section';

const CreateStore = () => {
  const [storeAvailable, setStoreAvailable] = useState(false);  
  const userId = '66e98753c2f967e8e422269b'; 
  const [storeName, setStoreName] = useState(''); // To hold the store name

  const handleCreateStore = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Create the payload for the API
    const payload = {
      userId,        
      storeName      
    };

    try {
      const response = await fetch('http://localhost:4000/create_store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // Send the payload as JSON
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Store created successfully:", data);
        setStoreAvailable(true); // After creating a store, update the state to show the mid-section
      } else {
        console.error('Failed to create store:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating store:', error);
    }
  };

  return (
    <div className='CreateStore'>
      <div className="store-left">
        <ProfileInfo/>
      </div>

      <div className="store-mid">
        {!storeAvailable ? (
          <>
            <h2>You Don't Have A Store Currently</h2>
            <h2>But You Can Create one</h2>
            <form onSubmit={handleCreateStore}> {/* Call handleCreateStore on form submit */}
              <input 
                type='text' 
                name="store-name" 
                value={storeName} 
                onChange={(e) => setStoreName(e.target.value)}  // Update store name
                required 
                placeholder="Store Name"
              />
              <button type='submit'>Create Store</button>
            </form>
          </>
        ) : (
          <Mid_section setStoreAvailable={setStoreAvailable}/>
        )}
      </div>

      <div className="store-right">
        <TopArtistProfileDisplay/>
      </div>
    </div>
  );
};

export default CreateStore;
