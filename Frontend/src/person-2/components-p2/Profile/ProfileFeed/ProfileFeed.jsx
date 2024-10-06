import React, { useContext } from 'react';
import './ProfileFeed.css';
import { usePostContext } from '../../../context/PostContext/PostContext';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../../context/CartContext/CartContext';
const ProfileFeed = ({ image,category,description,price,title,userId,id }) => {

  const{ url } = usePostContext()
  const navigate = useNavigate()
  
  const handlePostClick = () =>{
    navigate('/productDes',{state:
      {image:`${url}/images/${image}`,
      category,
      description,
      price,
      title,
      userId,
      id
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
