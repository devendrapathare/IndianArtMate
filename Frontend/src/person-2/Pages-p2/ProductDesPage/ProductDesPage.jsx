import React, { useEffect } from 'react';
import './ProductDesPage.css';
import ProcuctDes from '../../components-p2/ProcuctDes/ProcuctDes';
import { useLocation } from 'react-router-dom';

const ProductDesPage = () => {
  const location = useLocation();
  const { image, category, description, price, title, userId, id, isOwner, totalLike, totaldisLike = null } = location.state || {}; 
  // console.log("ProductDesPage:",userId);
  // console.log("ProductDesPageid:",totaldisLike);
    
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
