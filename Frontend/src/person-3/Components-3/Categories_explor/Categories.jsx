import React from 'react';
import './Categories.css';
import images from '../../../assets/assets'; 

const Categories = () => {
  return (
    <div className='cat'>
      <center>
        <div className="top">
          <h2>Authentic and Modern Indian</h2>
          <h2>Painting Handloom and Handcraft</h2>
        </div>
        <div className="mid">
          <img src={images.img1} alt="Category 1" />
          <img src={images.img2} alt="Category 2" />
          <img src={images.img3} alt="Category 3" />
          <img src={images.img4} alt="Category 4" />
          <img src={images.img5} alt="Category 5" />
          <img src={images.img6} alt="Category 6" />
          <img src={images.img7} alt="Category 7" />
          <img src={images.img8} alt="Category 8" />
          <img src={images.img9} alt="Category 9" />
        </div>
        <div className="bottom"></div>
      </center>
    </div>
  );
};

export default Categories;
