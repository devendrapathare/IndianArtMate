import React from 'react';
import './ProfileFeed.css';

const ProfileFeed = ({ image }) => {
    
  return (
    <div className='ProfileFeed-container'>
        <div className="profileFeed-feed">
            <img src={image} alt='Profile' />
            
        </div>
    </div>
  );
}

export default ProfileFeed;
