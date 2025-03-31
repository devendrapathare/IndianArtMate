import React, { useState, useEffect } from 'react';
import './ProfileInfo.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usePostContext } from '../../../context/PostContext/PostContext';
import { useAuthContext } from '../../../context/AuthContext/AuthContext';
import { useChatContext } from '../../../context/chatContext/chatContext';
import { useConversation } from '../../../Zustand/UseConversation';


const ProfileInfo = ({ setshowUploadPost, isOwnProfile, userId }) => {
    const [userData, setUserData] = useState(null);
    const [image, setImage] = useState(null);
    const { posts, loggedInUserPosts, url } = usePostContext()
    const numOfPosts = posts.filter(post => post.userId === userId).length
    const { setMyId, setReceiverId, getMessageReceiverDetails } = useChatContext()
    const { setSelectedConversation } = useConversation()


    // console.log("done11",loggedInUserPosts);

    const { authUser } = useAuthContext();

    const LogggedInUserId = authUser?._id;


    const navigate = useNavigate();

    const handleChat = async () => {
        setMyId(authUser._id)
        await getMessageReceiverDetails(userId)
        setSelectedConversation(userId)
        navigate('/myChats')
    }

    const handleUpdateProfileClick = () => {
        navigate(`/UpdateProfilePage`);
    };

    const handleShowRespec = (whatTodo) => {
        navigate(`/myProfileDetails/${whatTodo}/${userId}`)
    }

    const [hasRespected, setHasRespected] = useState(false);

    // useEffect(()=>{
    //     console.log("in useEffect")
    //     handleRespectToggle(userId)
    // },[])
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
                <p>{userData.email || 'Painter'}</p>
                {/* {
                    userData._id === LogggedInUserId ?<p>{userData.wallet || '0'}</p>:null
                }
                 */}

            </div>


            <div className="profileInfo-buttons">
                {!isOwnProfile && (
                    <button
                        onClick={() => handleRespectToggle(userId)}
                        className="profileIcon-respect-button"
                    >
                        {hasRespected ? 'Remove Respect' : 'Respect'}
                    </button>
                )}
                {isOwnProfile && (
                    <button onClick={() => { handleUpdateProfileClick() }} className="profileIcon-update-profile-button profileIcon-respect-button">
                        Update Profile
                    </button>
                )}
                {
                    !isOwnProfile && (
                        <button onClick={handleChat}>Chat</button>
                    )
                }


            </div>

            <div className="middle">
                <p>Posts: <span>{numOfPosts}</span></p>
                <div onClick={() => { handleShowRespec('Respectors') }}>

                    <p><u>Respectors</u>: <span>{userData.respectors?.length || 0}</span></p>
                </div>
                <div onClick={() => { handleShowRespec('Respecting') }}>

                    <p><u>Respecting</u>: <span>{userData.respecting?.length || 0}</span></p>
                </div>
            </div>

            <div className="lower">
                <p className="bio">{userData.bio || 'Write About You Here'}</p>
            </div>

            <div className="profileInfo-buttons">
                {isOwnProfile && (
                    <>
                        <button onClick={() => setshowUploadPost(false)} className="profileIcon-respect-button">Upload</button>
                        <button onClick={() => navigate('/receivedOrders')} className="profileIcon-respect-button">Received Orders</button>
                    </>
                )}
                {/* <button className="profileIcon-update-profile-button profileIcon-respect-button">Story</button> */}
            </div>
        </div>
    );
};

export default ProfileInfo;
