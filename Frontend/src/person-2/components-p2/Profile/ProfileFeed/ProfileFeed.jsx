import React, { useContext } from 'react';
import './ProfileFeed.css';
import { usePostContext } from '../../../context/PostContext/PostContext';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../../context/CartContext/CartContext';
const ProfileFeed = ({ image,category,description,price,title,userId,id,like,disLike }) => {

  const{ url } = usePostContext()
  const navigate = useNavigate()
  // console.log(disLike.length);
  const totalLike = like.length;  
  const totaldisLike = disLike.length;  
  
  const handlePostClick = () =>{
    navigate('/productDes',{state:
      {image:`${url}/images/${image}`,
      category,
      description,
      price,
      title,
      userId,
      id,
      totalLike,
      totaldisLike
    }})
  } 
  // console.log("ProfileFeed:",url+"/images/"+image);
  // console.log(image);
  
  return (
    <div className='ProfileFeed-container'>
        <div className="profileFeed-feed">
            <img onClick={handlePostClick} src={url+"/images/"+image} alt={`${title}`} />
        </div>
    </div>
  );
}

export default ProfileFeed;
