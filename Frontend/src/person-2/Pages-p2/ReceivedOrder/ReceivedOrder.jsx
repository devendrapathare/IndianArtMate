import React, { useContext, useEffect, useState } from 'react';
import './ReceivedOrder.css';
import { usePostContext } from '../../context/PostContext/PostContext';
import { CartContext } from '../../context/CartContext/CartContext';
import axios from 'axios';
import { assets } from '../../../assets/assets';
import { useAuthContext } from '../../context/AuthContext/AuthContext';

const ReceivedOrder = () => {
    const { url } = usePostContext();
    const { token } = useContext(CartContext);
    const [data, setData] = useState([]);
    const { authUser } = useAuthContext();

    const fetchOrders = async () => {
        const response = await axios.post(url + "/api/order/userOders", {});
        setData(response.data.data);
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
            const interval = setInterval(fetchOrders, 100);
            return () => clearInterval(interval);
        }
    }, [token]);

    const orderStatusHandler = async (event, orderId) => {
        const newStatus = event.target.value;

        if (newStatus === "Delivered") {
            if (window.confirm("You cannot change the status again after this. Do you want to proceed?")) {
                const response = await axios.post(url + '/api/order/status', {
                    orderId,
                    status: newStatus
                });
                if (response.data.success) {
                    await fetchOrders();
                }
            } else {
                // Prevent changing the status if the user cancels
                return;
            }
        } else {
            const response = await axios.post(url + '/api/order/status', {
                orderId,
                status: newStatus
            });
            if (response.data.success) {
                await fetchOrders();
            }
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Filter orders that contain items with authUser._id
    const filteredOrders = data.filter(order =>
        order.items.some(item => item.userId === authUser._id)
    );
    // console.log("filte",filteredOrders.length);
    

    return (
        <div className='order add'>
            <h2>Order Page <span>Total Orders:({filteredOrders.length})</span> </h2>
            <div className="order-list">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order, index) => (
                        <div key={index} className="order-item">
                            <img src={assets.delivery_box} alt="Delivery Image" />
                            <div>
                                <p className='order-item-food'>
                                    {order.items.filter(item => item.userId === authUser._id).map((item, idx) => (
                                        `${item.title} X ${item.quantity}${idx < order.items.length - 1 ? ', ' : ''}`
                                    ))}
                                </p>
                                <p className="order-item-name">{`${order.address.firstName} ${order.address.lastName}`}</p>
                                <div className="order-item-address">
                                    <p>{`${order.address.street},`}</p>
                                    <p>{`${order.address.city}, ${order.address.state}, ${order.address.country}, ${order.address.zipcode}`}</p>
                                </div>
                                <p className="order-item-phone">{order.address.phone}</p>
                            </div>
                            <p className='items'>Items: {order.items.filter(item => item.userId === authUser._id).length}</p>
                            <p className='items'>₹{order.items.filter(item => item.userId === authUser._id).reduce((total, item) => total + item.price * item.quantity, 0)}</p>
                            <select 
                                className='items' 
                                onChange={(event) => orderStatusHandler(event, order._id)} 
                                value={order.status}
                                disabled={order.status === "Delivered"}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Out For Delivery">Out For Delivery</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                    ))
                ) : (
                    <p>You have no orders.</p> // Message for no orders
                )}
            </div>
        </div>
    );
};

export default ReceivedOrder;
