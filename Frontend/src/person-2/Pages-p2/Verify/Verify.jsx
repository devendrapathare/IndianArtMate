import React, { useEffect } from 'react';
import './Verify.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { usePostContext } from '../../context/PostContext/PostContext';

const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');
    const txnId = searchParams.get('txnId');
    const { url } = usePostContext();
    const navigate = useNavigate();

    const verifyPayment = async () => {
        
        try {
            if (orderId) {
                // 🛍️ Order verification
                const response = await axios.post(`${url}/api/order/verify`, { success, orderId });
                if (response.data.success) {
                    navigate('/myOrders');
                } else {
                    navigate('/');
                }
            } else if (txnId) {
                // 💸 Wallet recharge verification
                console.log("txnId", txnId);
                const response = await axios.post(`${url}/api/wallet/verify-recharge`, { success, txnId });
                if (response.data.success) {
                    navigate('/walletPage'); // ya koi wallet summary page
                } else {
                    navigate('/');
                }
            } else {
                console.warn("No valid ID in URL");
                navigate('/');
            }
        } catch (error) {
            console.error("Verification failed:", error);
            navigate('/');
        }
    };

    useEffect(() => {
        verifyPayment();
    }, []);

    return (
        <div className='verify'>
            <div className="spinner"></div>
        </div>
    );
};

export default Verify;
