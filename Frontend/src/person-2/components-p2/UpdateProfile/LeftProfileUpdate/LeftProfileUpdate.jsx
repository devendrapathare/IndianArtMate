import React, { useEffect, useState } from 'react';
import './LeftProfileUpdate.css';
import axios from 'axios'; // Import axios for making API calls
import { useAuthContext } from '../../../../person-2/context/AuthContext/AuthContext'; // Assuming this is where auth context is located

const LeftProfileUpdate = () => {
  const { authUser } = useAuthContext();
  const userId = authUser?._id; // Get the user ID from the auth context

  const [image, setImage] = useState(null); // State to store the current or uploaded image

  // Fetch user data from API
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${userId}`); // Fetch the user data from API
        setImage(response.data.profilePic); // Set the profile picture from the response
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Set the uploaded image as the new image
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='LeftProfileUpdate-container'>
      <div className='profile-header'>
        <p>Change Profile</p>
      </div>
      <div className="LeftProfileUpdate-image">
        {/* Show the current profile picture or uploaded image */}
        <img src={image || ''} alt="Profile" />
        <input
          type="file"
          id="file-input"
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleImageChange}
        />
        <button onClick={() => document.getElementById('file-input').click()}>
          Change Photo
        </button>
      </div>
    </div>
  );
};

export default LeftProfileUpdate;
