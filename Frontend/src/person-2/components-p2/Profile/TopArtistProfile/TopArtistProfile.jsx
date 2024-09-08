import React from 'react'
import './TopArtistProfile.css'

const TopArtistProfile = ({name,image,respecters}) => {
    return (
        <div className='TopArtistProfile-container'>
            <div className="artist-profile-content">
                <div className="artist-profile-image">
                    <img src={image} alt="Artist Profile" />
                </div>
                <div className="name-respecters">
                    <p>{name}</p>
                    <p id='respecters'><span>{respecters}</span> Respecters</p>
                </div>
            </div>
            <hr />
        </div>
    )
}

export default TopArtistProfile
