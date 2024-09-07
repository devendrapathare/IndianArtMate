import React from 'react'
import './Profile.css'
import ProfileInfo from './ProfileInfo/ProfileInfo'
import ProfileFeed from './ProfileFeed/ProfileFeed'
import ProfilefeedDisplay from '../ProfileDisplay/ProfilefeedDisplay/ProfilefeedDisplay'


const Profile = () => {
  return (
    <div className='profile-container'>
      <ProfileInfo />
      <ProfilefeedDisplay />
    </div>
  )
}

export default Profile
