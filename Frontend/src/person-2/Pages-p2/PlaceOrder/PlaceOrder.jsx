import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import { CartContext } from '../../context/CartContext/CartContext'
import { usePostContext } from '../../context/PostContext/PostContext'
import { useAuthContext } from '../../context/AuthContext/AuthContext'

const PlaceOrder = () => {

  const { cartItems, getTotalCartAmount, token } = useContext(CartContext)
  const {posts,url } = usePostContext()
  const { authUser } = useAuthContext()
  console.log('PlaceOrder',authUser._id);
  

  const [data, setdata] = useState({
    firstName: '',
    lastName: '',
    email:'',
    street:'',
    city: '',
    state:'',
    zipcode:'',
    country:'',
    phone:'',
  })

  const onchangeHandler = (event) =>{
    const name = event.target.name
    const value = event.target.value
    setdata(data=>({...data,[name]:value}))
  }

  const placeOrder = async (event) => {
    event.preventDefault()
    let orderItems = []
    posts.map((item)=>{
      if(cartItems[item._id]>0){
        let itemInfo = item
        itemInfo["quantity"] = cartItems[item._id]
        orderItems.push(itemInfo)
      }
    })
    let orderData = {
      buyerId:authUser._id,
      address:data,
      items:orderItems,
      amount:getTotalCartAmount() > 499 ? getTotalCartAmount() : getTotalCartAmount() + 40 
    }
    console.log('orderData',orderData);
    
    let response = await axios.post(url+"/api/order/placeOrder",orderData)   
    if (response.data.success) {
      const {session_url} = response.data
      window.location.replace(session_url) 
    }
    else{
      alert("Error Here")
    }
  }

  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate('/cart')
    }
    else if(getTotalCartAmount === 0){
      navigate('/cart')
    }
  }, [token])
  
  

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
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
          <div>
          <div className="cart-total-details">
              <p>SubTotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() >499 ?0:40}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() > 499 ? getTotalCartAmount() : getTotalCartAmount() + 40}</b>
            </div>
          </div>
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>      
      </div>
    </form>
  )
}

export default PlaceOrder
