import React from 'react'
import './UpdateProfile.css'
import LeftProfileUpdate from './LeftProfileUpdate/LeftProfileUpdate'
import MainProfileUpdate from './MainProfileUpdate/MainProfileUpdate'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../person-2/context/AuthContext/AuthContext'

const UpdateProfile = () => {
  const navigate = useNavigate()
  const { authUser } = useAuthContext()
  
  // Redirect if not logged in
  if (!authUser) {
    navigate('/login')
    return null
  }

  return (
    <div className="update-profile-page">
      <div className="update-profile-content">
        <div className="profile-section profile-pic-section">
          <div className="section-header">
            <h3>Profile Pic</h3>
          </div>
          <div className="section-content">
            <LeftProfileUpdate />
          </div>
        </div>

        <div className="profile-section profile-details-section">
          <div className="section-header">
            <h3>Update Details Here</h3>
          </div>
          <div className="section-content">
            <MainProfileUpdate />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateProfile
