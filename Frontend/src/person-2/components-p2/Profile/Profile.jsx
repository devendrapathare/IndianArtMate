import React, { useState, useEffect, useRef } from 'react';
import './Profile.css';
import ProfileInfo from './ProfileInfo/ProfileInfo';
import ProfilefeedDisplay from '../ProfileDisplay/ProfilefeedDisplay/ProfilefeedDisplay';
import TopArtistProfileDisplay from '../ProfileDisplay/TopArtistProfileDisplay/TopArtistProfileDisplay';
import UploadPost from '../UploadPost/UploadPost';
import { useLocation } from 'react-router-dom';

const Profile = ({ isOwnProfile, userId }) => {
  const [showUploadPost, setShowUploadPost] = useState(false);
  const postsRef = useRef(null);
  const location = useLocation();
  
  // Enhanced scrolling behavior for posts section
  useEffect(() => {
    // Handle both hash-based navigation and direct setshowUploadPost calls
    if (location.hash === '#posts' || showUploadPost) {
      // Add a slight delay to ensure the component is fully rendered
      setTimeout(() => {
        if (postsRef.current) {
          postsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Force scroll with a second method in case the first one doesn't work well
          window.scrollTo({
            top: postsRef.current.offsetTop - 100, // Offset for header
            behavior: 'smooth'
          });
        }
      }, 300);
    }
  }, [location, showUploadPost]);

  return (
    <div className='profile-container'>
      <div className="profile-main-column">
        <div className="profile-info-section">
          <ProfileInfo setshowUploadPost={setShowUploadPost} isOwnProfile={isOwnProfile} userId={userId} />
        </div>
        <div id="posts" ref={postsRef} className="profile-feed-section">
          <h2 className="profile-section-title">Posts</h2>
          {showUploadPost ? <UploadPost setShowUploadPost={setShowUploadPost} /> : <ProfilefeedDisplay isOwnProfile={isOwnProfile} current_id={userId} />}
        </div>
      </div>
      <div className="profile-sidebar">
        <TopArtistProfileDisplay userId={userId} /> 
      </div>
    </div>
  );
};

export default Profile;
