import React from 'react'
import './UpdateProfile.css'
import LeftProfileUpdate from './LeftProfileUpdate/LeftProfileUpdate'
import MainProfileUpdate from './MainProfileUpdate/MainProfileUpdate'
import RightProfileUpdate from './RightProfileUpdate/RightProfileUpdate'

const UpdateProfile = () => {
  return (
    <div className='UpdateProfile-container'>
      <LeftProfileUpdate />
      <MainProfileUpdate />
      <RightProfileUpdate />
    </div>
  )
}

export default UpdateProfile
