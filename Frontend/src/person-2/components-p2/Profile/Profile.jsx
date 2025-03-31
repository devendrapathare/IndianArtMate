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
      <div className="profile-main-column">
        <div className="profile-info-section">
          <ProfileInfo setshowUploadPost={setShowUploadPost} isOwnProfile={isOwnProfile} userId={userId} />
        </div>
        <div className="profile-feed-section">
          <h2 className="profile-section-title">Posts</h2>
          {!showUploadPost ? <UploadPost /> : <ProfilefeedDisplay isOwnProfile={isOwnProfile} current_id={userId} />}
        </div>
      </div>
      <div className="profile-sidebar">
        <TopArtistProfileDisplay userId={userId} /> 
      </div>
    </div>
  );
};

export default Profile;
