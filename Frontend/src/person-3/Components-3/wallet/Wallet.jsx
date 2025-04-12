import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../../person-2/context/AuthContext/AuthContext';
import './Wallet.css';

const Wallet = () => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [walletBalance, setWalletBalance] = useState({ wallet: 0 });

    const { authUser, fetchUserData } = useAuthContext();

    const loadWalletBalance = async () => {
        if (authUser && authUser._id) {
            try {
                const userData = await fetchUserData(authUser._id);
                setWalletBalance(userData);
            } catch (err) {
                console.error("Failed to fetch wallet:", err);
                setError("Failed to load wallet balance.");
            }
        }
    };

    useEffect(() => {
        loadWalletBalance();
    }, [authUser]);

    const handleRecharge = async () => {
        if (!amount || isNaN(amount) || amount <= 0) {
            setError("Please enter a valid amount");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await axios.post(
                'http://localhost:5000/api/wallet/recharge',
                { amount },
                { withCredentials: true }
            );

            if (res.data.success && res.data.session_url) {
                window.location.replace(res.data.session_url);
            } else {
                setError("Failed to initiate recharge.");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="wallet-wrapper">
            <h2 className="wallet-title">My Wallet</h2>

            <div className="wallet-balance-card">
                <span>Current Balance</span>
                <h1>${(walletBalance?.wallet ?? 0).toFixed(2)}</h1>
            </div>

            <div className="wallet-form">
                <h3>Recharge Wallet</h3>
                <input
                    type="number"
                    placeholder="Enter amount (USD)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <button onClick={handleRecharge} disabled={loading}>
                    {loading ? 'Processing...' : 'Recharge'}
                </button>
                {error && <p className="wallet-error">{error}</p>}
            </div>
        </div>
    );
};

export default Wallet;
