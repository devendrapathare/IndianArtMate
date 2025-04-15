import React, { useEffect, useState } from 'react'
import './Landing.css'

import { CrouselData } from '../../../assets/assets'

// Add arrow icon import
const arrowIcon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE1LjQxIDcuNDFMMTQgNkw4IDEyTDE0IDE4TDE1LjQxIDE2LjU5TDEwLjgzIDEyTDE1LjQxIDcuNDFaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4="

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
const [isTransitioning, setIsTransitioning] = useState(false);
const [loadingProgress, setLoadingProgress] = useState(73); // Start at 73% like in reference

const nextImage = () => {
  if (isTransitioning) return;
  
  setIsTransitioning(true);
  setTimeout(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % CrouselData.length);
    setLoadingProgress(Math.floor(Math.random() * 20) + 70); // Random progress between 70-90%
    setTimeout(() => {
      setIsTransitioning(false);
    }, 100);
  }, 300);
};

const prevImage = () => {
  if (isTransitioning) return;
  
  setIsTransitioning(true);
  setTimeout(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + CrouselData.length) % CrouselData.length);
    setLoadingProgress(Math.floor(Math.random() * 20) + 70); // Random progress between 70-90%
    setTimeout(() => {
      setIsTransitioning(false);
    }, 100);
  }, 300);
};

useEffect(() => {
  const interval = setInterval(nextImage, 4000); // Increased from 5000 to 8000ms for better viewing experience
  return () => clearInterval(interval);
}, []);

return (
  <div className='landing'>
    <div className="carousel-container">
      {/* <button className="nav-button prev" onClick={prevImage}>
        <img src={arrowIcon} alt="Previous" />
      </button> */}
      <div className={`carousel-content ${isTransitioning ? 'transitioning' : ''}`}>
        <div className="carousel-text">
          <h2 dangerouslySetInnerHTML={{ __html: CrouselData[currentIndex].title }}></h2>
          <p>{CrouselData[currentIndex].description1}</p>
          <p>{CrouselData[currentIndex].description2}</p>
        </div>
        <img src={CrouselData[currentIndex].src} alt={CrouselData[currentIndex].title} />
        <div className="loading-indicator">loading... {loadingProgress}%</div>
      </div>
      {/* <button className="nav-button next" onClick={nextImage}>
        <img src={arrowIcon} alt="Next" style={{ transform: 'rotate(180deg)' }} />
      </button> */}
      <div className="indicators">
        {CrouselData.map((_, index) => (
          <span
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setLoadingProgress(Math.floor(Math.random() * 20) + 70);
                  setTimeout(() => {
                    setIsTransitioning(false);
                  }, 100);
                }, 300);
              }
            }}
          ></span>
        ))}
      </div>
    </div>
  </div>
);

}

export default Landing
