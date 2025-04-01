import React, { useEffect } from 'react';
import './ProfilePage.css';
import ProfileDisplay from '../../components-p2/ProfileDisplay/ProfileDisplay';
import { useAuthContext } from '../../../person-2/context/AuthContext/AuthContext'; 
import { useLocation } from 'react-router-dom';

const ProfilePage = ({current_id}) => {
  const { authUser } = useAuthContext();
  const userId = authUser?._id;  
  const isOwnProfile = current_id && userId === current_id;
  const location = useLocation();
  
  // Handle scrolling when page loads
  useEffect(() => {
    if (location.hash === '#posts') {
      // Give some time for the DOM to fully render before scrolling
      setTimeout(() => {
        const postsElement = document.getElementById('posts');
        if (postsElement) {
          postsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    }
  }, [location.hash]);
  
  return (
    <div>
      <ProfileDisplay isOwnProfile={isOwnProfile} userId={current_id} />
    </div>
  );
};

export default ProfilePage;
