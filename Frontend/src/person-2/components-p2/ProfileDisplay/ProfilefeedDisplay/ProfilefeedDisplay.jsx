import React from 'react';
import './ProfilefeedDisplay.css';
import ProfileFeed from '../../Profile/ProfileFeed/ProfileFeed';
import { allImagesAvailable } from '../../../../assets/assets';

const ProfilefeedDisplay = () => {
    
  return (
    <div className='ProfilefeedDisplay-container'>
        {allImagesAvailable.map((item) => (
            <ProfileFeed key={item.id} image={item.image} />
        ))}
    </div>
  );
}

export default ProfilefeedDisplay;
