// ProfileDisplay.js
import React from 'react';
import './ProfileDisplay.css';
import Profile from '../Profile/Profile';

const ProfileDisplay = ({ isOwnProfile, userId }) => {
  return (
    <div>
      <Profile isOwnProfile={isOwnProfile} userId={userId} />
    </div>
  );
};

export default ProfileDisplay;
