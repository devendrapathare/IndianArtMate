import React, { useEffect, useState } from 'react';
import './HistoryComp.css';
import axios from 'axios';

const HistoryComp = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/wallet/history', { withCredentials: true });
                if (res.data.success) {                    
                    setHistory(res.data.data); // recent first
                } else {
                    setError('Failed to fetch history');
                }
            } catch (err) {
                setError('Error fetching history');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const totalPages = Math.ceil(history.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = history.slice(startIndex, startIndex + itemsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="history-container">
            <h2>Wallet Recharge History</h2>
            {currentItems.length === 0 ? (
                <p>No transactions yet.</p>
            ) : (
                <>
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Amount (USD)</th>
                                <th>Status</th>
                                <th>Type</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((txn) => (
                                <tr key={txn._id}>
                                    <td>${txn.amount}</td>
                                    <td>{txn.paymentStatus}</td>
                                    <td>{txn.transactionType}</td>
                                    <td>
                                        {new Date(txn.createdAt).toLocaleDateString('en-GB')}{" "}
                                        {new Date(txn.createdAt).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true,
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="pagination-controls">
                        <button onClick={handlePrev} disabled={currentPage === 1}>Previous</button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default HistoryComp;
