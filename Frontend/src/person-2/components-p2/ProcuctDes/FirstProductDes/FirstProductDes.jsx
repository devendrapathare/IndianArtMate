import React, { useContext, useEffect } from 'react'
import './FirstProductDes.css'
import  { assets } from '../../../../assets/assets'
import { useAuthContext } from '../../../context/AuthContext/AuthContext'
import { usePostContext } from '../../../context/PostContext/PostContext'
import { CartContext } from '../../../context/CartContext/CartContext'
import { useNavigate } from "react-router-dom";

const FirstProductDes = ({ image,category,description,price,title,userId, id }) => {

  const { singleUserData } = usePostContext()
  const { authUser } = useAuthContext()
  const { cartItems,addItemToCart,removeItemFromCart } = useContext(CartContext)
  const respectorsCount = singleUserData.respectors?.length || authUser.respectors?.length || 0 ;
  const maxDescriptionLength = 150;
  console.log("ff",cartItems);
  // console.log("BuyerId",userId);
  
  
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate('/cart');
  }

  return (
    <div className='FirstProuctDes-container'>
      <div className="FirstProuctDes-img">
        <img src={image} alt="" />
      </div>
      <div className="FirstProuctDes-main-info">
        <div className="header-title">
        <h2>{title}</h2>
        <p>({category})</p>
        </div>
        <hr />
        <div className="price">
          <p>₹{price}</p>
          <div>
          <p>No hidden fees – all taxes are included!</p>
          </div>
        </div>
        <hr />
        <div className="summery">
          <p>
          {description && description.length > maxDescriptionLength
              ? `${description.substring(0, maxDescriptionLength)}...`
              : description}          </p>
        </div>
        <hr />
        <div className="item-owner">
          <p>Designed by</p>
          <div className="owner-profile">
            <div className="owner-img">
              <img src={singleUserData.profilePic || authUser.profilePic } alt="owner Profile" />
            </div>
            <div className="owner-detail">
              <div className="owner-name">
                <p>{singleUserData.userName || authUser.userName || 'Not Available'}</p>
              </div>
              <div className="owner-respecters">
                <p><span>{respectorsCount}</span> Respecters</p>
              </div>
            </div>
          </div>
        </div>
        <hr />
        {authUser._id === userId ? (
          <div className="impressions buttons">
            <p>Like</p>
            <p>Dislike</p>
          </div>
        ) : (
          <div className="buttons">
            <button className="hire-me">Hire Me</button>
            {!cartItems[id]
            ?
            <button onClick={() => addItemToCart(id)} className="buy-btn">Buy Now</button>
            :
            <div className='add-to-cart-edit'>
              <div className="minus-plus">
              <img onClick={()=>removeItemFromCart(id)} src={assets.minus_icon} alt="Add to Cart" />
              <p>Quantity: <span>{cartItems[id]}</span></p>
              <img onClick={() => addItemToCart(id)} src={assets.plus_icon} alt="Remove From Cart" />
              </div>
              <button onClick={()=>handleNavigate()} className="add-to-cart-btn">Go to Cart</button>
            </div>
          }
          </div>
        )}
      </div>
    </div>
  )
}

export default FirstProductDes
