import React from 'react'
import './FirstProductDes.css'
import images_for_categories, { assets } from '../../../../assets/assets'

const FirstProductDes = ({ image,category,description,price,title }) => {

  const maxDescriptionLength = 150;

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
              <img src={assets.profileTest} alt="owner Profile" />
            </div>
            <div className="owner-detail">
              <div className="owner-name">
                <p>Krish Mishra</p>
              </div>
              <div className="owner-respecters">
                <p>100 Respecters</p>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="buttons">
          <button className="hire-me">Hire Me</button>
          <button className="buy-btn">Buy Now</button>
          <button className="add-to-cart-btn">Add to Cart</button>
        </div>
      </div>
    </div>
  )
}

export default FirstProductDes
