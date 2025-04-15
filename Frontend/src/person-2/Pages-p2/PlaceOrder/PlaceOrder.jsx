import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext/CartContext';
import { usePostContext } from '../../context/PostContext/PostContext';
import { useAuthContext } from '../../context/AuthContext/AuthContext';
import toast from 'react-hot-toast';


const PlaceOrder = () => {
  const { cartItems, getTotalCartAmount, token } = useContext(CartContext);
  const { posts, url } = usePostContext();
  const { authUser } = useAuthContext();
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  });
  
  const [paymentMethod, setPaymentMethod] = useState('stripe');  // Added state for payment method

  const onchangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    posts.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo['quantity'] = cartItems[item._id];
        orderItems.push(itemInfo);
        console.log('orderItems', item);       
      }      
    });
    console.log('orderItems', orderItems);
    
    let orderData = {
      buyerId: authUser._id,
      senderId:orderItems.userId,
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() ,
      paymentMethod,  // Add the payment method to the order data
    };

    try {
      let response;
      if (paymentMethod === 'stripe') {
        response = await axios.post(url + '/api/order/placeOrder', orderData);
        if (response.data.success) {
          const { session_url } = response.data;
          window.location.replace(session_url);
        } else {
          toast.error('Error Here');
        }
      } else if (paymentMethod === 'wallet') {
        response = await axios.post(url + '/api/order/placeOrderWithWallet', orderData);  // New endpoint for wallet
        if (response.data.success) {
          toast.success('Order placed successfully using Wallet');
          navigate('/myOrders');
        } else {
          toast.error('Error with wallet payment');
        }
        // console.log(response.data);
        
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/cart');
    } else if (getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [token]);

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        {/* Delivery information fields */}
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input name='firstName' onChange={onchangeHandler} value={data.firstName} type="text" placeholder='First Name' required />
          <input name='lastName' onChange={onchangeHandler} value={data.lastName} type="text" placeholder='Last Name' required />
        </div>
        <input name='email' onChange={onchangeHandler} value={data.email} type="email" placeholder='Email Address' required />
        <input name='street' onChange={onchangeHandler} value={data.street} type="text" placeholder='Street' required />
        <div className="multi-fields">
          <input name='city' onChange={onchangeHandler} value={data.city} type="text" placeholder='City' required />
          <input name='state' onChange={onchangeHandler} value={data.state} type="text" placeholder='State' required />
        </div>
        <div className="multi-fields">
          <input name='zipcode' onChange={onchangeHandler} value={data.zipcode} type="text" placeholder='Zip Code' required />
          <input name='country' onChange={onchangeHandler} value={data.country} type="text" placeholder='Country' required />
        </div>
        <input name='phone' onChange={onchangeHandler} value={data.phone} type="text" placeholder='Phone' required />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div className="cart-total-details">
            <p>SubTotal</p>
            <p>${getTotalCartAmount()}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>${getTotalCartAmount() > 499 ? 0 : 40}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <b>Total</b>
            <b>${getTotalCartAmount() > 499 ? getTotalCartAmount() : getTotalCartAmount() + 40}</b>
          </div>

          {/* Payment method selection */}
          <div className="cart-total-payment-methods">
            <label>
              <input 
                type="radio" 
                name="paymentMethod" 
                value="stripe" 
                checked={paymentMethod === 'stripe'} 
                onChange={() => setPaymentMethod('stripe')} 
              />
              Stripe
            </label>
            <label>
              <input 
                type="radio" 
                name="paymentMethod" 
                value="wallet" 
                checked={paymentMethod === 'wallet'} 
                onChange={() => setPaymentMethod('wallet')} 
              />
              Wallet
            </label>
          </div>

          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
