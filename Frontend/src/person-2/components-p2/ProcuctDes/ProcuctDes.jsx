import React from 'react'
import './ProcuctDes.css'
import FirstProductDes from './FirstProductDes/FirstProductDes'
import SecondProductDesDisplay from './SecondProcuctDes/SecondProductDesDisplay/SecondProductDesDisplay'
import ThirdProductDes from'./ThirdProductDes/ThirdProductDes'

const ProcuctDes = () => {
  return (
    <div className='ProductDes-container'>
      <FirstProductDes />
      <div className="using-hr"></div>
      <SecondProductDesDisplay />
      <div className="using-hr"></div>
      <ThirdProductDes />
      <div className="using-hr"></div>
    </div>
  )
}

export default ProcuctDes
