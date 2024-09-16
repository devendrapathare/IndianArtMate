import React from 'react'
import './SecondProcuctDes.css'
import { assets } from '../../../../assets/assets'

const SecondProcuctDes = ({img,title}) => {
  return (
    <div className='SecondProcuctDes-container'>
      <div className="first-icon">
        <div className='first-icon-img'>
          <img src={img} alt="img" />
        </div>
        <div className='first-icon-text'>
          <p>{title}</p>
        </div>
      </div>
    </div>
  )
}

export default SecondProcuctDes
