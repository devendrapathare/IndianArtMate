import React, { useState, useEffect } from 'react';
import './ProfileInfo.css';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../../person-2/context/AuthContext/AuthContext';
import axios from 'axios';

const ProfileInfo = ({ setshowUploadPost }) => {
    const [userData, setUserData] = useState(null); // State to store user data
    const [image, setImage] = useState(null); // State to store profile picture
    const { authUser } = useAuthContext();
    const userId = authUser?._id; // Get the logged-in user's ID

    const navigate = useNavigate();

    // Navigate to the profile update page
    const handleUpdateProfileClick = () => {
        navigate('/UpdateProfilePage');
    };

    // Fetch user data including profile picture from API
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/users/${userId}`);
                setUserData(response.data);
                setImage(response.data.profilePic); // Set profile picture
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    // Handle image change (file input)
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result); // Set new image in state
            };
            reader.readAsDataURL(file);
        }
    };

    // Render loading state if userData is not yet available
    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profileInfo-container">
            <div className="profileInfo-profile-icon">
                {/* Display profile picture or fallback to default */}
                <img src={image || assets.defaultProfilePic} alt="Profile" />
                <input
                    type="file"
                    id="file-input"
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleImageChange}
                />
            </div>

            <div className="above">
                {/* Display user's username and occupation */}
                <h2>{userData.userName || 'Krish Mishra'}</h2>
                <p>{userData.profile_type || 'Painter'}</p>
            </div>

            <div className="profileInfo-buttons">
                <button className="profileIcon-respect-button">Respect</button>
                <button onClick={handleUpdateProfileClick} className="profileIcon-update-profile-button profileIcon-respect-button">
                    Update Profile
                </button>
            </div>

            <div className="middle">
                {/* Display user's post count, respecters, and respecting */}
                <p>Posts: <span>200</span></p>
                <p>Respecters: <span>{userData.respectors?.length || 0}</span></p>
                <p>Respecting: <span>{userData.respecting?.length || 0}</span></p>
            </div>

            <div className="lower">
                {/* Display user's bio */}
                <p className="bio">{userData.bio || 'Hey, I am Krish Mishra from DMCE and currently in the third year of college.'}</p>
            </div>

            <div className="profileInfo-buttons">
                <button onClick={() => setshowUploadPost(false)} className="profileIcon-respect-button">Upload</button>
                <button className="profileIcon-update-profile-button profileIcon-respect-button">Story</button>
            </div>
        </div>
    );
};

export default ProfileInfo;
