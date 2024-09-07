import React from 'react'
import './ProfileInfo.css'
import { assets } from '../../../../assets/assets'

const ProfileInfo = () => {
    return (
        <div className="profileInfo-container">
            <div className="profileInfo-profile-icon">
                <img src={assets.profileTest}></img>
            </div>
            <div className="above">
                <h2>Krish Mishra</h2>
                <p>Painter</p>
            </div>

            <div className="profileInfo-buttons">
                <button className="profileIcon-respect-button">Respect</button>
                <button className="profileIcon-update-profile-button profileIcon-respect-button">Update Profile</button>
            </div>

            <div className="middle">
                <p>posts:<span>200</span></p>
                <p>Respecters:<span>200</span></p>
                <p>Respecting:<span>200</span></p>
            </div>

            <div className="lower">
                <p className="bio">Hey I am Krish Mishra From DMCE And I am now in third year of my college</p>
            </div>

            <div className="profileInfo-buttons">
                <button className="profileIcon-respect-button">Upload</button>
                <button className="profileIcon-update-profile-button profileIcon-respect-button">Story</button>
            </div>

        </div>
    )
}

export default ProfileInfo
