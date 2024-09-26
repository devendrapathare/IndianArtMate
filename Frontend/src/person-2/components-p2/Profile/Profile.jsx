// Profile.js
import React, { useState, useEffect } from 'react';
import './Profile.css';
import ProfileInfo from './ProfileInfo/ProfileInfo';
import ProfileFeed from './ProfileFeed/ProfileFeed';
import ProfilefeedDisplay from '../ProfileDisplay/ProfilefeedDisplay/ProfilefeedDisplay';
import TopArtistProfileDisplay from '../ProfileDisplay/TopArtistProfileDisplay/TopArtistProfileDisplay';
import UploadPost from '../UploadPost/UploadPost';

const Profile = ({ isOwnProfile, userId }) => {
  const [showUploadPost, setShowUploadPost] = useState(true); 


<<<<<<< HEAD
  useEffect(() => {
    if (!isOwnProfile) {
      setShowUploadPost(false); 
      console.log("yes owner",showUploadPost)
    }
  }, [isOwnProfile]);




=======
>>>>>>> 38a3753250e608921a441f6155e69ae2749c1803
  return (
    <div className='profile-container'>
     <ProfileInfo setshowUploadPost={setShowUploadPost} isOwnProfile={isOwnProfile} userId={userId} />

      {/* {showUploadPost ?<ProfilefeedDisplay />:<UploadPost/>} */}
<<<<<<< HEAD
      {
  isOwnProfile ? (
    showUploadPost ? (
      <ProfilefeedDisplay isOwnProfile={isOwnProfile} current_id={userId} />
    ) : (
      <UploadPost />
    )
  ) : (
    showUploadPost ? (
      <UploadPost />
    ) : (
      <ProfilefeedDisplay isOwnProfile={isOwnProfile} current_id={userId} />
    )
  )
}

=======
      {!showUploadPost ?<UploadPost/>:<ProfilefeedDisplay isOwnProfile={isOwnProfile} current_id = {userId} />}
>>>>>>> 38a3753250e608921a441f6155e69ae2749c1803
      <TopArtistProfileDisplay userId={userId} /> 
    </div>
  );
};

export default Profile;
