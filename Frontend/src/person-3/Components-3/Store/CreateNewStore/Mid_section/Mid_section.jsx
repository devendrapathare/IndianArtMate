import React from 'react'
import './Mid_section.css'
import { artistProfile } from '../../../../../assets/assets'

const Mid_section = () => {
  return (
    <>
    <div className="mid-secton-top">
        <h2><u> Your Store Arties  </u></h2>
        <button id = 'mid-secton-top_btn'>Hire Arties</button>
    </div>
    <div className='mid_section-bottom'>
       {artistProfile.map((item) => (
               <div key={item.id} className="artist_card">
                <div className="artist_card_left">
                        <img src={item.image} alt={`${item.name}`} className="artist_image" />
                </div>
                <div className="artist_card_right">
                    <h3>{item.name}</h3>
                    <p>Respecters: {item.respecters}</p>
                    <p id = 'Contact_info'>Contact no: {item.Contact_info}</p>
                </div>
             </div>
            ))}
    </div>
    </>
  )
}

export default Mid_section
