import React, { useState, useEffect } from 'react';
import './ProfileInfo.css';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../../person-2/context/AuthContext/AuthContext';
import axios from 'axios';

const ProfileInfo = ({ setshowUploadPost, isOwnProfile, userId }) => {
    const [userData, setUserData] = useState(null); 
    const [image, setImage] = useState(null); 
    const { authUser } = useAuthContext();
    
    const navigate = useNavigate();

    const handleUpdateProfileClick = () => {
        navigate('/UpdateProfilePage');
    };

    useEffect(() => {

        const fetchUserProfile = async () => {
          try {
            const response = await fetch(`http://localhost:5000/users/${userId}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
      
            let fullImageUrl;
            setUserData(data);
          
          if (data.profilePic.startsWith('http')) {
            fullImageUrl = data.profilePic;
          } else {
            fullImageUrl = `http://localhost:5000/profilePics${data.profilePic.split('/profilePic')[1]}`;
          }
            setImage(fullImageUrl);
            console.log("Profile Pic URL image:", image);
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        };
      
        fetchUserProfile();
      }, [userId]);
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result); 
            };
            reader.readAsDataURL(file);
        }
    };

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profileInfo-container">
            <div className="profileInfo-profile-icon">
                <img src={image || 'defaultProfilePic.png'} alt="Profile" />
                {isOwnProfile && (
                    <input
                        type="file"
                        id="file-input"
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                )}
            </div>

            <div className="above">
                <h2>{userData.userName || 'Krish Mishra'}</h2>
                <p>{userData.profile_type || 'Painter'}</p>
            </div>

            <div className="profileInfo-buttons">
                <button className="profileIcon-respect-button">Respect</button>
                {isOwnProfile && (
                    <button onClick={handleUpdateProfileClick} className="profileIcon-update-profile-button profileIcon-respect-button">
                        Update Profile
                    </button>
                )}
            </div>

            <div className="middle">
                <p>Posts: <span>200</span></p>
                <p>Respecters: <span>{userData.respectors?.length || 0}</span></p>
                <p>Respecting: <span>{userData.respecting?.length || 0}</span></p>
            </div>

            <div className="lower">
                {/* Display user's bio */}
                <p className="bio">{userData.bio || 'Hey, I am Krish Mishra from DMCE and currently in the third year of college.'}</p>
            </div>

            <div className="profileInfo-buttons">
                {isOwnProfile && (
                    <button onClick={() => setshowUploadPost(false)} className="profileIcon-respect-button">Upload</button>
                )}
                <button className="profileIcon-update-profile-button profileIcon-respect-button">Story</button>
            </div>
        </div>
    );
};

export default ProfileInfo;
