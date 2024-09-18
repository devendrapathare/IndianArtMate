import React, { useState, useEffect } from 'react';
import './My_Store.css';
import ProfileInfo from '../../../../person-2/components-p2/Profile/ProfileInfo/ProfileInfo';
import TopArtistProfileDisplay from '../../../../person-2/components-p2/ProfileDisplay/TopArtistProfileDisplay/TopArtistProfileDisplay';
import Mid_section from './Mid_section/Mid_section';
import { useAuthContext } from '../../../../person-2/context/AuthContext/AuthContext'; 

const CreateStore = () => {
  // const { authUser } = useAuthContext(); // Get authUser from context
  const [storeAvailable, setStoreAvailable] = useState(false);  
  // const userId = authUser._Id; // Use authUser from context
  const [storeName, setStoreName] = useState('');
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const { authUser } = useAuthContext();
  console.log("User info from AuthContext:", authUser);

  const userId = authUser?._id; // Fetch the userId from authUser
  console.log("User ID:", userId);


  const handleCreateStore = async (e) => {
    e.preventDefault(); 
    console.log("Creating store for user:", userId);  

    if (!userId) {
      console.error('User ID is not available');
      return;
    }

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
        body: JSON.stringify(payload), 
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Store created successfully:", data);
        setStoreAvailable(true);
      } else {
        console.error('Failed to create store:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating store:', error);
    }
  };

  useEffect(() => {
    const checkStore = async () => {
      // console.log("Creating store for user:", userId);  

      try {
        const response = await fetch(`http://localhost:4000/check_store/${userId}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Data:', data);
          if (data.hasStore) {
            setStoreAvailable(true);
          } else {
            setStoreAvailable(false);
          }
        } else {
          console.error('Failed to fetch store data:', response.statusText);
        }
      } catch (error) {
        console.error('Error checking store:', error);
      } finally {
        setLoading(false);
      }
    };
  
    checkStore();
  }, [userId]);
  

  // Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Error state
  if (error) {
    return <div>Error: {error}</div>;
  }

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
            <form onSubmit={handleCreateStore}>
              <input 
                type='text' 
                name="store-name" 
                value={storeName} 
                onChange={(e) => setStoreName(e.target.value)}  
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
