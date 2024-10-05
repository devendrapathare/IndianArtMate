import React from 'react'
import './UpdateProfile.css'
import LeftProfileUpdate from './LeftProfileUpdate/LeftProfileUpdate'
import MainProfileUpdate from './MainProfileUpdate/MainProfileUpdate'
import RightProfileUpdate from './RightProfileUpdate/RightProfileUpdate'
import TopArtistProfileDisplay from '../ProfileDisplay/TopArtistProfileDisplay/TopArtistProfileDisplay'
import { useParams } from 'react-router-dom';

const UpdateProfile = () => {
  return (
    <div className='UpdateProfile-container'>
      <LeftProfileUpdate />
      <MainProfileUpdate />
      {/* <RightProfileUpdate /> */}
      <TopArtistProfileDisplay />
    </div>
  )
}

export default UpdateProfile
