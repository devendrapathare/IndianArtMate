import React, { useEffect, useState } from 'react'
import './Landing.css'

import { CrouselData } from '../../../assets/assets'
const Landing = () => {
//   return (
//     <div className='landing'>
//       <div className="left">
//         <img  src={for_home.port_on_Landing} alt="" />
//       </div>
//       <div className="right">
//         <center>
//         <h2><u>Here's Indian_ArtMate</u></h2>
//         <p>Our platform celebrates the fusion of heritage and creativity, where each handmade masterpiece tells the story of culture and tradition. We honor the timeless skills of artisans, preserving craftsmanship while embracing modern art, keeping the spirit of India's cultural legacy alive</p>
//         </center>
//       </div>

//     </div>
//   )

const [currentIndex, setCurrentIndex] = useState(0);

const nextImage = () => {
  setCurrentIndex((prevIndex) => (prevIndex + 1) % CrouselData.length);
};

const prevImage = () => {
  setCurrentIndex((prevIndex) => (prevIndex - 1 + CrouselData.length) % CrouselData.length);
};

useEffect(() => {
  const interval = setInterval(nextImage, 5000); // Auto-slide every 3 seconds
  return () => clearInterval(interval);
}, []);

return (
  <div className="carousel-container">
    <button className="nav-button" onClick={prevImage}>&#8249;</button>
    <div className="carousel-content">
      <div className="carousel-text">
        <h2>{CrouselData[currentIndex].title}</h2>
        <p>{CrouselData[currentIndex].description1}</p>
        <p>{CrouselData[currentIndex].description2}</p>
      </div>
      <img src={CrouselData[currentIndex].src} alt={CrouselData[currentIndex].title} />
    </div>
    <button className="nav-button" onClick={nextImage}>&#8250;</button>
    <div className="indicators">
      {CrouselData.map((_, index) => (
        <span
          key={index}
          className={`indicator ${index === currentIndex ? 'active' : ''}`}
          onClick={() => setCurrentIndex(index)}
        ></span>
      ))}
    </div>
  </div>
);

}

export default Landing
