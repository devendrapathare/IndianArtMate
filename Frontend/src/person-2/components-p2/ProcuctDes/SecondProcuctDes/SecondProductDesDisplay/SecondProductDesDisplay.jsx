import React from 'react'
import './SecondProductDesDisplay.css'
import SecondProcuctDes from '../SecondProcuctDes'
import { forSecondProductDes } from '../../../../../assets/assets'

const SecondProductDesDisplay = () => {
    return (
        <div className='SecondProductDesDisplay-container'>
            {forSecondProductDes.map((item) => {
                return (
                    <SecondProcuctDes key={item.id} img={item.img} title={item.title} />
                )
            })}
        </div>
    )
}

export default SecondProductDesDisplay
