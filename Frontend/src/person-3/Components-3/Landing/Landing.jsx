import React from 'react'
import './Landing.css'

import { for_home } from '../../../assets/assets'
const Landing = () => {
  return (
    <div className='landing'>
      <div className="left">
        <img  src={for_home.port_on_Landing} alt="" />
      </div>
      <div className="right">
        <center>
        <h2><u>Here's Indian_ArtMate</u></h2>
        <p>Our platform celebrates the fusion of heritage and creativity, where each handmade masterpiece tells the story of culture and tradition. We honor the timeless skills of artisans, preserving craftsmanship while embracing modern art, keeping the spirit of India's cultural legacy alive</p>
        </center>
      </div>

    </div>
  )
}

export default Landing
