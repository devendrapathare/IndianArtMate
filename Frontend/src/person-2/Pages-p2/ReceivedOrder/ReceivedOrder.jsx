import React, { useContext, useEffect, useState } from 'react';
import './ReceivedOrder.css';
import { usePostContext } from '../../context/PostContext/PostContext';
import { CartContext } from '../../context/CartContext/CartContext';
import axios from 'axios';
import { assets } from '../../../assets/assets';
import { useAuthContext } from '../../context/AuthContext/AuthContext';
import { add } from 'lodash';
import toast from 'react-hot-toast';

const ReceivedOrder = () => {
    const { url } = usePostContext();
    const { token } = useContext(CartContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setuserData] = useState('')
    const { authUser } = useAuthContext();


    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.post(url + "/api/order/userOders", {});
            setData(response.data.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch orders. Please try again.');
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };
    // console.log("data:",data);


    useEffect(() => {
        if (token) {
            fetchOrders();
            const interval = setInterval(fetchOrders, 10000);
            return () => clearInterval(interval);
        }
    }, [token]);

    const getUserData = async (userId) => {
        try {
            const userResponse = await axios.get(`${url}/users/${userId}`);
            setuserData(userResponse.data.user)
            return
        } catch (e) {

        }
    }

    const orderStatusHandler = async (event, orderId) => {
        const newStatus = event.target.value;

        try {
            if (newStatus === "Delivered" || newStatus === "Cancelled") {
                if (window.confirm("You cannot change the status again after this. Do you want to proceed?")) {
                    await updateOrderStatus(orderId, newStatus);
                }
            } else {
                await updateOrderStatus(orderId, newStatus);
            }
        } catch (err) {
            console.error('Error updating order status:', err);
            toast.error('Failed to update order status. Please try again.');
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        const response = await axios.post(url + '/api/order/status', {
            orderId,
            status
        });
        if (response.data.success) {
            await fetchOrders();
        }
    };

    const filteredOrders = data.filter(order =>
        order.items.some(item => item.userId === authUser._id)
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return '#4CAF50';
            case 'Out For Delivery': return '#2196F3';
            case 'Shipped': return '#FF9800';
            case 'Cancelled': return '#FF0000';
            default: return '#9E9E9E';
        }
    };

    if (error) {
        return (
            <div className="order">
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={fetchOrders}>Try Again</button>
                </div>
            </div>
        );
    }
    console.log("filteredOrders:", filteredOrders);




    return (
        <div className='order'>
            <h2>
                Order Page
                <span>Total Orders: {filteredOrders.length}</span>
            </h2>
            <div className="order-list">
                {loading && data.length === 0 ? (
                    <div className="loading-message">
                        <p>Loading your orders...</p>
                    </div>
                ) : filteredOrders.length > 0 ? (
                    filteredOrders.map((order, index) => {
                        const orderItems = order.items.filter(item => item.userId === authUser._id);
                        const totalAmount = orderItems.reduce((total, item) =>
                            (total + (item.price * (item.quantity))) || order.amount, 0
                        );

                        // Safely accessing nested properties
                        const address = order.address || {};
                        const user = address.user || {};

                        // console.log("address:", address.user)
                        console.log(filteredOrders.date, "filteredOrders.date");



                        // getUserData(address.user._id)


                        const fullName = `${address.firstName || user.userName || 'Unknown'} ${address.lastName || ''}`.trim();
                        const phone = address.phone || user.phoneNumber || 'N/A';
                        const street = address.street || user.addressLine1 || '';
                        const city = address.city || user.addressLine2 || '';
                        const state = address.state || '';
                        const country = address.country || '';
                        const zipcode = address.zipcode || '';

                        return (
                            <div key={order._id || index} className="order-item">
                                <img src={assets.delivery_box} alt="Delivery Box" />
                                <div className="order-image">
                                    {orderItems.map((item, idx) => (
                                        <img src={url + "/images/" + item.image} alt="" />
                                    ))}
                                </div>
                                <p>Date: {new Date(order.date).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                })}</p>

                                <p>Time: {new Date(order.date).toLocaleTimeString('en-IN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: true
                                })}</p>

                                <div>
                                    <p className='order-item-food'>
                                        {orderItems.map((item, idx) => (
                                            <span key={idx}>
                                                {item.title} × {item.quantity || item.Quantity || 1}
                                                {idx < orderItems.length - 1 ? ', ' : ''}
                                            </span>
                                        ))}
                                    </p>
                                    <p className="order-item-name">{fullName}</p>
                                    <div className="order-item-address">
                                        <p>{street},</p>
                                        <p>{city} {state} {country} {zipcode}</p>
                                    </div>
                                </div>

                                <p className="order-item-phone">{phone}</p>
                                <p className='items'>Items: {orderItems.length}</p>
                                <p className='items'>Amount: ₹{order.amount}</p>
                                <p className='items'>Delivery Charge: ₹{order.deliveryCharge}</p>
                                <select
                                    className='items'
                                    onChange={(event) => orderStatusHandler(event, order._id)}
                                    value={order.status}
                                    disabled={order.status === "Delivered" || order.status === "Cancelled"}
                                    style={{
                                        borderColor: getStatusColor(order.status),
                                        color: getStatusColor(order.status)
                                    }}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Out For Delivery">Out For Delivery</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancel</option>
                                </select>
                            </div>
                        );
                    })
                ) : (
                    <p>You have no orders yet.</p>
                )}
            </div>
        </div>
    );
};

export default ReceivedOrder;
