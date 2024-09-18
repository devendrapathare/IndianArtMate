import React from 'react';
import './ProfileFeed.css';
import { usePostContext } from '../../../context/PostContext/PostContext';

const ProfileFeed = ({ image }) => {

  const{ url } = usePostContext()
    
  return (
    <div className='ProfileFeed-container'>
        <div className="profileFeed-feed">
            <img src={url+"/images/"+image} alt='Profile' />
            
        </div>
    </div>
  );
}

export default ProfileFeed;
