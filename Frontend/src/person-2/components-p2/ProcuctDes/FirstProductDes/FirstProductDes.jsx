import React from 'react'
import './FirstProductDes.css'
import images_for_categories, { assets } from '../../../../assets/assets'

const FirstProductDes = () => {
  console.log(images_for_categories.img1);

  return (
    <div className='FirstProuctDes-container'>
      <div className="FirstProuctDes-img">
        <img src={images_for_categories.img1} alt="" />
      </div>
      <div className="FirstProuctDes-main-info">
        <h2>Product Name</h2>
        <hr />
        <div className="price">
          <p>₹100</p>
          <div>
          <p>No hidden fees – all taxes are included!</p>
          </div>
        </div>
        <hr />
        <div className="summery">
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto autem nulla magni rem quaerat, dolore officia libero doloribus deserunt ad id eveniet modi maxime perspiciatis?</p>
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
