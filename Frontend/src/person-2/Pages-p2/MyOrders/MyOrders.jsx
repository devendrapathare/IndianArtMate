import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import axios from 'axios';
import { CartContext } from '../../context/CartContext/CartContext';
import { usePostContext } from '../../context/PostContext/PostContext';
import { assets } from '../../../assets/assets.js';
import { useAuthContext } from '../../context/AuthContext/AuthContext.jsx';

const MyOrders = () => {
    const { token } = useContext(CartContext);
    const { url } = usePostContext();
    const [data, setData] = useState([]);
    const { authUser } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.post(url + "/api/order/userOders", {});
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (token) {
            fetchOrders();
        }
        
        // Auto-expand after a short delay
        const timer = setTimeout(() => {
            setIsExpanded(true);
        }, 300);
        
        return () => clearTimeout(timer);
    }, [token]);

    // Toggle expanded state
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    // Filter orders based on buyerId
    const filteredOrders = data.filter(order => order.buyerId === authUser._id);

    return (
        <div className={`my-orders ${isExpanded ? 'expanded' : 'collapsed'}`} onClick={toggleExpand}>
            <h2>My Orders</h2>
            <div className={`order-message ${isExpanded ? 'content-visible' : 'content-hidden'}`}>
                {loading ? (
                    <div className="loading-spinner"></div>
                ) : (
                    <>
                        <img src={assets.delivery_box} alt="Package" className="order-icon" />
                        <p>No orders found</p>
                    </>
                )}
            </div>
            {!isExpanded && (
                <div className="indicator-container">
                    <div className="expand-indicator">Click to expand</div>
                </div>
            )}
        </div>
    );
};

export default MyOrders;
