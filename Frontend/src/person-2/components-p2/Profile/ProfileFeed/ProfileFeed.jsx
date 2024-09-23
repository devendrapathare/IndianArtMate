import React from 'react';
import './ProfileFeed.css';
import { usePostContext } from '../../../context/PostContext/PostContext';
import { useNavigate } from 'react-router-dom';
const ProfileFeed = ({ image,category,description,price,title }) => {

  const{ url } = usePostContext()
  console.log("url:",url)
  const navigate = useNavigate()
  const handlePostClick = () =>{
    navigate('/productDes',{state:
      {image:`${url}/images/${image}`,
      category,
      description,
      price,
      title
    }})
  }
  console.log(image,category,description,price,title);
  
  return (
    <div className='ProfileFeed-container'>
        <div className="profileFeed-feed">
            <img onClick={handlePostClick} src={url+"/images/"+image} alt={`${title}`} />
        </div>
    </div>
  );
}

export default ProfileFeed;
