// ProfilePage.js
import React from 'react';
import './ProfilePage.css';
import ProfileDisplay from '../../components-p2/ProfileDisplay/ProfileDisplay';
// import { useParams } from 'react-router-dom';
import { useAuthContext } from '../../../person-2/context/AuthContext/AuthContext'; 

const ProfilePage = ({current_id}) => {
  const { authUser } = useAuthContext();
  const userId = authUser?._id;  
  const isOwnProfile = current_id && userId === current_id; 
  // console.log("isOwnProfile:",isOwnProfile)
  // console.log("current_id:",current_id)

  return (
    <div>
      <ProfileDisplay isOwnProfile={isOwnProfile} userId={current_id} />
      {/* {console.log("current_id:",current_id)} */}
    </div>
  );
};

export default ProfilePage;
