import React, { useEffect, useState } from 'react';
import './PassbookComp.css';
import axios from 'axios';
import { useAuthContext } from '../../../../person-2/context/AuthContext/AuthContext';
import { usePostContext } from '../../../../person-2/context/PostContext/PostContext';

const PassbookComp = () => {
  const { authUser, fetchUserData } = useAuthContext();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { url } = usePostContext()

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        console.log('Fetching transactions for user:', authUser._id);
        const res = await axios.get(`http://localhost:5000/api/other-transactions/${authUser._id}`);
        const transactionsWithUsers = await Promise.all(res.data.transactions.map(async (txn, index) => {
          const buyer = await fetchUserData(txn.buyerId);
          const seller = await fetchUserData(txn.sellerId);
          console.log('Buyer:', buyer);
          console.log('Seller:', seller);

          return {
            srNo: index + 1,
            from: {
              username: buyer?._id === authUser._id ? 'You' : buyer?.userName,
              profilePic: getProfileImageUrl(buyer?.profilePic)
            },
            to: {
              username: seller?._id === authUser._id ? 'You' : seller?.userName,
              profilePic: getProfileImageUrl(seller?.profilePic)
            },
            amount: txn.amount,
            purpose: txn.purpose,
            status: buyer._id === authUser._id ? 'Debited':'Credited'
          };
        }));
        console.log('Transactions with users:', transactionsWithUsers);
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
              <th>From</th>
              <th>To</th>
              <th>Amount</th>
              <th>Purpose</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, index) => (
              <tr key={index}>
                <td>{txn.srNo}</td>
                <td>
                  <img src={txn.from.profilePic} alt="from" className="profile-pic" />
                  {txn.from.username}
                </td>
                <td>
                  <img src={txn.to.profilePic} alt="to" className="profile-pic" />
                  {txn.to.username}
                </td>
                <td>${txn.amount.toFixed(2)}</td>
                <td>{txn.purpose}</td>
                <td>{txn.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PassbookComp;
