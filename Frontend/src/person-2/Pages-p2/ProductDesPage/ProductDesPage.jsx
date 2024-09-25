import React from 'react';
import './ProductDesPage.css';
import ProcuctDes from '../../components-p2/ProcuctDes/ProcuctDes';
import { useLocation } from 'react-router-dom';

const ProductDesPage = () => {
  const location = useLocation();
  const { image, category, description, price, title, userId } = location.state || {}; 
  // console.log("ProductDesPage:",userId);
    

  return (
    <div className='ProductDesPage-container'>
      <ProcuctDes 
        image={image} 
        category={category} 
        description={description} 
        price={price} 
        title={title}
        userId={userId}
      />
    </div>
  );
}

export default ProductDesPage;
