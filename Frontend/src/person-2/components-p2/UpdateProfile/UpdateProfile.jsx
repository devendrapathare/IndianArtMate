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

        <div className="profile-section artists-section">
          <div className="section-header">
            <h3>More Artists Profile</h3>
          </div>
          <div className="section-content artists-content">
            {authUser && authUser._id ? (
              <div className="artists-list">
                <div className="artist-card">
                  <div className="artist-image">
                    <img src="https://avatar.iran.liara.run/public/boy" alt="Artist" />
                  </div>
                  <div className="artist-info">
                    <h4>Rahul Mehra</h4>
                    <p>Handloom Artist</p>
                  </div>
                </div>
                
                <div className="artist-card">
                  <div className="artist-image">
                    <img src="https://avatar.iran.liara.run/public/girl" alt="Artist" />
                  </div>
                  <div className="artist-info">
                    <h4>Priya Sharma</h4>
                    <p>Traditional Painter</p>
                  </div>
                </div>
                
                <div className="artist-card">
                  <div className="artist-image">
                    <img src="https://avatar.iran.liara.run/public/boy?d=2" alt="Artist" />
                  </div>
                  <div className="artist-info">
                    <h4>Ankit Patel</h4>
                    <p>Handcraft Artist</p>
                  </div>
                </div>

                <div className="artist-card">
                  <div className="artist-image">
                    <img src="https://avatar.iran.liara.run/public/girl?d=3" alt="Artist" />
                  </div>
                  <div className="artist-info">
                    <h4>Meera Desai</h4>
                    <p>Textile Weaver</p>
                  </div>
                </div>

                <div className="artist-card">
                  <div className="artist-image">
                    <img src="https://avatar.iran.liara.run/public/boy?d=4" alt="Artist" />
                  </div>
                  <div className="artist-info">
                    <h4>Vikram Singh</h4>
                    <p>Pottery Master</p>
                  </div>
                </div>

                <button className="more-artists-btn">
                  <span>+</span> View More Artists
                </button>
              </div>
            ) : (
              <div className="error-message">Error fetching data</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateProfile
