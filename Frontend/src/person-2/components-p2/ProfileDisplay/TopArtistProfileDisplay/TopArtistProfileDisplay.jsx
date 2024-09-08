import React from 'react'
import './TopArtistProfileDisplay.css'
import TopArtistProfile from '../../Profile/TopArtistProfile/TopArtistProfile'
import { artistProfile } from '../../../../assets/assets'

const TopArtistProfileDisplay = () => {

    return (
        <div className='TopArtistProfileDisplay-container'>
            <div className="TopArtistProfile-header">
                <p>Top Artists Profile</p>
            </div>
            <div className="mapping">
            {artistProfile.map((item) => (
                <TopArtistProfile key={item.id} name={item.name} image={item.image} respecters={item.respecters} />
            ))}
            </div>
        </div>
    )
}

export default TopArtistProfileDisplay
