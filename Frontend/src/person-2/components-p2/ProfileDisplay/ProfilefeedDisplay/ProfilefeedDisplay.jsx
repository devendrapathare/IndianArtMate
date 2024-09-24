import React from 'react';
import './ProfilefeedDisplay.css';
import ProfileFeed from '../../Profile/ProfileFeed/ProfileFeed';
import { usePostContext } from '../../../context/PostContext/PostContext';
import { assets } from '../../../../assets/assets';

const ProfilefeedDisplay = () => {
  const { logedInUserPosts } = usePostContext();

  const containerClass =  logedInUserPosts.length > 0 ? 'ProfilefeedDisplay-container' :"EmptyProfilefeedDisplay-container"

  return (
    <>
    <div className={containerClass}>
      {logedInUserPosts.length > 0 ?
        (
          logedInUserPosts.map((item) => (
            <ProfileFeed key={item._id} image={item.image} category={item.category} description={item.description}  price={item.price} title={item.title} />
          ))
        ) : (
          <div className='ProfilefeedDisplay-empty'>
            <img src={assets.empty_box} alt="" />
            <h1>No posts available</h1>
          </div>
        )}
    </div>
    </>
  );
}

export default ProfilefeedDisplay;
