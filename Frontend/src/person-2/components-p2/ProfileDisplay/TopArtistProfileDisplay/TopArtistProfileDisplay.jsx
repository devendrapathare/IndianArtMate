import React from 'react'
import './TopArtistProfileDisplay.css'
import TopArtistProfile from '../../Profile/TopArtistProfile/TopArtistProfile'

const TopArtistProfileDisplay = () => {

    return (
        <div className='TopArtistProfileDisplay-container'>
            <div className="TopArtistProfile-header">
                <p>More Artists Profile</p>
            </div>
            <div className="mapping">
                <TopArtistProfile  />
            </div>
        </div>
    )
}

export default TopArtistProfileDisplay
