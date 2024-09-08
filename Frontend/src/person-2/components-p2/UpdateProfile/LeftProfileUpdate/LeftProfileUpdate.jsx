import React, { useState } from 'react';
import './LeftProfileUpdate.css';

const LeftProfileUpdate = () => {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  // console.log(image);
  
  return (
    <div className='LeftProfileUpdate-container'>
      <div className='profile-header'>
        <p>Change Profile</p>
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
      </div>
    </div>
  );
};

export default LeftProfileUpdate;
