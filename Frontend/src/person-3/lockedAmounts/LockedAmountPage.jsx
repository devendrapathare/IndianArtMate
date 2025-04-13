import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../person-2/context/AuthContext/AuthContext';
import axios from 'axios';
import { usePostContext } from '../../person-2/context/PostContext/PostContext';

const LockedAmountPage = () => {
    const { authUser, fetchUserData } = useAuthContext();
    const [lockedData, setLockedData] = useState([]);
    const [ownerMap, setOwnerMap] = useState({});
    const [totalLocked, setTotalLocked] = useState(0);
    const { url } = usePostContext();

    useEffect(() => {
        const fetchLocked = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/auth/lockedAmount/${authUser._id}`);
                const data = res.data.lockedData;
                setLockedData(data);
                setTotalLocked(res.data.totalLocked);

                // Fetch owner data only once per unique ownerId
                const uniqueOwnerIds = [...new Set(data.map(item => item.biddingOwnerId))];

                const ownerDataMap = {};
                for (const id of uniqueOwnerIds) {
                    const data = await fetchUserData(id);
                    if (data) {
                        let currentImageUrl = data.profilePic;
                        const desiredPath = 'https://avatar.iran.liara.run/public/';
                        if (!currentImageUrl.startsWith(desiredPath)) {
                            const wantedpath = currentImageUrl.replace('/uploads/profilePic', '');
                            currentImageUrl = `${url}/profilePics${wantedpath}`;
                        }
                        ownerDataMap[id] = {
                            userName: data.userName,
                            profilePic: currentImageUrl
                        };
                    }
                }

                setOwnerMap(ownerDataMap);

            } catch (error) {
                console.error('Error fetching locked amount', error);
            }
        };

        fetchLocked();
    }, [authUser]);

    const handleBackout = async (biddingId) => {
        try {
            const res = await axios.post('http://localhost:5000/api/bidding/backout', {
                userId: authUser._id,
                biddingId
            });

            if (res.data.success) {
                const refreshed = await axios.get(`http://localhost:5000/api/auth/lockedAmount/${authUser._id}`);
                setLockedData(refreshed.data.lockedData);
                setTotalLocked(refreshed.data.totalLocked);
                alert('Backed out successfully!');
            } else {
                alert(res.data.message);
            }
        } catch (err) {
            console.error('Backout failed', err);
            alert('Error while backing out');
        }
    };

    return (
        <div>
            <h2>Your Locked Bidding Amount</h2>
            <p>Total Locked: ₹{totalLocked.toFixed(2)}</p>

            <div>
                {lockedData.map((item, index) => {
                    const ownerInfo = ownerMap[item.biddingOwnerId];
                    return (
                        <div key={index}>
                            <p><strong>Bid Amount:</strong> ₹{item.lock}</p>
                            <p><strong>Bidding ID:</strong> {item.biddingId}</p>
                            {ownerInfo ? (
                                <div>
                                    <img src={ownerInfo.profilePic} alt="Owner" width="50" height="50" />
                                    <p><strong></strong> {ownerInfo.userName}</p>
                                </div>
                            ) : (
                                <p>Owner not found</p>
                            )}
                            <button onClick={() => handleBackout(item.biddingId)}>Backout</button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LockedAmountPage;
