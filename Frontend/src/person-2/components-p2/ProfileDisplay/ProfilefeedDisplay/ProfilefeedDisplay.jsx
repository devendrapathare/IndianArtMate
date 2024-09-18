import React from 'react';
import './ProfilefeedDisplay.css';
import ProfileFeed from '../../Profile/ProfileFeed/ProfileFeed';
import { allImagesAvailable } from '../../../../assets/assets';
import { usePostContext } from '../../../context/PostContext/PostContext'

const ProfilefeedDisplay = () => {

  const { fetchPostList,posts } = usePostContext(); 
  
  return (
    <div className='ProfilefeedDisplay-container'>
        {posts.map((item) => (
            <ProfileFeed key={item._id} image={item.image} />
        ))}
    </div>
  );
}

export default ProfilefeedDisplay;
