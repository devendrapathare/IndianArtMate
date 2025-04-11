import React, { useState } from 'react';
import axios from 'axios';

const Wallet = () => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
            console.log("Recharge Response:", res.data.success);

            if (res.data.success && res.data.txnId) {
                await axios.post(
                    'http://localhost:5000/api/wallet/verify-recharge',
                    {
                        txnId: res.data.txnId,
                        success: res.data.success
                    },
                );

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
        <div style={styles.container}>
            <h2>Recharge Wallet</h2>
            <input
                type="number"
                placeholder="Enter amount (USD)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={styles.input}
            />
            <button onClick={handleRecharge} disabled={loading} style={styles.button}>
                {loading ? 'Processing...' : 'Recharge'}
            </button>
            {error && <p style={styles.error}>{error}</p>}
        </div>
    );
};

const styles = {
    container: {
        width: '300px',
        margin: '0 auto',
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
        textAlign: 'center'
    },
    input: {
        width: '100%',
        padding: '0.5rem',
        marginBottom: '1rem'
    },
    button: {
        padding: '0.6rem 1rem',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    error: {
        color: 'red',
        marginTop: '1rem'
    }
};

export default Wallet;
