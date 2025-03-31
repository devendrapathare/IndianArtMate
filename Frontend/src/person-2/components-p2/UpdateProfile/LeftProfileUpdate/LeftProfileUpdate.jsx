import React, { useEffect, useState } from 'react';
import './LeftProfileUpdate.css';
import { useAuthContext } from '../../../../person-2/context/AuthContext/AuthContext';
import { usePostContext } from '../../../../person-2/context/PostContext/PostContext';
// import { usePostContext } from '../../../person-2/context/PostContext/PostContext';


const LeftProfileUpdate = () => {
  const { authUser } = useAuthContext();
  const userId = authUser?._id;
  console.log("leftid",userId)
  const { url } = usePostContext()


  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ message: '', type: '' });
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${url}/users/${userId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
  
        const user = data.user; // Access the 'user' object
  
       
        let imageUrl = authUser.profilePic;
        const desiredPath = 'https://avatar.iran.liara.run/public/';
        console.log(imageUrl);

        if (imageUrl.startsWith(desiredPath)) {
          imageUrl = authUser.profilePic;
        } else {
          const fullPath = authUser.profilePic;
          const wantedpath = fullPath.replace('/uploads/profilePic', '');
          console.log("wantedpath:",wantedpath)
          imageUrl = `${url}/profilePics${wantedpath}`
          console.log("wantedpath_2:",imageUrl)

        }
  
        setImage(imageUrl);
        console.log("Profile Pic URL image:", imageUrl); // Updated to log 'fullImageUrl' directly
        setTimeout(() => setAnimation(true), 300);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUploadStatus({ 
          message: 'Failed to load profile image. Please try again later.', 
          type: 'error' 
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchUserProfile();
  }, [userId, url, authUser]);
  
  

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(selectedFile.type)) {
        setUploadStatus({ 
          message: 'Please select a valid image file (JPEG, PNG, GIF)', 
          type: 'error' 
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setUploadStatus({ 
          message: 'Image size should be less than 5MB', 
          type: 'error' 
        });
        return;
      }

      // Temporarily set animation false to retrigger it
      setAnimation(false);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setUploadStatus({ message: 'Image selected! Click Save to update your profile.', type: 'info' });
        setTimeout(() => setAnimation(true), 100);
      };
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile); 
    }
  };

  const handleImageUpload = async () => {
    if (!file) {
      setUploadStatus({ message: 'Please select an image first', type: 'error' });
      return;
    }
  
    setIsLoading(true);
    setUploadStatus({ message: 'Uploading your image...', type: 'info' });
    
    const formData = new FormData();
    formData.append('profilePic', file);
  
    try {
      const response = await fetch(`${url}/users/${userId}/profile-pic`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) throw new Error('Failed to upload image');
      const data = await response.json();
  
      // Temporarily set animation false to retrigger it
      setAnimation(false);
      
      const newImageUrl = `${url}/profilePics${data.profilePic.split('/profilePic')[1]}`;
      setImage(newImageUrl);
      const userData = JSON.parse(localStorage.getItem('user-info'));
            userData.profilePic = data.profilePic; 

            localStorage.setItem('user-info', JSON.stringify(userData));

  
      setUploadStatus({ message: '✓ Profile picture updated successfully!', type: 'success' });
      setFile(null); // Reset file after successful upload
      
      setTimeout(() => setAnimation(true), 100);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setUploadStatus({ message: 'Failed to upload image. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className='LeftProfileUpdate-container'>
      <div className='profile-header'>
        <p>Profile Pic</p>
      </div>
      <div className="LeftProfileUpdate-image">
        {isLoading && !image ? (
          <div className="profile-image-placeholder">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <img 
            src={image || 'https://avatar.iran.liara.run/public/boy'} 
            alt="Profile" 
            className={`${isLoading ? 'loading' : ''} ${animation ? 'animate' : ''}`}
          />
        )}
        
        {uploadStatus.message && (
          <div className={`upload-status ${uploadStatus.type}`}>
            {uploadStatus.message}
          </div>
        )}
        
        <input
          type="file"
          id="file-input"
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleImageChange}
          disabled={isLoading}
        />
        <button 
          onClick={() => document.getElementById('file-input').click()}
          disabled={isLoading}
          className="change-photo-btn"
        >
          {isLoading ? 'Please wait...' : 'Change Photo'}
        </button>
        
        <button 
          onClick={handleImageUpload}
          disabled={isLoading || !file}
          className="save-photo-btn"
        >
          {isLoading ? 'Saving...' : 'Save Photo'}
        </button>
      </div>
    </div>
  );
};

export default LeftProfileUpdate;
