import React, { useContext } from 'react'
import './Cart.css'
import { CartContext } from '../../context/CartContext/CartContext'
import { usePostContext } from '../../context/PostContext/PostContext'
import { useNavigate } from 'react-router-dom'

const Cart = () => {

  const { cartItems, removeItemFromCart, getTotalCartAmount } = useContext(CartContext)
  const { posts, url } = usePostContext()
  const navigate = useNavigate()

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {posts.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={url + "/images/" + item.image} alt="" />
                  <p>{item.title}</p>
                  <p>₹{item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>₹{item.price * cartItems[item._id]}</p>
                  <p onClick={() => removeItemFromCart(item._id)} className='cross'>X</p>
                </div>
                <hr />
              </div>
            )
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>SubTotal</p>
              <p>{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{getTotalCartAmount() === 0
                ? 0
                : getTotalCartAmount() > 499
                  ? 'Free'
                  : 40}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>{getTotalCartAmount() === 0
              ?0
              :getTotalCartAmount() >499
              ?getTotalCartAmount()
            : getTotalCartAmount() + 40 }</b>
            </div>
          </div>
          <button onClick={() => navigate('/order') } >PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If You Have a Promo code, Enter it Here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder='promo code' />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
