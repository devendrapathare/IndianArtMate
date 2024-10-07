import React, { useEffect } from 'react'
import './ProcuctDes.css'
import FirstProductDes from './FirstProductDes/FirstProductDes'
import SecondProductDesDisplay from './SecondProcuctDes/SecondProductDesDisplay/SecondProductDesDisplay'
import ThirdProductDes from'./ThirdProductDes/ThirdProductDes'
import { usePostContext } from '../../context/PostContext/PostContext'
import {  useAuthContext } from '../../context/AuthContext/AuthContext'

const ProcuctDes = ({ image,category,description,price,title,userId,id ,isOwner,totalLike,totaldisLike }) => {

  
  return (
    <div className='ProductDes-container'>
      <FirstProductDes image={image} category={category} description={description} price={price} title={title} userId={userId} id={id} isOwner={isOwner} totalLike={totalLike} totaldisLike={totaldisLike} />
      <div className="using-hr"></div>
      <SecondProductDesDisplay />
      <div className="using-hr"></div>
      <ThirdProductDes description={description} />
      <div className="using-hr"></div>
    </div>
  )
}

export default ProcuctDes
