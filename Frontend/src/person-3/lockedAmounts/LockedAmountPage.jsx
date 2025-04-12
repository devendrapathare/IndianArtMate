import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../person-2/context/AuthContext/AuthContext';
import axios from 'axios';

const LockedAmountPage = () => {
    const { authUser } = useAuthContext();
    const [lockedData, setLockedData] = useState([]);
    const [totalLocked, setTotalLocked] = useState(0);

    useEffect(() => {
        const fetchLocked = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/auth/lockedAmount/${authUser._id}`);
                setLockedData(res.data.lockedData);
                setTotalLocked(res.data.totalLocked);
            } catch (error) {
                console.error('Error fetching locked amount', error);
            }
        };

        fetchLocked();
    }, [authUser]);

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Your Locked Bidding Amount</h2>
            <p className="text-md font-medium mb-4">Total Locked: ₹{totalLocked.toFixed(2)}</p>

            <div className="space-y-4">
                {lockedData.map((item, index) => (
                    <div key={index} className="p-4 border rounded shadow flex justify-between items-center">
                        <div>
                            <p><strong>Bid Amount:</strong> ₹{item.lock}</p>
                            <p><strong>Bidding ID:</strong> {item.biddingId}</p>
                        </div>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            onClick={() => handleBackout(item.biddingId)}
                        >
                            Backout
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    async function handleBackout(biddingId) {
        try {
            const res = await axios.post('http://localhost:5000/api/bidding/backout', {
                userId: authUser._id,
                biddingId
            });
            console.log('Backout response:', res.data);
            if (res.data.success) {

                // Refresh locked data
                const refreshed = await axios.get(`http://localhost:5000/api/auth/lockedAmount/${authUser._id}`);
                setLockedData(refreshed.data.lockedData);
                setTotalLocked(refreshed.data.totalLocked);
                alert('Backed out successfully!');
            }
            else {
                alert(res.data.message)
            }

        } catch (err) {
            console.error('Backout failed', err);
            alert('Error while backing out');
        }
    }
};

export default LockedAmountPage;
