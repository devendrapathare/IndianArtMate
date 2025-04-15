import React from 'react'
import './Footer.css'
import { assets } from '../../../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className='footer-content-left'>
            <h2 className='footer-logo'>IndianArtMate</h2>
            <p className='footer-tagline'>Connecting Indian artists with art lovers worldwide.</p>
            
        </div>
        <div className='footer-content-center'>
            <h2>Quick Links</h2>
            <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/artists">Artists</Link></li>
                <li><Link to="/auctions">Auctions</Link></li>
                <li><Link to="/blog">Blog</Link></li>
            </ul>
        </div>
        <div className='footer-content-right'>
            <h2>Support</h2>
            <ul>
                <li><Link to="/help">Help Center</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
            </ul>
        </div>
        <div className='footer-social'>
            <h2>Connect With Us</h2>
            <div className="social-icons">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <img src={assets.instagram_icon || assets.facebook_icon} alt="Instagram" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <img src={assets.twitter_icon} alt="Twitter" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <img src={assets.facebook_icon} alt="Facebook" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <img src={assets.linkedin_icon} alt="LinkedIn" />
                </a>
            </div>
            <div className="contact-info">
                <p>Mobile: +91-1234567890 (India)</p>
                <p>Email: indianartmate@ac.co.in</p>
            </div>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        2025 IndianArtMate. All rights reserved.
      </p>
    </div>
  )
}

export default Footer
