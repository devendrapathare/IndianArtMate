import React, { useEffect, useState } from 'react';
import './PassbookComp.css';
import axios from 'axios';
import { useAuthContext } from '../../../../person-2/context/AuthContext/AuthContext';
import { usePostContext } from '../../../../person-2/context/PostContext/PostContext';

const PassbookComp = () => {
  const { authUser, fetchUserData } = useAuthContext();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { url } = usePostContext();

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/other-transactions/${authUser._id}`);
        const transactionsWithUsers = await Promise.all(
          res.data.transactions.map(async (txn, index) => {
            const buyer = await fetchUserData(txn.buyerId._id || txn.buyerId);
            const seller = await fetchUserData(txn.sellerId._id || txn.sellerId);

            let role = '';
            let balanceAfterTransaction = null;

            if (txn.buyerId?._id?.toString() === authUser._id.toString()) {
              role = 'buyer';
              balanceAfterTransaction = txn.buyerBalanceAfterTransaction;
            } else if (txn.sellerId?._id?.toString() === authUser._id.toString()) {
              role = 'seller';
              balanceAfterTransaction = txn.sellerBalanceAfterTransaction;
            }

            return {
              srNo: index + 1,
              transactionId: txn.transactionId, // Add transaction ID
              date: txn.createdAt, // Add date
              from: {
                username: buyer?._id === authUser._id ? 'You' : buyer?.userName || buyer?.email,
                profilePic: getProfileImageUrl(buyer?.profilePic)
              },
              to: {
                username: seller?._id === authUser._id ? 'You' : seller?.userName || seller?.email,
                profilePic: getProfileImageUrl(seller?.profilePic)
              },
              amount: txn.amount,
              purpose: txn.purpose,
              transactionType: txn.transactionType,
              status: txn.status,
              balanceAfterTransaction,
              role
            };
          })
        );

        setTransactions(transactionsWithUsers);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    if (authUser && authUser._id) {
      loadTransactions();
    }
  }, [authUser]);

  const getProfileImageUrl = (profilePic) => {
    const desiredPath = 'https://avatar.iran.liara.run/public/';
    if (!profilePic) return '';

    if (profilePic.startsWith(desiredPath)) {
      return profilePic;
    } else {
      const fullPath = profilePic;
      const wantedPath = fullPath.replace('/uploads/profilePic', '');
      return `${url}/profilePics${wantedPath}`;
    }
  };

  return (
    <div className="passbook-container">
      <h2>Transaction History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="passbook-table">
          <thead>
            <tr>
              <th>Sr. No</th>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>From</th>
              <th>To</th>
              <th>Amount</th>
              <th>Purpose</th>
              <th>Transaction Type</th>
              <th>Status</th>
              <th>Balance After Transaction</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, index) => (
              <tr key={index}>
                <td>{txn.srNo}</td>
                <td>{txn.transactionId}</td>
                <td>{new Date(txn.date).toLocaleString()}</td>
                <td>
                  <img src={txn.from.profilePic} alt="from" className="profile-pic" />
                  {txn.from.username}
                </td>
                <td>
                  <img src={txn.to.profilePic} alt="to" className="profile-pic" />
                  {txn.to.username}
                </td>
                <td>{txn.role === 'buyer' ? '-' : '+'}₹{txn.amount?.toFixed(2)}</td>
                <td>{txn.purpose}</td>
                <td>{txn.transactionType}</td>
                <td>{txn.status}</td>
                <td>
                  {txn.balanceAfterTransaction !== null
                    ? `₹${txn.balanceAfterTransaction?.toFixed(2)}`
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PassbookComp;
