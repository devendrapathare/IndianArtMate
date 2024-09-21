import React from 'react'
import './ProcuctDes.css'
import FirstProductDes from './FirstProductDes/FirstProductDes'
import SecondProductDesDisplay from './SecondProcuctDes/SecondProductDesDisplay/SecondProductDesDisplay'
import ThirdProductDes from'./ThirdProductDes/ThirdProductDes'

const ProcuctDes = ({ image,category,description,price,title }) => {
  
  return (
    <div className='ProductDes-container'>
      <FirstProductDes image={image} category={category} description={description} price={price} title={title} />
      <div className="using-hr"></div>
      <SecondProductDesDisplay />
      <div className="using-hr"></div>
      <ThirdProductDes description={description} />
      <div className="using-hr"></div>
    </div>
  )
}

export default ProcuctDes
