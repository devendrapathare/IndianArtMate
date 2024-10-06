import React from 'react';
import './ProductDesPage.css';
import ProcuctDes from '../../components-p2/ProcuctDes/ProcuctDes';
import { useLocation } from 'react-router-dom';

const ProductDesPage = () => {
  const location = useLocation();
  const { image, category, description, price, title, userId, id ,isOwner,totalLike,totaldisLike = null } = location.state || {}; 
  // console.log("ProductDesPage:",userId);
  // console.log("ProductDesPageid:",totaldisLike);
    

  return (
    <div className='ProductDesPage-container'>
      <ProcuctDes 
        image={image} 
        category={category} 
        description={description} 
        price={price} 
        title={title}
        userId={userId}
        id={id}
        isOwner = {isOwner}
        totalLike={totalLike}
        totaldisLike={totaldisLike}
      />
    </div>
  );
}

export default ProductDesPage;
