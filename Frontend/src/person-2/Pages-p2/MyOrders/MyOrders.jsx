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
    const [len, setlen] = useState([])

    const fetchOrders = async () => {
        const response = await axios.post(url + "/api/order/userOders", {});
        setData(response.data.data);
    };

    // console.log("data",data);
    
    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    // Filter orders based on buyerId
    const filteredOrders = data.filter(order => order.buyerId === authUser._id);

    

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            <div className="container">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order, index) => (
                        <div key={index} className="my-orders-order">
                            <img src={assets.delivery_box} alt="" />
                            <p>{order.items.map((item, idx) => 
                                `${item.title} X ${item.quantity || item.Quantity}${idx < order.items.length - 1 ? ', ' : ''}`
                            )}</p>
                            <p>₹{order.amount}.00</p>
                            <p>Delivery Charge ₹{order.deliveryCharge} .00</p>
                            <p>Items: {order.items.length}</p>
                            <p><span>&#x25cf;</span> <b>{order.status}</b></p>
                            <button onClick={fetchOrders}>Track order</button>
                        </div>
                    ))
                ) : (
                    <p>No orders found</p>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
