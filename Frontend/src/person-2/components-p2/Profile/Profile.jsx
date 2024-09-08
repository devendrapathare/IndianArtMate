import React from 'react'
import './Profile.css'
import ProfileInfo from './ProfileInfo/ProfileInfo'
import ProfileFeed from './ProfileFeed/ProfileFeed'
import ProfilefeedDisplay from '../ProfileDisplay/ProfilefeedDisplay/ProfilefeedDisplay'
import TopArtistProfileDisplay from '../ProfileDisplay/TopArtistProfileDisplay/TopArtistProfileDisplay'


const Profile = () => {
  return (
    <div className='profile-container'>
      <ProfileInfo />
      <ProfilefeedDisplay />
      <TopArtistProfileDisplay />
    </div>
  )
}

export default Profile
