import React, { useState } from 'react';
import './Categories.css';
import images from '../../../assets/assets'; 
import { like_dislike_images } from '../../../assets/assets';

const imageData = [
  { id: 1, src: images.img1, likes: 1000, dislikes: 100, name: 'Shaswat' },
  { id: 2, src: images.img2, likes: 1500, dislikes: 150, name: 'Krish' },
  { id: 3, src: images.img3, likes: 2000, dislikes: 50, name: 'Biswal' },
  { id: 4, src: images.img4, likes: 1100, dislikes: 60, name: 'Hari' },
  { id: 5, src: images.img5, likes: 900, dislikes: 70, name: 'Ram' },
  { id: 6, src: images.img6, likes: 1300, dislikes: 80, name: 'Krishna' },
  { id: 7, src: images.img7, likes: 1400, dislikes: 90, name: 'Goku' },
  { id: 8, src: images.img8, likes: 1700, dislikes: 40, name: 'Naruto' },
  { id: 9, src: images.img9, likes: 1200, dislikes: 100, name: 'Kakashi' },
];

const Categories = () => {
  const [showAll, setShowAll] = useState(false);

  const handleShowMore = () => {
    setShowAll(prev=>!prev); 
  };

  const visibleImages = showAll ? imageData : imageData.slice(0, 6);

  return (
    <div className='cat'>
      <center>
        <div className="top">
          <h2>Authentic and Modern Indian</h2>
          <h2>Painting Handloom and Handcraft</h2>
        </div>
        <div className="mid">
          {visibleImages.map((image) => (
            <div className="card" key={image.id}>
              <img id='main-card-img' src={image.src} alt={`Category ${image.id}`} />
              <div className="card-bottom">
                <div className="arties-name">
                  <p>Made by: <span><b><u>{image.name}</u></b></span></p>
                </div>
                <div className="card-bottom-right">
                  <div className="like imgs">
                    <img className='respons' src={like_dislike_images.like} alt="Like" />
                    <p>{image.likes}</p>
                  </div>
                  <div className="dislike imgs">
                    <img className='respons' src={like_dislike_images.dislike} alt="Dislike" />
                    <p>{image.dislikes}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bottom">
          {!showAll ? (
            <button className='explore-button' onClick={handleShowMore}>
              Show More
            </button>
          ):(
            <button className='explore-button' onClick={handleShowMore}>
              Show Less
            </button>
          )}
        </div>
      </center>
    </div>
  );
};

export default Categories;
