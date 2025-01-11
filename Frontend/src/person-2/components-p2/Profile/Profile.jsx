// Profile.js
import React, { useState, useEffect } from 'react';
import './Profile.css';
import ProfileInfo from './ProfileInfo/ProfileInfo';
import ProfilefeedDisplay from '../ProfileDisplay/ProfilefeedDisplay/ProfilefeedDisplay';
import TopArtistProfileDisplay from '../ProfileDisplay/TopArtistProfileDisplay/TopArtistProfileDisplay';
import UploadPost from '../UploadPost/UploadPost';

const Profile = ({ isOwnProfile, userId }) => {
  const [showUploadPost, setShowUploadPost] = useState(true); 


  return (
    <div className='profile-container'>
     <ProfileInfo setshowUploadPost={setShowUploadPost} isOwnProfile={isOwnProfile} userId={userId} />
      {/* {showUploadPost ?<ProfilefeedDisplay />:<UploadPost/>} */}
      {!showUploadPost ?<UploadPost/>:<ProfilefeedDisplay isOwnProfile={isOwnProfile} current_id = {userId} />}
      <TopArtistProfileDisplay userId={userId} /> 
    </div>
  );
};

export default Profile;
