import React, { useState, useEffect } from 'react';
import './ProfileInfo.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usePostContext } from '../../../context/PostContext/PostContext';
import { useAuthContext } from '../../../context/AuthContext/AuthContext';
import Wallet from '../../../../person-3/Components-3/wallet/Wallet';


const ProfileInfo = ({ setshowUploadPost, isOwnProfile, userId }) => {
    const [userData, setUserData] = useState(null);
    const [image, setImage] = useState(null);
    const { posts, loggedInUserPosts, url } = usePostContext()
    const numOfPosts = posts.filter(post => post.userId === userId).length

    const { authUser } = useAuthContext();
    const LogggedInUserId = authUser?._id;
    // const createdAt = new Date(authUser.createdAt);
    // const updatedAt = new Date(authUser.updatedAt);

    console.log("authUser:", userData);
    // console.log("createdAt:", createdAt.getTime());
    // console.log("updatedAt:", updatedAt.getTime());



    const navigate = useNavigate();
    const handleUpdateProfileClick = () => {
        navigate(`/UpdateProfilePage`);
    };

    const handleShowRespec = (whatTodo) => {
        navigate(`/myProfileDetails/${whatTodo}/${userId}`)
    }

    const [hasRespected, setHasRespected] = useState(false);

    useEffect(() => {
        const fetchRespectStatus = async () => {
            try {
                const response = await axios.get(`${url}/checkRespect/${LogggedInUserId}/${userId}`);
                setHasRespected(response.data.hasRespected);
            } catch (e) {
                console.error(e);
            }
        };

        fetchRespectStatus();
    }, [userId]);

    const handleRespectToggle = async (userId) => {
        try {
            const response = await axios.post(`${url}/setRespect/${LogggedInUserId}`, {
                userId
            });

            console.log("LoggedInUserId:", LogggedInUserId);
            console.log("userId:", userId);
            console.log(response);

            setHasRespected(!hasRespected);

            const updatedUserData = !hasRespected ? {
                ...userData,
                respectors: [...userData.respectors, LogggedInUserId],
                respecting: userData.respecting.includes(userId)
                    ? userData.respecting
                    : [...userData.respecting, userId],
            } : {
                ...userData,
                respectors: userData.respectors.filter(id => id !== LogggedInUserId),
                respecting: userData.respecting.filter(id => id !== userId),
            };

            setUserData(updatedUserData);


        } catch (e) {
            console.error(e);
        }
    };


    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`${url}/users/${userId}`);
                if (!response.ok) throw new Error('Network response was not ok');

                const data = await response.json();

                const user = data.user;
                setUserData(user);

                let fullImageUrl;
                if (user.profilePic.startsWith('http')) {
                    fullImageUrl = user.profilePic;
                } else {
                    fullImageUrl = `${url}/profilePics${user.profilePic.split('/profilePic')[1]}`;
                }
                setImage(fullImageUrl);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserProfile();
    }, [userId, hasRespected]);


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

    const [showPopup, setShowPopup] = useState(false);

    const togglePopup = () => {
        setShowPopup((prev) => !prev);
    };

    if (!userData) {
        return <div>Loading...</div>;
    }



    const styles = {
        walletButton: {
            padding: '0.6rem 1.2rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            position: 'relative',
            zIndex: 1,
        },
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 999, // High z-index to show above everything
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        popup: {
            width: '300px',
            height: '300px',
            backgroundColor: '#fff',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            position: 'relative',
            padding: '1rem',
            zIndex: 1000,
        },
        closeBtn: {
            position: 'absolute',
            top: '5px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
        }
    };

    return (
        <div className="profileInfo-container">
            <div className="profile-horizontal-layout">
                <div className="profile-left-section">
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

                    <div className="profile-user-details">
                        <h2>{userData.userName || 'Krish Mishra'}</h2>
                        <p className="profile-type">{userData.profile_type || 'Painter'}</p>
                        <p className="profile-email">{userData.email || 'artist@example.com'}</p>

                        <div className="profile-primary-actions">
                            {!isOwnProfile && (
                                <button
                                    onClick={() => handleRespectToggle(userId)}
                                    className="profileIcon-respect-button"
                                >
                                    {hasRespected ? 'Remove Respect' : 'Respect'}
                                </button>
                            )}
                            {isOwnProfile && (
                                <button onClick={() => { handleUpdateProfileClick() }} className="profileIcon-update-profile-button">
                                    {
                                        userData.isUpdated ?  'Update the profile':'Complete the profile'
                                    }
                                    {/* Update Profile */}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="profile-right-section">
                    <div className="profile-stats">
                        <div className="stat-item">
                            <p className="stat-label">Posts</p>
                            <p className="stat-value">{numOfPosts}</p>
                        </div>
                        <div className="stat-item clickable" onClick={() => { handleShowRespec('Respectors') }}>
                            <p className="stat-label">Respectors</p>
                            <p className="stat-value">{userData.respectors?.length || 0}</p>
                        </div>
                        <div className="stat-item clickable" onClick={() => { handleShowRespec('Respecting') }}>
                            <p className="stat-label">Respecting</p>
                            <p className="stat-value">{userData.respecting?.length || 0}</p>
                        </div>
                    </div>

                    <div className="profile-bio">
                        <h3>About</h3>
                        <p className="bio">{userData.bio || 'Write About You Here'}</p>
                    </div>
                </div>
            </div>

            <div className="profile-secondary-actions">
                {isOwnProfile && (
                    <>
                        <button onClick={() => {
                            setshowUploadPost(false);

                            // Immediate UI feedback - scroll to where posts section should be
                            window.scrollTo({
                                top: document.querySelector('.profile-feed-section')?.offsetTop - 100 || window.scrollY + 300,
                                behavior: 'smooth'
                            });

                            setTimeout(() => {
                                const postsElement = document.getElementById('posts');
                                if (postsElement) {
                                    postsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

                                    postsElement.style.backgroundColor = 'rgba(123, 157, 224, 0.2)';
                                    setTimeout(() => {
                                        postsElement.style.backgroundColor = '';
                                        postsElement.style.transition = 'background-color 0.5s ease';
                                    }, 800);
                                }
                            }, 300);
                        }} className="profileIcon-respect-button">Upload</button>

                        <button onClick={() => navigate('/receivedOrders')} className="profileIcon-respect-button">Received Orders</button>

                        <button onClick={togglePopup} style={styles.walletButton} >
                            Wallet
                        </button>
                        {showPopup && (
                            <div style={styles.overlay}>
                                <div style={styles.popup}>
                                    <button onClick={togglePopup} style={styles.closeBtn}>✖</button>
                                    <Wallet />
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => { navigate('/walletPage') }}
                            className="profileIcon-respect-button">
                            WalletPage
                        </button>
                    </>
                )}
            </div>
        </div>
    );

};

export default ProfileInfo;
