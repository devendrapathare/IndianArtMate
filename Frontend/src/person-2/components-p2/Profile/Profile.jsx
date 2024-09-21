import React, { useState } from 'react'
import './Profile.css'
import ProfileInfo from './ProfileInfo/ProfileInfo'
import ProfileFeed from './ProfileFeed/ProfileFeed'
import ProfilefeedDisplay from '../ProfileDisplay/ProfilefeedDisplay/ProfilefeedDisplay'
import TopArtistProfileDisplay from '../ProfileDisplay/TopArtistProfileDisplay/TopArtistProfileDisplay'
import UploadPost from '../UploadPost/UploadPost'


const Profile = () => {

  const [showUploadPost, setshowUploadPost] = useState(true)

  return (
    <div className='profile-container'>
      <ProfileInfo setshowUploadPost = {setshowUploadPost} />
      {showUploadPost ? <ProfilefeedDisplay /> :<UploadPost />}
      <TopArtistProfileDisplay />
    </div>
  )
}

export default Profile
