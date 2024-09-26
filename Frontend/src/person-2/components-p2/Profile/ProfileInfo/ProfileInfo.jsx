import React, { useState, useEffect } from 'react';
import './ProfileInfo.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usePostContext } from '../../../context/PostContext/PostContext';

const ProfileInfo = ({ setshowUploadPost, isOwnProfile, userId }) => {
    const [userData, setUserData] = useState(null); 
    const [image, setImage] = useState(null); 
    const {posts,loggedInUserPosts} = usePostContext()
    const numOfPosts = posts.filter(post => post.userId === userId).length
    // console.log("done11",loggedInUserPosts);
    
    
    
    
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
<<<<<<< HEAD
                <p>Posts: <span>200</span></p>
=======
                {/* Display user's post count, respecters, and respecting */}
                <p>Posts: <span>{numOfPosts}</span></p>
>>>>>>> 38a3753250e608921a441f6155e69ae2749c1803
                <p>Respecters: <span>{userData.respectors?.length || 0}</span></p>
                <p>Respecting: <span>{userData.respecting?.length || 0}</span></p>
            </div>

            <div className="lower">
                {/* Display user's bio */}
                <p className="bio">{userData.bio || 'Write About You Here'}</p>
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
