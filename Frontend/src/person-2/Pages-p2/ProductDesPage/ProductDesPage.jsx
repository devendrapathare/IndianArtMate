import React from 'react';
import './ProductDesPage.css';
import ProcuctDes from '../../components-p2/ProcuctDes/ProcuctDes';
import { useLocation } from 'react-router-dom';

const ProductDesPage = () => {
  const location = useLocation();
  const { image, category, description, price, title } = location.state || {};   

  return (
    <div className='ProductDesPage-container'>
      <ProcuctDes 
        image={image} 
        category={category} 
        description={description} 
        price={price} 
        title={title} 
      />
    </div>
  );
}

export default ProductDesPage;
