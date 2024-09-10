import React, { useContext } from 'react'
import './Cart.css'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../../assets/assets'

const Cart = () => {

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
        <div>
          <div className="cart-items-title cart-items-item">
            <img src={assets.profileTest} alt="" />
            <p>Saree</p>
            <p>500rs</p>
            <p>25</p>
            <p>900</p>
            <p  className='cross'>X</p>
          </div>
          <hr />
        </div>
        <div>
          <div className="cart-items-title cart-items-item">
            <img src={assets.profileTest} alt="" />
            <p>Saree</p>
            <p>500rs</p>
            <p>25</p>
            <p>900</p>
            <p  className='cross'>X</p>
          </div>
          <hr />
        </div>
        <div>
          <div className="cart-items-title cart-items-item">
            <img src={assets.profileTest} alt="" />
            <p>Saree</p>
            <p>500rs</p>
            <p>25</p>
            <p>900</p>
            <p  className='cross'>X</p>
          </div>
          <hr />
        </div>
        <div>
          <div className="cart-items-title cart-items-item">
            <img src={assets.profileTest} alt="" />
            <p>Saree</p>
            <p>500rs</p>
            <p>25</p>
            <p>900</p>
            <p  className='cross'>X</p>
          </div>
          <hr />
        </div>
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>SubTotal</p>
              <p>Total</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>Total Amount</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>9004</b>
            </div>
          </div>
          <button >PROCEED TO CHECKOUT</button>
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
