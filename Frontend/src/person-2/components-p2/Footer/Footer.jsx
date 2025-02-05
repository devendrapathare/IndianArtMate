import React from 'react'
import './Footer.css'
import { assets } from '../../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className='footer-content-left'>
            <img  src={assets.logo} alt="" />
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sed accusantium repudiandae a totam cum ratione similique inventore, molestiae expedita vel esse quia consequuntur, quisquam ipsum?</p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className='footer-content-center'>
            <h2>COMPANY</h2>
            <ul>
                <li>Home</li>
                <li>About Us</li>
                <li>Delivery</li>
                <li>privacy Policy</li>
            </ul>
        </div>
        <div className='footer-content-right'>
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>+91-993-562-6600</li>
                <li>dummyemail@dummy.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2024 © IndianArtMate -  All Right Reserved.
      </p>
    </div>
  )
}

export default Footer
