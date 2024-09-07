import React from 'react'
import './ProfileInfo.css'
import { assets } from '../../../../assets/assets'

const ProfileInfo = () => {
    return (
        <div className="profileInfo-container">
            <div className="profileInfo-profile-icon">
                <img src={assets.profileTest}></img>
            </div>
            <div className="profileIcon-profile-user-detail">
                <div className="above">
                    <h2 className="profileInfo-profile-user-name">Krish Mishra</h2>
                    <button className="profileIcon-respect-button">Respect</button>
                    <button className="profileIcon-update-profile-button profileIcon-respect-button">Update Profile</button>
                </div>

                <div className="middle">
                    <p><span>200</span> posts</p>
                    <p><span>200</span> Respecters</p>
                    <p><span>200</span> Respecting</p>
                </div>
                
                <div className="lower">
                    <p className="bio">Hey I am Krish Mishra From DMCE And I am now in third year of my college</p>
                </div>

            </div>
        </div>
    )
}

export default ProfileInfo
