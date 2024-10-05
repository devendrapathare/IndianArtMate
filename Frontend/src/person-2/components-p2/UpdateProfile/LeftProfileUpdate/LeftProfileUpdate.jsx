import React, { useEffect, useState } from 'react';
import './LeftProfileUpdate.css';
import { useAuthContext } from '../../../../person-2/context/AuthContext/AuthContext';

const LeftProfileUpdate = () => {
  const { authUser } = useAuthContext();
  const userId = authUser?._id;
  console.log("leftid",userId)

  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null); 

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/users/${userId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
  
        const user = data.user; // Access the 'user' object
  
        let fullImageUrl;
        
        if (user.profilePic.startsWith('http')) {
          fullImageUrl = user.profilePic;
        } else {
          // Updated to use the 'uploads' folder
          fullImageUrl = `http://localhost:5000/uploads${user.profilePic.split('/uploads')[1]}`;
        }
  
        setImage(fullImageUrl);
        console.log("Profile Pic URL image:", fullImageUrl); // Updated to log 'fullImageUrl' directly
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserProfile();
  }, [userId]);
  
  

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);  
      };
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile); 
    }
  };

  const handleImageUpload = async () => {
    if (!file) return;
  
    const formData = new FormData();
    formData.append('profilePic', file);
  
    try {
      const response = await fetch(`http://localhost:5000/users/${userId}/profile-pic`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) throw new Error('Failed to upload image');
      const data = await response.json();
  
      const newImageUrl = `http://localhost:5000/profilePics${data.profilePic.split('/profilePic')[1]}`;
      setImage(newImageUrl);
      const userData = JSON.parse(localStorage.getItem('user-info'));
            userData.profilePic = data.profilePic; 

            localStorage.setItem('user-info', JSON.stringify(userData));

  
      alert('Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };
  

  return (
    <div className='LeftProfileUpdate-container'>
      <div className='profile-header'>
        <p>Profile Pic</p>
      </div>
      <div className="LeftProfileUpdate-image">
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
        <button onClick={handleImageUpload}>Save Photo</button>
      </div>
    </div>
  );
};

export default LeftProfileUpdate;
